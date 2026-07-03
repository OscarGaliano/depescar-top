import { useState, useEffect } from "react";
import { ChevronDown, LayoutGrid, Fish } from "lucide-react";
import { PRODUCTS } from "../../data/products";
import { CATALOG_SECTIONS, getSectionBySlug } from "../../data/sections";
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
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={`block rounded-sm px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : "text-foreground/90 hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20"
      }`}
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
  const activeSection = sectionFilter ? getSectionBySlug(sectionFilter) : null;
  const sectionsToShow = activeSection ? [activeSection] : CATALOG_SECTIONS;

  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (sectionFilter) initial.add(sectionFilter);
    else if (catFilter) {
      const match = CATALOG_SECTIONS.find((s) => s.categories.some((c) => c.slug === catFilter));
      if (match) initial.add(match.slug);
    } else {
      CATALOG_SECTIONS.slice(0, 5).forEach((s) => initial.add(s.slug));
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

      <div className="p-4 space-y-5">
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3 flex items-center gap-2">
            <Fish className="w-3.5 h-3.5" />
            Secciones
          </h3>
          <ul className="space-y-1.5">
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
            {CATALOG_SECTIONS.map((section) => (
              <li key={section.slug}>
                <SectionNavLink
                  href={`/tienda?seccion=${section.slug}`}
                  active={sectionFilter === section.slug && !catFilter}
                  onNavigate={onNavigate}
                >
                  {section.name}
                  <span className="float-right text-[10px] font-mono opacity-80">{section.productCount}</span>
                </SectionNavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-3">
            Categorías
          </h3>
          {!catFilter && !sectionFilter && (
            <p className="text-xs text-foreground/70 bg-muted/50 border border-border rounded-sm px-3 py-2 mb-3">
              {PRODUCTS.length} productos · {CATALOG_SECTIONS.length} secciones
            </p>
          )}
          <div className="space-y-2 max-h-[36rem] overflow-y-auto pr-1 scrollbar-thin">
            {sectionsToShow.map((section) => {
              const isOpen = openSections.has(section.slug);
              const sectionActive = sectionFilter === section.slug;
              return (
                <div
                  key={section.slug}
                  className={`rounded-sm overflow-hidden border-2 transition-colors ${
                    sectionActive ? "border-primary/50 shadow-md shadow-primary/10" : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(section.slug)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-3 text-left transition-colors ${
                      sectionActive ? "bg-primary/15" : "bg-muted/40 hover:bg-primary/10"
                    }`}
                  >
                    <span className="text-sm font-semibold text-foreground truncate">
                      {section.name}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-primary flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
