import { Link } from "react-router";
import { Minus, Plus, Trash2, ShoppingBag, Truck, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "../ui/sheet";
import { useShop } from "../../context/ShopContext";
import { FREE_SHIPPING_THRESHOLD } from "../../data/products";

export function CartDrawer() {
  const {
    cart, cartOpen, setCartOpen, removeFromCart, updateQuantity,
    cartSubtotal, shippingCost, cartTotal, cartCount,
    freeShippingRemaining, hasFreeShipping,
  } = useShop();

  const progress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border flex flex-col p-0">
        <SheetHeader className="p-5 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Tu Carrito
            {cartCount > 0 && (
              <span className="text-xs bg-primary/10 text-primary font-mono px-2 py-0.5 rounded-sm">
                {cartCount} {cartCount === 1 ? "artículo" : "artículos"}
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">Carrito de compras</SheetDescription>
        </SheetHeader>

        {cart.length > 0 && (
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Truck className={`w-4 h-4 ${hasFreeShipping ? "text-primary" : "text-muted-foreground"}`} />
              {hasFreeShipping ? (
                <span className="text-xs text-primary font-medium">¡Envío gratis desbloqueado!</span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  Añade <span className="text-primary font-mono font-bold">€{freeShippingRemaining.toFixed(2)}</span> más para envío gratis
                </span>
              )}
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full py-16 text-center"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-semibold mb-1">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground mb-6">Explora nuestro catálogo de pesca submarina</p>
                <Link
                  to="/tienda"
                  onClick={() => setCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors text-sm"
                >
                  Ver Catálogo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              cart.map((item, i) => (
                <motion.div
                  key={`${item.product.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 py-4 border-b border-border last:border-0"
                >
                  <Link to={`/producto/${item.product.slug}`} onClick={() => setCartOpen(false)} className="flex-shrink-0">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-sm bg-muted"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/producto/${item.product.slug}`} onClick={() => setCartOpen(false)}>
                      <h4 className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors">
                        {item.product.name}
                      </h4>
                    </Link>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {item.product.brand}{item.size ? ` · Talla ${item.size}` : ""}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 border border-border rounded-sm">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold font-mono text-foreground">
                        €{(item.product.sale * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    className="text-muted-foreground hover:text-destructive transition-colors self-start p-1"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border p-5 space-y-3 bg-card">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono">€{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Envío</span>
                <span className={`font-mono ${hasFreeShipping ? "text-primary" : ""}`}>
                  {hasFreeShipping ? "Gratis" : `€${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-base pt-1 border-t border-border">
                <span>Total</span>
                <span className="font-mono text-primary">€{cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 text-sm"
            >
              Finalizar Compra
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setCartOpen(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
