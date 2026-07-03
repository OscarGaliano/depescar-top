import type { Category } from "../types/shop";
import { ALL_CATEGORIES, PRODUCTS } from "./products";

export interface CatalogSection {
  slug: string;
  name: string;
  full: string;
  img: string;
  count: number;
  productCount: number;
  categories: Category[];
}

const SECTION_META: {
  slug: string;
  name: string;
  full: string;
  img?: string;
}[] = [
  { slug: "fusiles", name: "Fusiles", full: "Fusiles de pesca submarina", img: "/images/categories/fusiles.png" },
  { slug: "recambios-fusil", name: "Recambios fusil", full: "Recambios, gomas y varillas" },
  { slug: "trajes", name: "Trajes", full: "Trajes y ropa de neopreno", img: "/images/categories/trajes.png" },
  { slug: "mascaras", name: "Máscaras", full: "Máscaras, tubos y snorkels", img: "/images/categories/mascaras.png" },
  { slug: "aletas", name: "Aletas", full: "Aletas, palas y calzantes" },
  { slug: "boyas", name: "Boyas", full: "Boyas y seguridad en superficie", img: "/images/categories/boyas.png" },
  { slug: "lastre", name: "Lastre", full: "Cinturones, chalecos y plomos" },
  { slug: "guantes-escarpines", name: "Guantes", full: "Guantes y escarpines" },
  { slug: "cuchillos", name: "Cuchillos", full: "Cuchillos y accesorios" },
  { slug: "mochilas-transporte", name: "Mochilas", full: "Mochilas y transporte de equipo" },
  { slug: "linternas-camaras", name: "Linternas", full: "Linternas y cámaras subacuáticas" },
  { slug: "ordenadores", name: "Ordenadores", full: "Ordenadores de apnea y pescasub" },
  { slug: "entrega-inmediata", name: "Entrega 24h", full: "Entrega inmediata" },
  { slug: "outlet", name: "Outlet", full: "Outlet y ofertas" },
  { slug: "otros", name: "Otros", full: "Otros productos" },
];

const COMPLETE_FUSIL_SLUGS = new Set([
  "fusiles-aluminio-pesca-submarina",
  "fusiles-carbono-pesca-submarina",
  "fusiles-roller-aluminio-pesca-submarina",
  "fusiles-roller-carbono-pesca-submarina",
  "fusiles-aire-comprimido-pesca-submarina",
  "fusiles-madera-pesca-submarina",
]);

function isMascarasSlug(slug: string) {
  return slug.includes("mascara") || slug.includes("snorkel") || slug === "entrega-inmediata-mascaras-tubos-pesca-submarina";
}

function isTrajesSlug(slug: string) {
  return (
    slug.includes("traje") ||
    slug.startsWith("ropa-") ||
    slug.includes("accesorios-trajes") ||
    slug.includes("recambios-cola-neopreno") ||
    slug === "entrega-inmediata-ropa-pesca-submarina" ||
    slug === "outlet-ropa-pesca-submarina"
  );
}

function isRecambiosFusilSlug(slug: string) {
  if (COMPLETE_FUSIL_SLUGS.has(slug)) return false;
  return (
    slug.includes("fusil") ||
    slug.includes("varilla") ||
    slug.includes("goma") ||
    slug.includes("obus") ||
    slug.includes("culata") ||
    slug.includes("cabezal") ||
    slug.includes("carrete") ||
    slug.includes("empunadura") ||
    slug.includes("recambios") ||
    slug.includes("dyneema") ||
    slug.includes("monofilamento") ||
    slug.includes("grapas") ||
    slug.includes("tensor") ||
    slug.includes("mosqueton") ||
    slug.includes("mecanismo") ||
    slug.includes("tubos-") ||
    slug.includes("fundas-fusil") ||
    slug.includes("flotadores-fusil") ||
    slug.includes("madera-fusil") ||
    slug.includes("guardamontes") ||
    slug.includes("crimpadora") ||
    slug.includes("aletillas") ||
    slug.includes("cabo-encerado") ||
    slug.includes("tapones-goma") ||
    slug.includes("guia-hilos") ||
    slug.includes("adaptadores-carretes") ||
    slug.includes("accesorios-fusiles") ||
    slug.includes("accesorios-varillas") ||
    slug.includes("accesorios-carretes")
  );
}

export function resolveSectionSlug(catSlug: string): string {
  if (catSlug.startsWith("entrega-inmediata")) return "entrega-inmediata";
  if (catSlug.startsWith("outlet") || catSlug.includes("oferta-expres")) return "outlet";
  if (catSlug.includes("ordenador")) return "ordenadores";
  if (isMascarasSlug(catSlug)) return "mascaras";
  if (isTrajesSlug(catSlug)) return "trajes";
  if (
    catSlug.includes("aleta") ||
    catSlug.includes("pala-") ||
    catSlug.includes("calzante") ||
    catSlug.includes("perfil-aletas") ||
    catSlug.includes("mochila-aletas") ||
    catSlug.includes("tornillos-aletas") ||
    catSlug.includes("sujeta-aleta")
  ) {
    return "aletas";
  }
  if (COMPLETE_FUSIL_SLUGS.has(catSlug)) return "fusiles";
  if (isRecambiosFusilSlug(catSlug)) return "recambios-fusil";
  if (catSlug.includes("boya") || catSlug.includes("fondeo") || catSlug.includes("cabo-flotante") || catSlug.includes("plegadoras")) {
    return "boyas";
  }
  if (
    catSlug.includes("lastre") ||
    catSlug.includes("cinturon") ||
    catSlug.includes("chaleco") ||
    catSlug.includes("plomo") ||
    catSlug.includes("contrapeso") ||
    catSlug.includes("accesorios-cinturones")
  ) {
    return "lastre";
  }
  if (catSlug.includes("cuchillo")) return "cuchillos";
  if (catSlug.includes("guante") || catSlug.includes("escarpin")) return "guantes-escarpines";
  if (catSlug.includes("linterna") || catSlug.includes("camara") || catSlug.includes("cargadores-baterias")) {
    return "linternas-camaras";
  }
  if (
    catSlug.includes("mochila") ||
    catSlug.includes("cajon-transporte") ||
    catSlug.includes("neveras") ||
    catSlug === "pack-completo-equipo-pesca-submarina"
  ) {
    return "mochilas-transporte";
  }
  return "otros";
}

const categorySectionMap = new Map<string, string>();
for (const cat of ALL_CATEGORIES) {
  categorySectionMap.set(cat.slug, resolveSectionSlug(cat.slug));
}

const productCountBySection = new Map<string, number>();
for (const p of PRODUCTS) {
  const section = categorySectionMap.get(p.catSlug) ?? "otros";
  productCountBySection.set(section, (productCountBySection.get(section) ?? 0) + 1);
}

const categoriesBySection = new Map<string, Category[]>();
for (const cat of ALL_CATEGORIES) {
  const section = categorySectionMap.get(cat.slug) ?? "otros";
  const list = categoriesBySection.get(section) ?? [];
  list.push(cat);
  categoriesBySection.set(section, list);
}

for (const [, cats] of categoriesBySection) {
  cats.sort((a, b) => b.count - a.count);
}

export const CATALOG_SECTIONS: CatalogSection[] = SECTION_META.map((meta) => {
  const categories = categoriesBySection.get(meta.slug) ?? [];
  const productCount = productCountBySection.get(meta.slug) ?? 0;
  const count = categories.reduce((sum, c) => sum + c.count, 0);
  const img = meta.img ?? categories[0]?.img ?? "/images/categories/fusiles.png";

  return {
    slug: meta.slug,
    name: meta.name,
    full: meta.full,
    img,
    count,
    productCount,
    categories,
  };
}).filter((s) => s.categories.length > 0 || s.productCount > 0);

export function getSectionBySlug(slug: string) {
  return CATALOG_SECTIONS.find((s) => s.slug === slug);
}

export function getSectionForCategory(catSlug: string) {
  return getSectionBySlug(categorySectionMap.get(catSlug) ?? "otros");
}

export function getCategorySlugsForSection(sectionSlug: string) {
  const section = getSectionBySlug(sectionSlug);
  return section?.categories.map((c) => c.slug) ?? [];
}

export function productBelongsToSection(productCatSlug: string, sectionSlug: string) {
  return categorySectionMap.get(productCatSlug) === sectionSlug;
}
