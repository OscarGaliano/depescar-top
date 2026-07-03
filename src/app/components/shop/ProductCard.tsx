import { useState } from "react";
import { Link } from "react-router";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import type { Product } from "../../types/shop";
import { useShop } from "../../context/ShopContext";
import { getProductAlt } from "../../data/products";
import { Stars } from "./Stars";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product: p, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { addToCart, toggleWishlist, isWished, setQuickViewProduct } = useShop();
  const wished = isWished(p.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-card border border-border hover:border-primary/30 transition-all duration-300 rounded-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-primary/5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <Link to={`/producto/${p.slug}`}>
          <img
            src={p.img}
            alt={getProductAlt(p.slug)}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? "scale-110" : "scale-100"}`}
          />
        </Link>
        <div className={`absolute inset-0 bg-gradient-to-t from-card/70 to-transparent transition-opacity duration-300 pointer-events-none ${hovered ? "opacity-100" : "opacity-0"}`} />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.disc > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono tracking-wider">
              -{p.disc}%
            </span>
          )}
          {p.badge && (
            <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono tracking-wider">
              {p.badge}
            </span>
          )}
          {p.stock <= 5 && (
            <span className="bg-destructive/90 text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono">
              ¡Solo {p.stock}!
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={() => toggleWishlist(p.id)}
            aria-label={wished ? "Quitar de favoritos" : "Añadir a favoritos"}
            className={`w-8 h-8 bg-background/80 backdrop-blur-sm rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-background ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
          >
            <Heart className={`w-4 h-4 transition-colors ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
          </button>
          <button
            onClick={() => setQuickViewProduct(p)}
            aria-label="Vista rápida"
            className={`w-8 h-8 bg-background/80 backdrop-blur-sm rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-background delay-75 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}`}
          >
            <Eye className="w-4 h-4 text-foreground" />
          </button>
        </div>

        <div className={`absolute inset-x-0 bottom-0 p-3 flex gap-2 transition-all duration-300 ${hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          <button
            onClick={() => addToCart(p)}
            className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Añadir
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">{p.brand} · {p.cat}</div>
        <Link to={`/producto/${p.slug}`}>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-snug">{p.name}</h3>
        </Link>
        <div className="flex items-center gap-2">
          <Stars rating={p.rating} />
          <span className="text-[11px] text-muted-foreground">({p.rev})</span>
        </div>
        <div className="flex items-end gap-2 mt-auto pt-1">
          <span className="text-xl font-bold text-foreground font-mono">€{p.sale}</span>
          {p.disc > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through font-mono">€{p.orig}</span>
              <span className="ml-auto text-[10px] text-primary font-mono border border-primary/30 px-1.5 py-0.5 rounded-sm">
                -€{p.orig - p.sale}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}
