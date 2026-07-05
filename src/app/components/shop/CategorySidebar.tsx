import { useState, useEffect } from "react";
import { ChevronDown, LayoutGrid, Fish } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { CATALOG_SECTIONS } from "../../data/sections";
import type { Category } from "../../types/shop";

interface CategorySidebarProps {
  catFilter: string | null;
  sectionFilter: string | null;
  onNavigate?: () => void;
}

function SectionNavLink({
  href,
  active,
  children,
  onNavigate,
  className = "",
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={`block rounded-sm px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-foreground/90 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
      } ${className}`}
    >
      {children}
    </a>
  );
}

function CategoryLink({
  cat,
  active,
  sectionSlug,
  onNavigate,
}: {
  cat: Category;
  active: boolean;
  sectionSlug: string;
  onNavigate?: () => void;
}) {
  return (
    <li>
      <a
        href={`/tienda?seccion=${sectionSlug}&cat=${cat.slug}`}
        onClick={onNavigate}
        className={`flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm transition-all ${
          active
            ? "bg-primary/15 text-primary font-semibold border border-primary/40"
            : "text-foreground/80 hover:bg-muted hover:text-foreground border border-transparent"
        }`}
      >
        <span className="truncate">{cat.name}</span>
        <span className={`text-[10px] font-mono flex-shrink-0 px-1.5 py-0.5 rounded-sm ${active ? "bg-primary/20" : "bg-muted text-muted-foreground"}`}>
          {cat.count}
        </span>
      </a>
    </li>
  );
}

export function CategorySidebar({ catFilter, sectionFilter, onNavigate }: CategorySidebarProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (sectionFilter) initial.add(sectionFilter);
    else if (catFilter) {
      const match = CATALOG_SECTIONS.find((s) => s.categories.some((c) => c.slug === catFilter));
      if (match) initial.add(match.slug);
    }
    return initial;
  });

  useEffect(() => {
    if (sectionFilter) {
      setOpenSections((prev) => new Set(prev).add(sectionFilter));
    }
    if (catFilter) {
      const match = CATALOG_SECTIONS.find((s) => s.categories.some((c) => c.slug === catFilter));
      if (match) setOpenSections((prev) => new Set(prev).add(match.slug));
    }
  }, [sectionFilter, catFilter]);

  const toggleSection = (slug: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  return (
    <div className="rounded-sm border-2 border-primary/25 bg-card shadow-xl shadow-black/20 overflow-hidden">
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-3 flex items-center gap-2">
        <LayoutGrid className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">
          Navegación del catálogo
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
          <Fish className="w-3.5 h-3.5" />
          Secciones
        </h3>

        {!catFilter && !sectionFilter && (
          <p className="text-xs text-foreground/70 bg-muted/50 border border-border rounded-sm px-3 py-2 mb-3">
            {PRODUCTS.length} productos · {CATALOG_SECTIONS.length} secciones
          </p>
        )}

        <ul className="space-y-1.5 max-h-[42rem] overflow-y-auto pr-1 scrollbar-thin">
          <li>
            <SectionNavLink
              href="/tienda"
              active={!catFilter && !sectionFilter}
              onNavigate={onNavigate}
            >
              Todas las secciones
              <span className="float-right text-[10px] font-mono opacity-80">{PRODUCTS.length}</span>
            </SectionNavLink>
          </li>

          {CATALOG_SECTIONS.map((section) => {
            const isOpen = openSections.has(section.slug);
            const sectionActive = sectionFilter === section.slug && !catFilter;
            const hasActiveCat = Boolean(catFilter && section.categories.some((c) => c.slug === catFilter));

            return (
              <li key={section.slug}>
                <div
                  className={`rounded-sm overflow-hidden border transition-colors ${
                    sectionActive || hasActiveCat
                      ? "border-primary/50 shadow-md shadow-primary/10"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-stretch">
                    <SectionNavLink
                      href={`/tienda?seccion=${section.slug}`}
                      active={sectionActive}
                      onNavigate={() => {
                        setOpenSections((prev) => new Set(prev).add(section.slug));
                        onNavigate?.();
                      }}
                      className="flex-1 min-w-0 rounded-none"
                    >
                      {section.name}
                      <span className="float-right text-[10px] font-mono opacity-80">{section.productCount}</span>
                    </SectionNavLink>
                    {section.categories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleSection(section.slug)}
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? "Ocultar" : "Mostrar"} categorías de ${section.name}`}
                        className={`flex-shrink-0 px-2.5 border-l transition-colors ${
                          sectionActive || hasActiveCat
                            ? "border-primary/30 bg-primary/10 hover:bg-primary/20"
                            : "border-border bg-muted/40 hover:bg-primary/10"
                        }`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {isOpen && section.categories.length > 0 && (
                    <ul className="px-2 py-2 space-y-1 border-t border-border bg-background/80">
                      {section.categories.map((cat) => (
                        <CategoryLink
                          key={cat.id}
                          cat={cat}
                          sectionSlug={section.slug}
                          active={catFilter === cat.slug}
                          onNavigate={onNavigate}
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
