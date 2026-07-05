import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { CatalogSection } from "../../data/sections";
import { CATALOG_SECTIONS } from "../../data/sections";
import { ScrollReveal } from "../effects/ScrollReveal";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SectionGridProps {
  sections?: CatalogSection[];
}

export function SectionGrid({ sections = CATALOG_SECTIONS }: SectionGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
      {sections.map((section, i) => (
        <ScrollReveal key={section.slug} delay={i * 0.05}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <Link
              to={`/tienda?seccion=${section.slug}`}
              className="group relative overflow-hidden rounded-sm cursor-pointer block border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              style={{ aspectRatio: i % 3 === 0 ? "2/3" : "3/4" }}
              aria-label={`Sección ${section.full}`}
            >
              <div className="absolute inset-0 bg-muted">
                <ImageWithFallback
                  src={section.img}
                  alt={section.full}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 rounded-sm pointer-events-none" />

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="text-[9px] text-primary font-mono tracking-widest uppercase mb-0.5">
                  {section.productCount} productos · {section.categories.length} categorías
                </div>
                <div className="text-base font-bold text-foreground leading-tight">{section.name}</div>
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[11px] text-primary font-medium">Ver categorías</span>
                  <ArrowRight className="w-3 h-3 text-primary" />
                </div>
              </div>
            </Link>
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  );
}
