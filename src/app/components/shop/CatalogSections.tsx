import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { CatalogSection } from "../../data/sections";
import { CATALOG_SECTIONS } from "../../data/sections";
import { ScrollReveal } from "../effects/ScrollReveal";
import { CategoryCard } from "./CategoryCard";
import { SectionBanner } from "./SectionBanner";

interface CatalogSectionsProps {
  sections?: CatalogSection[];
  compact?: boolean;
  /** Muestra todas las categorías de cada sección (sin límite ni enlace "más") */
  showAllCategories?: boolean;
  /** Oculta cabecera de sección (p. ej. cuando el título ya está en la página) */
  hideSectionHeader?: boolean;
}

export function CatalogSections({
  sections = CATALOG_SECTIONS,
  compact = false,
  showAllCategories = false,
  hideSectionHeader = false,
}: CatalogSectionsProps) {
  const categoryLimit = showAllCategories ? Infinity : compact ? 6 : 9;

  return (
    <div className={compact ? "space-y-14" : "space-y-16"}>
      {sections.map((section, si) => {
        const visibleCategories = section.categories.slice(0, categoryLimit);
        const hiddenCount = section.categories.length - visibleCategories.length;

        return (
          <ScrollReveal key={section.slug} delay={si * 0.05}>
            <section aria-labelledby={`section-${section.slug}`}>
              {hideSectionHeader ? (
                <SectionBanner section={section} compact hideTitle />
              ) : (
                <SectionBanner section={section} />
              )}

              <div
                id={`section-${section.slug}`}
                className={`grid gap-3 lg:gap-4 ${
                  compact
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4"
                }`}
              >
                {visibleCategories.map((cat, i) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    sectionSlug={section.slug}
                    sectionImg={section.img}
                    index={i}
                  />
                ))}
              </div>

              {!showAllCategories && hiddenCount > 0 && (
                <Link
                  to={`/tienda?seccion=${section.slug}`}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm text-primary hover:underline font-medium"
                >
                  +{hiddenCount} categorías más
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </section>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
