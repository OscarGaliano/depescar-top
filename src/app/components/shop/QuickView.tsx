import { useState } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, Minus, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useShop } from "../../context/ShopContext";
import { Stars } from "./Stars";

export function QuickView() {
  const { quickViewProduct, setQuickViewProduct, addToCart, toggleWishlist, isWished } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();

  if (!quickViewProduct) return null;
  const p = quickViewProduct;
  const wished = isWished(p.id);

  const handleClose = () => {
    setQuickViewProduct(null);
    setQuantity(1);
    setSelectedSize(undefined);
  };

  const handleAdd = () => {
    if (p.sizes && !selectedSize) return;
    addToCart(p, quantity, selectedSize);
    handleClose();
  };

  return (
    <Dialog open={!!quickViewProduct} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0 bg-card border-border overflow-hidden">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid md:grid-cols-2"
          >
            <div className="relative aspect-square md:aspect-auto bg-muted">
              <img src={p.img} alt={p.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              {p.badge && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-sm font-mono uppercase">
                  {p.badge}
                </span>
              )}
              <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-sm font-mono">
                -{p.disc}%
              </span>
            </div>

            <div className="p-6 flex flex-col">
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-1">
                {p.brand} · {p.cat}
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">{p.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <Stars rating={p.rating} size="md" />
                <span className="text-sm text-muted-foreground">({p.rev} reseñas)</span>
              </div>

              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold font-mono text-foreground">€{p.sale}</span>
                <span className="text-lg text-muted-foreground line-through font-mono">€{p.orig}</span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{p.description}</p>

              {p.sizes && (
                <div className="mb-4">
                  <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2 block">
                    Talla {selectedSize ? `· ${selectedSize}` : ""}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-sm border rounded-sm transition-all ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary font-semibold"
                            : "border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center border border-border rounded-sm">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-muted">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-mono">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(p.stock, q + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-muted">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-muted-foreground">{p.stock} en stock</span>
              </div>

              <div className="flex gap-2 mt-auto">
                <button
                  onClick={handleAdd}
                  disabled={!!p.sizes && !selectedSize}
                  className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Añadir al Carrito
                </button>
                <button
                  onClick={() => toggleWishlist(p.id)}
                  className="w-12 h-12 border border-border rounded-sm flex items-center justify-center hover:border-primary/40 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
                </button>
              </div>

              <Link
                to={`/producto/${p.slug}`}
                onClick={handleClose}
                className="mt-3 text-sm text-primary hover:underline flex items-center gap-1 justify-center"
              >
                Ver detalles completos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
