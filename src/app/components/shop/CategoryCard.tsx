import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Category } from "../../types/shop";
import { getCategoryCardImage } from "../../data/products";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface CategoryCardProps {
  cat: Category;
  sectionSlug: string;
  sectionImg?: string;
  index?: number;
  aspect?: "square" | "portrait";
}

export function CategoryCard({
  cat,
  sectionSlug,
  sectionImg,
  index = 0,
  aspect = "portrait",
}: CategoryCardProps) {
  const img = getCategoryCardImage(cat, sectionImg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
    >
      <Link
        to={`/tienda?seccion=${sectionSlug}&cat=${cat.slug}`}
        className="group relative overflow-hidden rounded-sm cursor-pointer block border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
        style={{ aspectRatio: aspect === "portrait" ? "3/4" : "4/3" }}
        aria-label={`${cat.name} · ${cat.count} productos`}
      >
        <div className="absolute inset-0 bg-muted">
          <ImageWithFallback
            src={img}
            alt={cat.full}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/30 transition-colors duration-300 rounded-sm pointer-events-none" />

        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center justify-center min-w-[2rem] h-7 px-2 bg-background/80 backdrop-blur-sm border border-border/80 text-[10px] font-mono text-foreground rounded-sm">
            {cat.count}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-[9px] text-primary font-mono tracking-widest uppercase mb-1 opacity-90">
            {cat.count} productos
          </p>
          <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {cat.name}
          </h3>
          <div className="flex items-center gap-1 mt-2.5 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="text-[11px] text-primary font-medium">Ver categoría</span>
            <ArrowRight className="w-3 h-3 text-primary" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
