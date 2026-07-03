import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router";
import {
  Heart, ShoppingCart, Truck, Shield, RotateCcw, Minus, Plus,
  ChevronRight, Check, Star,
} from "lucide-react";
import { motion } from "motion/react";
import { getProductBySlug, getRelatedProducts, getProductAlt, getCategoryBySlug } from "../data/products";
import { getSectionForCategory } from "../data/sections";
import { useShop } from "../context/ShopContext";
import { ProductCard } from "../components/shop/ProductCard";
import { Stars } from "../components/shop/Stars";
import { ScrollReveal } from "../components/effects/ScrollReveal";
import { RecentlyViewed } from "../components/shop/RecentlyViewed";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"desc" | "features" | "reviews">("desc");
  const { addToCart, toggleWishlist, isWished, addRecentlyViewed } = useShop();

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      window.scrollTo(0, 0);
    }
  }, [product, addRecentlyViewed]);

  if (!product) return <Navigate to="/tienda" replace />;

  const related = getRelatedProducts(product);
  const wished = isWished(product.id);
  const category = getCategoryBySlug(product.catSlug);
  const section = getSectionForCategory(product.catSlug);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) return;
    addToCart(product, quantity, selectedSize);
  };

  return (
    <div className="py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-6 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/tienda" className="hover:text-primary transition-colors">Tienda</Link>
          {section && (
            <>
              <ChevronRight className="w-3 h-3" />
              <Link to={`/tienda?seccion=${section.slug}`} className="hover:text-primary transition-colors">{section.name}</Link>
            </>
          )}
          <ChevronRight className="w-3 h-3" />
          <Link to={`/tienda?seccion=${section.slug}&cat=${product.catSlug}`} className="hover:text-primary transition-colors">{category?.name ?? product.cat}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-20">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-square bg-muted rounded-sm overflow-hidden mb-3 group">
              <img
                src={product.images[selectedImage]}
                alt={getProductAlt(product.slug)}
                loading={selectedImage === 0 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-sm font-mono uppercase">
                  {product.badge}
                </span>
              )}
              {product.disc > 0 && (
                <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm font-bold px-2.5 py-1 rounded-sm font-mono">
                  -{product.disc}%
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${selectedImage === i ? "border-primary" : "border-border hover:border-primary/40"}`}
                >
                  <img src={img} alt={`${product.name} — vista ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mb-2">
              {product.brand} · {product.cat} · SKU: {product.sku}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-5">
              <Stars rating={product.rating} size="md" />
              <span className="text-sm text-muted-foreground">{product.rating} · {product.rev} reseñas</span>
            </div>

            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-border">
              <span className="text-4xl font-bold font-mono text-foreground">€{product.sale}</span>
              {product.disc > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through font-mono">€{product.orig}</span>
                  <span className="text-sm text-primary font-mono bg-primary/10 border border-primary/30 px-2 py-1 rounded-sm">
                    Ahorras €{product.orig - product.sale}
                  </span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {product.sizes && (
              <div className="mb-6">
                <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3 block">
                  Selecciona talla
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm border rounded-sm transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary/10 text-primary font-semibold shadow-sm shadow-primary/20"
                          : "border-border text-foreground hover:border-primary/40"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-sm">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-mono text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm">
                {product.stock > 5 ? (
                  <span className="text-primary flex items-center gap-1"><Check className="w-4 h-4" /> En stock</span>
                ) : (
                  <span className="text-accent font-semibold">¡Solo quedan {product.stock}!</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!!product.sizes && !selectedSize}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-4 rounded-sm hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al Carrito — €{(product.sale * quantity).toFixed(2)}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-14 h-14 border border-border rounded-sm flex items-center justify-center hover:border-primary/40 transition-colors"
              >
                <Heart className={`w-6 h-6 ${wished ? "fill-primary text-primary" : "text-foreground"}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: "Envío 24-48h" },
                { icon: Shield, text: "Pago seguro" },
                { icon: RotateCcw, text: "30 días devolución" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 bg-muted/50 rounded-sm text-center">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-[10px] text-muted-foreground font-mono uppercase">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
          <div className="flex gap-0 border-b border-border mb-6">
            {([["desc", "Descripción"], ["features", "Características"], ["reviews", "Reseñas"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "desc" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted-foreground leading-relaxed max-w-3xl">
              {product.description}
            </motion.p>
          )}

          {activeTab === "features" && (
            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid sm:grid-cols-2 gap-3 max-w-2xl">
              {product.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <div className="w-5 h-5 bg-primary/10 border border-primary/30 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {f}
                </li>
              ))}
            </motion.ul>
          )}

          {activeTab === "reviews" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
              <div className="flex items-center gap-4 mb-6 p-4 bg-card border border-border rounded-sm">
                <div className="text-5xl font-bold font-mono text-foreground">{product.rating}</div>
                <div>
                  <Stars rating={product.rating} size="md" />
                  <p className="text-sm text-muted-foreground mt-1">{product.rev} reseñas verificadas</p>
                </div>
              </div>
              {[5, 4, 5].map((rating, i) => (
                <div key={i} className="py-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: rating }).map((_, j) => (
                        <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">Cliente verificado</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"Excelente producto, calidad premium y envío rapidísimo. Totalmente recomendado."</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <RecentlyViewed />

        {/* Related */}
        {related.length > 0 && (
          <ScrollReveal>
            <h2 className="text-2xl font-bold text-foreground mb-6">Productos relacionados</h2>
            <div className="product-grid">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  );
}
