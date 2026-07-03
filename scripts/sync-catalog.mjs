#!/usr/bin/env node
/**
 * Sincroniza el catálogo completo de depescar.top vía WooCommerce Store API.
 * Genera JSON en src/app/data/catalog/ e imágenes en public/catalog/images/
 *
 * Uso: node scripts/sync-catalog.mjs
 *      node scripts/sync-catalog.mjs --skip-images   (solo metadatos)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src/app/data/catalog");
const IMG_DIR = path.join(ROOT, "public/catalog/images");

const BASE = "https://depescar.top/wp-json/wc/store/v1";
const UA = "DepescarCatalogSync/1.0 (+https://depescar.top)";
const SKIP_IMAGES = process.argv.includes("--skip-images");
const CONCURRENCY = 12;

function stripHtml(html = "") {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&euro;/g, "€")
    .replace(/\s+/g, " ")
    .trim();
}

function priceFromMinor(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) / 100 : 0;
}

function extFromUrl(url) {
  const clean = url.split("?")[0];
  const m = clean.match(/\.(jpe?g|png|webp|gif)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "jpg";
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const data = await res.json();
  return { data, headers: res.headers };
}

async function fetchAllPages(endpoint, perPage = 100) {
  const items = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const url = `${BASE}${endpoint}${endpoint.includes("?") ? "&" : "?"}per_page=${perPage}&page=${page}`;
    const { data, headers } = await fetchJson(url);
    items.push(...data);
    totalPages = Number(headers.get("X-Wp-Totalpages") || 1);
    process.stdout.write(`\r  ${endpoint.split("?")[0]} página ${page}/${totalPages} (${items.length} items)`);
    page += 1;
  }
  process.stdout.write("\n");
  return items;
}

async function fetchWpBrands() {
  const items = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const url = `https://depescar.top/wp-json/wp/v2/pwb-brand?per_page=100&page=${page}`;
    const { data, headers } = await fetchJson(url);
    items.push(...data.map((b) => b.name));
    totalPages = Number(headers.get("X-Wp-Totalpages") || 1);
    page += 1;
  }
  return items.sort((a, b) => b.length - a.length);
}

function inferBrand(name, brands) {
  const lower = name.toLowerCase();
  for (const b of brands) {
    if (lower.startsWith(b.toLowerCase())) return b;
  }
  return "";
}

async function downloadImage(url, dest) {
  if (fs.existsSync(dest)) return true;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return true;
}

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function badgeFor(product, disc) {
  if (product.on_sale && disc >= 40) return "Oferta Extrema";
  if (product.on_sale && disc >= 20) return "Oferta";
  if (product.review_count >= 20 && Number(product.average_rating) >= 4.8) return "Más vendido";
  return null;
}

function mapProduct(raw, imageMap, brandNames) {
  const regular = priceFromMinor(raw.prices?.regular_price);
  const sale = priceFromMinor(raw.prices?.sale_price || raw.prices?.price);
  const price = priceFromMinor(raw.prices?.price);
  const finalSale = raw.on_sale && sale > 0 ? sale : price || regular;
  const orig = regular > 0 ? regular : finalSale;
  const disc = orig > finalSale ? Math.round(((orig - finalSale) / orig) * 100) : 0;

  const cat = raw.categories?.[0];
  const brand = raw.brands?.[0]?.name || inferBrand(raw.name, brandNames);
  const desc = stripHtml(raw.short_description || raw.description).slice(0, 500);

  const localImages = (imageMap.get(raw.id) || []).filter(Boolean);
  const img = localImages[0] || raw.images?.[0]?.src || "";

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    cat: cat?.name || "Pesca submarina",
    catSlug: cat?.slug || "",
    orig,
    sale: finalSale,
    disc,
    brand,
    img,
    images: localImages.length ? localImages : raw.images?.map((i) => i.src) || [img],
    rating: Number(raw.average_rating) || 0,
    rev: raw.review_count || 0,
    badge: badgeFor(raw, disc),
    description: desc || raw.name,
    features: [],
    stock: raw.is_in_stock ? 99 : 0,
    sku: raw.sku || `DEP-${raw.id}`,
    permalink: raw.permalink,
    inStock: Boolean(raw.is_in_stock),
    type: raw.type,
  };
}

async function main() {
  console.log("🐟 Sincronizando catálogo de depescar.top...\n");

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(IMG_DIR, { recursive: true });

  console.log("📦 Descargando categorías...");
  const rawCategories = await fetchAllPages("/products/categories");

  console.log("📦 Descargando marcas...");
  const brandNames = await fetchWpBrands();

  console.log("📦 Descargando productos...");
  const rawProducts = await fetchAllPages("/products");

  const imageMap = new Map();
  const downloadTasks = [];

  if (!SKIP_IMAGES) {
    console.log(`🖼️  Preparando descarga de imágenes (${rawProducts.length} productos)...`);
    for (const p of rawProducts) {
      const imgs = p.images || [];
      if (!imgs.length) continue;
      const paths = [];
      imgs.forEach((img, i) => {
        const ext = extFromUrl(img.src);
        const rel = `/catalog/images/${p.id}/${i}.${ext}`;
        const dest = path.join(ROOT, "public", rel);
        paths.push(rel);
        downloadTasks.push({ url: img.src, dest });
      });
      imageMap.set(p.id, paths);
    }

    console.log(`⬇️  Descargando ${downloadTasks.length} imágenes...`);
    let done = 0;
    await pool(downloadTasks, CONCURRENCY, async (task) => {
      await downloadImage(task.url, task.dest);
      done += 1;
      if (done % 50 === 0 || done === downloadTasks.length) {
        process.stdout.write(`\r  ${done}/${downloadTasks.length} imágenes`);
      }
    });
    process.stdout.write("\n");
  } else {
    for (const p of rawProducts) {
      imageMap.set(
        p.id,
        (p.images || []).map((img, i) => {
          const ext = extFromUrl(img.src);
          return `/catalog/images/${p.id}/${i}.${ext}`;
        }),
      );
    }
  }

  const products = rawProducts
    .filter((p) => (p.images?.length || 0) > 0)
    .map((p) => mapProduct(p, imageMap, brandNames));

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );

  const maxPrice = Math.ceil(Math.max(...products.map((p) => p.sale), 300) / 50) * 50;

  const allCategories = rawCategories
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((c, i) => {
      const src = c.image?.src;
      const ext = src ? extFromUrl(src) : "jpg";
      const imgLocal = src ? `/catalog/images/categories/${c.id}.${ext}` : "";
      return {
        id: c.id,
        name: c.name,
        full: c.name,
        slug: c.slug,
        count: c.count,
        img: imgLocal || src || "",
        _imgSrc: src || "",
      };
    });

  if (!SKIP_IMAGES) {
    const catTasks = allCategories.filter((c) => c._imgSrc).map((c) => ({
      url: c._imgSrc,
      dest: path.join(ROOT, "public", c.img),
    }));
    if (catTasks.length) {
      console.log(`⬇️  Descargando ${catTasks.length} imágenes de categoría...`);
      await pool(catTasks, CONCURRENCY, async (t) => downloadImage(t.url, t.dest));
    }
  }

  const featured = allCategories
    .filter((c) => !c.slug.startsWith("entrega-inmediata"))
    .slice(0, 8)
    .map(({ _imgSrc, ...c }) => c);

  const categoriesOut = {
    featured,
    all: allCategories.map(({ _imgSrc, ...c }) => c),
  };

  const catalogOut = {
    syncedAt: new Date().toISOString(),
    source: "https://depescar.top",
    total: products.length,
    maxPrice,
    brands,
    products,
  };

  fs.writeFileSync(path.join(DATA_DIR, "catalog.json"), JSON.stringify(catalogOut));
  fs.writeFileSync(path.join(DATA_DIR, "categories.json"), JSON.stringify(categoriesOut));

  const meta = {
    products: products.length,
    categories: allCategories.length,
    brands: brands.length,
    images: downloadTasks.length,
    syncedAt: catalogOut.syncedAt,
  };
  fs.writeFileSync(path.join(DATA_DIR, "meta.json"), JSON.stringify(meta, null, 2));

  console.log("\n✅ Catálogo sincronizado:");
  console.log(`   ${meta.products} productos`);
  console.log(`   ${meta.categories} categorías`);
  console.log(`   ${meta.brands} marcas`);
  if (!SKIP_IMAGES) console.log(`   ${meta.images} imágenes`);
  console.log(`   → src/app/data/catalog/catalog.json`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
