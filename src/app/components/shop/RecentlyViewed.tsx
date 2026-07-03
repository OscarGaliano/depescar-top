import { useShop } from "../../context/ShopContext";
import { ProductCard } from "./ProductCard";
import { ScrollReveal } from "../effects/ScrollReveal";

export function RecentlyViewed() {
  const { recentlyViewed } = useShop();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 px-4 lg:px-8 border-t border-border" aria-label="Vistos recientemente">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h2 className="text-xl font-bold text-foreground mb-6">Vistos recientemente</h2>
        </ScrollReveal>
        <div className="product-grid">
          {recentlyViewed.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
