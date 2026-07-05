import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCTS, BRANDS, MAX_PRICE, getCategoryBySlug } from "../data/products";
import { getSectionBySlug } from "../data/sections";
import { ProductCard } from "../components/shop/ProductCard";
import { CatalogSections } from "../components/shop/CatalogSections";
import { CategorySidebar } from "../components/shop/CategorySidebar";
import { filterProducts, sortProducts } from "../components/shop/SectionCatalogView";
import { ScrollReveal } from "../components/effects/ScrollReveal";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "discount";
const PAGE_SIZE = 24;

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const catFilter = searchParams.get("cat");
  const sectionFilter = searchParams.get("seccion");
  const queryFilter = searchParams.get("q");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const [sort, setSort] = useState<SortOption>("featured");
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState(MAX_PRICE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const activeCategory = catFilter ? getCategoryBySlug(catFilter) : undefined;
  const activeSection = sectionFilter ? getSectionBySlug(sectionFilter) : undefined;

  const showSectionsOverview =
    !catFilter && !sectionFilter && !queryFilter && !brandFilter && priceMax >= MAX_PRICE;

  const showSectionGrouped =
    Boolean(sectionFilter && activeSection && !catFilter);

  const showFlatList = !showSectionsOverview && !showSectionGrouped;

  const filtered = useMemo(() => {
    if (!showFlatList) return [];

    let result = [...PRODUCTS];

    if (catFilter) {
      result = result.filter((p) => p.catSlug === catFilter);
    }

    result = filterProducts(result, { brandFilter, priceMax, queryFilter });
    return sortProducts(result, sort);
  }, [showFlatList, catFilter, queryFilter, brandFilter, priceMax, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage],
  );

  const setPage = (next: number) => {
    const params = new URLSearchParams(searchParams);
    if (next <= 1) params.delete("page");
    else params.set("page", String(next));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setBrandFilter(null);
    setPriceMax(MAX_PRICE);
    setSort("featured");
    setSearchParams({});
  };

  const hasActiveFilters = brandFilter || priceMax < MAX_PRICE;

  const pageTitle = queryFilter
    ? `Resultados: "${queryFilter}"`
    : activeCategory
      ? activeCategory.full
      : activeSection
        ? activeSection.full
        : "Catálogo por secciones";

  const showToolbar = showFlatList;

  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="mb-8">
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2">
              Inicio / Tienda
              {activeSection && !activeCategory ? ` / ${activeSection.name}` : ""}
              {activeCategory ? ` / ${activeCategory.full}` : ""}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">{pageTitle}</h1>
            <p className="text-muted-foreground mt-2">
              {showSectionsOverview
                ? `${PRODUCTS.length} productos organizados en secciones`
                : showSectionGrouped
                  ? `Elige una categoría · ${activeSection?.categories.length ?? 0} disponibles`
                  : `${filtered.length} productos · Equipamiento premium de pesca submarina`}
            </p>
          </div>
        </ScrollReveal>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-28 space-y-5">
              <CategorySidebar catFilter={catFilter} sectionFilter={sectionFilter} />

              <div className="rounded-sm border border-border bg-card p-4 shadow-lg shadow-black/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3">Marca</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {BRANDS.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setBrandFilter(brandFilter === brand ? null : brand)}
                      className={`block w-full text-left text-sm py-1 transition-colors ${brandFilter === brand ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {showToolbar && (
                <div className="rounded-sm border border-border bg-card p-4 shadow-lg shadow-black/10">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
                    Precio máx: <span className="text-foreground font-mono">€{priceMax}</span>
                  </h3>
                  <input
                    type="range"
                    min={10}
                    max={MAX_PRICE}
                    value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              )}

              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-sm text-primary hover:underline flex items-center gap-1 w-full justify-center py-2 border border-primary/30 rounded-sm bg-primary/5">
                  <X className="w-3 h-3" /> Limpiar filtros
                </button>
              )}
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {showToolbar && (
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-2 rounded-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filtros
                </button>

                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="bg-card border border-border text-sm text-foreground px-3 py-2 rounded-sm focus:outline-none focus:border-primary"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="rating">Mejor valorados</option>
                  <option value="discount">Mayor descuento</option>
                </select>

                {showFlatList && (
                  <div className="hidden sm:flex items-center gap-1 border border-border rounded-sm">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                      aria-label="Vista cuadrícula"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                      aria-label="Vista lista"
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {(brandFilter || catFilter || sectionFilter) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {sectionFilter && activeSection && !catFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/30 px-2.5 py-1 rounded-sm font-mono">
                    {activeSection.name}
                  </span>
                )}
                {catFilter && activeCategory && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/30 px-2.5 py-1 rounded-sm font-mono">
                    {activeCategory.name}
                  </span>
                )}
                {brandFilter && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/30 px-2.5 py-1 rounded-sm font-mono">
                    {brandFilter}
                    <button onClick={() => setBrandFilter(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {showSectionsOverview ? (
              <CatalogSections />
            ) : showSectionGrouped && activeSection ? (
              <CatalogSections
                sections={[activeSection]}
                showAllCategories
                hideSectionHeader
              />
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-foreground font-semibold text-lg mb-2">No se encontraron productos</p>
                <p className="text-muted-foreground text-sm mb-6">Prueba con otros filtros o categorías</p>
                <button onClick={clearFilters} className="text-primary hover:underline text-sm">Limpiar filtros</button>
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className={viewMode === "grid" ? "product-grid" : "flex flex-col gap-4"}
                >
                  <AnimatePresence mode="popLayout">
                    {paginated.map((p, i) => (
                      <ProductCard key={p.id} product={p} index={i} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Paginación">
                    <button
                      onClick={() => setPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-2 text-sm border border-border rounded-sm disabled:opacity-40 hover:border-primary/40 transition-colors"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let p = i + 1;
                      if (totalPages > 7) {
                        const start = Math.max(1, Math.min(currentPage - 3, totalPages - 6));
                        p = start + i;
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 text-sm border rounded-sm transition-colors ${
                            p === currentPage
                              ? "bg-primary text-primary-foreground border-primary"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-2 text-sm border border-border rounded-sm disabled:opacity-40 hover:border-primary/40 transition-colors"
                    >
                      Siguiente
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-card border-r border-border z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-foreground">Filtros</h2>
                <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6">
                <CategorySidebar
                  catFilter={catFilter}
                  sectionFilter={sectionFilter}
                  onNavigate={() => setFiltersOpen(false)}
                />
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-widest mb-3">Precio máx: €{priceMax}</h3>
                  <input type="range" min={10} max={MAX_PRICE} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} className="w-full accent-primary" />
                </div>
                <div>
                  <h3 className="text-[11px] font-mono uppercase tracking-widest mb-3">Marca</h3>
                  {BRANDS.slice(0, 12).map(brand => (
                    <button key={brand} onClick={() => setBrandFilter(brandFilter === brand ? null : brand)} className={`block w-full text-left text-sm py-1.5 ${brandFilter === brand ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                      {brand}
                    </button>
                  ))}
                </div>
                <button onClick={() => setFiltersOpen(false)} className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-sm">
                  Ver resultados
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
