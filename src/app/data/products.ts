import type { Product, Category } from "../types/shop";
import catalogData from "./catalog/catalog.json";
import categoriesData from "./catalog/categories.json";

const FUSILES_CATEGORY_IMG = "/images/categories/fusiles.png";
const MASCARAS_CATEGORY_IMG = "/images/categories/mascaras.png";
const TRAJES_CATEGORY_IMG = "/images/categories/trajes.png";
const BOYAS_CATEGORY_IMG = "/images/categories/boyas.png";

function isMascarasCategory(slug: string): boolean {
  return (
    slug.includes("mascara") ||
    slug.includes("snorkel") ||
    slug === "entrega-inmediata-mascaras-tubos-pesca-submarina"
  );
}

function isTrajesCategory(slug: string): boolean {
  return (
    slug.includes("traje") ||
    slug.startsWith("ropa-") ||
    slug === "entrega-inmediata-ropa-pesca-submarina" ||
    slug === "outlet-ropa-pesca-submarina"
  );
}

function isBoyasCategory(slug: string): boolean {
  return (
    slug.includes("boya") ||
    slug.includes("fondeo") ||
    slug.includes("cabo-flotante") ||
    slug.includes("plegadoras")
  );
}

function categoryImage(c: Category): string {
  if (c.slug.includes("fusil")) return FUSILES_CATEGORY_IMG;
  if (isMascarasCategory(c.slug)) return MASCARAS_CATEGORY_IMG;
  if (isTrajesCategory(c.slug)) return TRAJES_CATEGORY_IMG;
  if (isBoyasCategory(c.slug)) return BOYAS_CATEGORY_IMG;
  return c.img;
}

function withCategoryImageOverrides(categories: Category[]): Category[] {
  return categories.map((c) => ({ ...c, img: categoryImage(c) }));
}

export const PRODUCTS: Product[] = catalogData.products;
export const CATEGORIES: Category[] = withCategoryImageOverrides(categoriesData.featured);
export const ALL_CATEGORIES: Category[] = withCategoryImageOverrides(categoriesData.all);
export const BRANDS: string[] = catalogData.brands;
export const MAX_PRICE: number = catalogData.maxPrice;
export const CATALOG_SYNCED_AT: string = catalogData.syncedAt;

export const FREE_SHIPPING_THRESHOLD = 75;

const bySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));
const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProductBySlug(slug: string) {
  return bySlug.get(slug);
}

export function getProductById(id: number) {
  return byId.get(id);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && (p.catSlug === product.catSlug || p.cat === product.cat),
  ).slice(0, limit);
}

export function getProductAlt(slug: string) {
  const p = bySlug.get(slug);
  return p ? `${p.name} — ${p.cat}` : "Producto de pesca submarina";
}

export function getCategoryBySlug(slug: string) {
  return ALL_CATEGORIES.find((c) => c.slug === slug);
}
