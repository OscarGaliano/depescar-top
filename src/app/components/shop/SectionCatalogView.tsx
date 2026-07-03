import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../../types/shop";
import type { CatalogSection } from "../../data/sections";
import { PRODUCTS } from "../../data/products";
import { ProductCard } from "./ProductCard";
import { ScrollReveal } from "../effects/ScrollReveal";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "discount";

interface SectionCatalogViewProps {
  section: CatalogSection;
  sort: SortOption;
  brandFilter: string | null;
  priceMax: number;
  queryFilter: string | null;
}

function sortProducts(products: Product[], sort: SortOption) {
  const result = [...products];
  switch (sort) {
    case "price-asc": result.sort((a, b) => a.sale - b.sale); break;
    case "price-desc": result.sort((a, b) => b.sale - a.sale); break;
    case "rating": result.sort((a, b) => b.rating - a.rating); break;
    case "discount": result.sort((a, b) => b.disc - a.disc); break;
  }
  return result;
}

function filterProducts(
  products: Product[],
  { brandFilter, priceMax, queryFilter }: Pick<SectionCatalogViewProps, "brandFilter" | "priceMax" | "queryFilter">,
) {
  let result = products;
  if (brandFilter) result = result.filter((p) => p.brand === brandFilter);
  result = result.filter((p) => p.sale <= priceMax);
  if (queryFilter) {
    const q = queryFilter.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.cat.toLowerCase().includes(q),
    );
  }
  return result;
}

export function SectionCatalogView({
  section,
  sort,
  brandFilter,
  priceMax,
  queryFilter,
}: SectionCatalogViewProps) {
  const grouped = useMemo(() => {
    const sectionProducts = PRODUCTS.filter((p) =>
      section.categories.some((c) => c.slug === p.catSlug),
    );
    const filtered = filterProducts(sectionProducts, { brandFilter, priceMax, queryFilter });

    return section.categories
      .map((cat) => ({
        category: cat,
        products: sortProducts(
          filtered.filter((p) => p.catSlug === cat.slug),
          sort,
        ),
      }))
      .filter((g) => g.products.length > 0);
  }, [section, sort, brandFilter, priceMax, queryFilter]);

  if (grouped.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground font-semibold text-lg mb-2">No hay productos en esta sección</p>
        <p className="text-muted-foreground text-sm">Prueba con otros filtros o elige otra categoría</p>
      </div>
    );
  }

  const totalProducts = grouped.reduce((sum, g) => sum + g.products.length, 0);

  return (
    <div className="space-y-14">
      <p className="text-sm text-muted-foreground">
        {totalProducts} productos en {grouped.length} categorías
      </p>

      {grouped.map(({ category, products }, si) => (
        <ScrollReveal key={category.id} delay={si * 0.04}>
          <section aria-labelledby={`cat-group-${category.slug}`} className="border-t border-border pt-10 first:border-t-0 first:pt-0">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div className="min-w-0">
                <p className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1">
                  {products.length} productos
                </p>
                <h2
                  id={`cat-group-${category.slug}`}
                  className="text-xl sm:text-2xl font-bold text-foreground"
                >
                  {category.name}
                </h2>
              </div>
              <Link
                to={`/tienda?seccion=${section.slug}&cat=${category.slug}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
              >
                Ver categoría
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <motion.div layout className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          </section>
        </ScrollReveal>
      ))}
    </div>
  );
}

export { filterProducts, sortProducts };
