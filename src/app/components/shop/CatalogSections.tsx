import { Link } from "react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import type { CatalogSection } from "../../data/sections";
import { CATALOG_SECTIONS } from "../../data/sections";
import { ScrollReveal } from "../effects/ScrollReveal";

interface CatalogSectionsProps {
  sections?: CatalogSection[];
  compact?: boolean;
}

export function CatalogSections({ sections = CATALOG_SECTIONS, compact = false }: CatalogSectionsProps) {
  return (
    <div className="space-y-12">
      {sections.map((section, si) => (
        <ScrollReveal key={section.slug} delay={si * 0.05}>
          <section aria-labelledby={`section-${section.slug}`}>
            <div className="flex items-end justify-between gap-4 mb-5">
              <div className="flex items-center gap-4 min-w-0">
                <Link
                  to={`/tienda?seccion=${section.slug}`}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-sm border border-border group"
                >
                  <img
                    src={section.img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                </Link>
                <div className="min-w-0">
                  <p className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1">
                    {section.productCount} productos
                  </p>
                  <h2 id={`section-${section.slug}`} className="text-xl sm:text-2xl font-bold text-foreground truncate">
                    {section.full}
                  </h2>
                </div>
              </div>
              <Link
                to={`/tienda?seccion=${section.slug}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
              >
                Ver sección
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className={`grid gap-2 ${compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
              {section.categories.slice(0, compact ? 6 : 9).map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    to={`/tienda?seccion=${section.slug}&cat=${cat.slug}`}
                    className="group flex items-center justify-between gap-3 px-4 py-3 bg-card border border-border rounded-sm hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {cat.count} productos
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {section.categories.length > (compact ? 6 : 9) && (
              <Link
                to={`/tienda?seccion=${section.slug}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:underline"
              >
                +{section.categories.length - (compact ? 6 : 9)} categorías más
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </section>
        </ScrollReveal>
      ))}
    </div>
  );
}
