import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { CatalogSection } from "../../data/sections";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SectionBannerProps {
  section: CatalogSection;
  compact?: boolean;
  hideTitle?: boolean;
}

export function SectionBanner({ section, compact = false, hideTitle = false }: SectionBannerProps) {
  if (compact) {
    return (
      <div className="relative overflow-hidden rounded-sm border border-border mb-6 h-32 sm:h-40">
        <ImageWithFallback
          src={section.img}
          alt={section.full}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="relative h-full flex flex-col justify-end p-5 sm:p-6">
          <p className="text-[10px] text-primary font-mono tracking-widest uppercase mb-1">
            {section.categories.length} categorías · {section.productCount} productos
          </p>
          {!hideTitle && (
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{section.full}</h2>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-sm border border-border mb-8 group">
      <div className="grid lg:grid-cols-[1.1fr_1fr] min-h-[200px] lg:min-h-[240px]">
        <div className="relative h-44 lg:h-auto overflow-hidden">
          <ImageWithFallback
            src={section.img}
            alt={section.full}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-background/20 via-transparent to-transparent" />
        </div>

        <div className="relative flex flex-col justify-center p-6 lg:p-8 bg-card/95 border-t lg:border-t-0 lg:border-l border-border">
          <p className="text-[10px] text-primary font-mono tracking-widest uppercase mb-2">
            {section.productCount} productos · {section.categories.length} categorías
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-3">
            {section.full}
          </h2>
          <Link
            to={`/tienda?seccion=${section.slug}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            Explorar sección
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
