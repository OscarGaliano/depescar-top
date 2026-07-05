import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Truck, Shield, Award, Package, ArrowRight, Instagram, Zap,
  Play, BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { IMG } from "../data/images";
import { PRODUCTS, BRANDS } from "../data/products";
import { CATALOG_SECTIONS } from "../data/sections";
import { REVIEWS } from "../data/navigation";
import { ProductCard } from "../components/shop/ProductCard";
import { Countdown } from "../components/shop/Countdown";
import { Stars } from "../components/shop/Stars";
import { ScrollReveal } from "../components/effects/ScrollReveal";

const TRUST_ICONS = { Truck, Shield, Award, Package };
const TRUST = [
  { icon: "Truck" as const, title: "Envío desde 2€", desc: "A toda España · 24-48h" },
  { icon: "Shield" as const, title: "Pago 100% Seguro", desc: "Cifrado SSL · Bizum · PayPal" },
  { icon: "Award" as const, title: "Distribuidores Oficiales", desc: "Garantía de marca incluida" },
  { icon: "Package" as const, title: "Devolución 30 días", desc: "Sin preguntas ni complicaciones" },
];

export function HomePage() {
  const [activeReview, setActiveReview] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [heroParallax, setHeroParallax] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (heroRef.current) setHeroParallax(window.scrollY * 0.4);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveReview(r => (r + 1) % REVIEWS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen min-h-[640px] flex items-center overflow-hidden -mt-16 lg:-mt-20 pt-16 lg:pt-20" aria-label="Portada principal">
        <div className="absolute inset-0 bg-background">
          <img
            src={IMG.hero}
            alt="Pescador en el mar mediterráneo al atardecer"
            className="hero-img w-full h-full object-cover object-center opacity-60"
            style={{ transform: `translateY(${heroParallax}px)` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(0,200,215,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,215,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 w-full pt-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 text-primary text-[10px] font-mono tracking-[0.2em] uppercase mb-6 border border-primary/30 bg-primary/10 px-3 py-2 rounded-sm">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              Tienda Oficial Pescasub · Málaga, España · Desde 2018
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6 text-foreground">
              DOMINA<br />
              <span className="text-primary" style={{ textShadow: "0 0 40px rgba(0,200,215,0.4)" }}>EL FONDO</span><br />
              DEL MAR
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg font-light">
              Equipamiento premium de pesca submarina para la pesca deportiva en el Mediterráneo. Fusiles, trajes, máscaras y todo lo que necesitas bajo el agua.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/tienda" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 group">
                Ver Catálogo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#ofertas" className="inline-flex items-center gap-2 border border-foreground/20 text-foreground font-semibold px-8 py-4 rounded-sm hover:bg-white/8 hover:border-primary/40 transition-all duration-200 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-accent" />
                Ofertas Flash
              </a>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              {[["1400+", "Productos"], ["14+", "Marcas Top"], ["4.9★", "Valoración"], ["24h", "Envío"]].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="text-2xl font-bold text-foreground font-mono">{v}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-muted-foreground text-[10px] tracking-[0.3em] uppercase">Explorar</span>
          <motion.div
            animate={{ height: [0, 40, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-px bg-gradient-to-b from-primary to-transparent"
          />
        </div>
      </section>

      {/* Trust */}
      <section className="bg-card border-y border-border" aria-label="Garantías de compra">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
            {TRUST.map(({ icon, title, desc }) => {
              const Icon = TRUST_ICONS[icon];
              return (
                <div key={title} className="flex items-center gap-3 p-5 lg:p-6 group hover:bg-primary/5 transition-colors duration-200">
                  <div className="w-10 h-10 border border-primary/30 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0 group-hover:border-primary/60 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{title}</div>
                    <div className="text-xs text-muted-foreground">{desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="tienda" className="py-20 px-4 lg:px-8" aria-labelledby="cats-heading">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <header className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary text-[10px] font-mono tracking-[0.25em] uppercase mb-2">Catálogo Completo</p>
                <h2 id="cats-heading" className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                  Todo para la<br />Pesca Submarina
                </h2>
              </div>
              <Link to="/tienda" className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group">
                Ver todo el catálogo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </header>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
            {CATALOG_SECTIONS.filter((s) => !["entrega-inmediata", "outlet", "otros"].includes(s.slug)).slice(0, 8).map((section, i) => (
              <ScrollReveal key={section.slug} delay={i * 0.08}>
                <Link
                  to={`/tienda?seccion=${section.slug}`}
                  className="group relative overflow-hidden rounded-sm cursor-pointer block"
                  style={{ aspectRatio: i < 2 ? "2/3" : "3/4" }}
                  aria-label={`Sección ${section.full}`}
                >
                  <div className="w-full h-full bg-muted">
                    <img src={section.img} alt={section.full} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/40 transition-all duration-400 rounded-sm" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-[9px] text-primary font-mono tracking-widest uppercase mb-0.5">{section.productCount} productos</div>
                    <div className="text-base font-bold text-foreground leading-tight">{section.name}</div>
                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[11px] text-primary font-medium">Ver sección</span>
                      <ArrowRight className="w-3 h-3 text-primary" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      <section id="ofertas" className="py-20 px-4 lg:px-8 bg-card border-y border-border" aria-labelledby="deals-heading">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-accent text-[10px] font-mono tracking-[0.25em] uppercase font-semibold">Ofertas Flash · Últimas Unidades</span>
                </div>
                <h2 id="deals-heading" className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">Pescasub Outlet</h2>
                <p className="text-muted-foreground text-sm mt-1">Hasta agotar stock · No te quedes sin ellas</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">Oferta expira en</span>
                <Countdown secs={21600} />
              </div>
            </div>
          </ScrollReveal>

          <div className="product-grid">
            {PRODUCTS.slice(0, 6).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link to="/tienda" className="inline-flex items-center gap-2 border border-border text-foreground font-medium px-8 py-3.5 rounded-sm hover:border-primary hover:text-primary transition-all duration-200 group text-sm">
              Ver todas las ofertas
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Marquee */}
      <section className="py-12 border-b border-border overflow-hidden" aria-label="Marcas oficiales">
        <div className="text-center mb-8">
          <span className="text-muted-foreground text-[10px] font-mono tracking-[0.3em] uppercase">Distribuidores Oficiales</span>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-16 marquee whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <Link key={i} to="/tienda" className="text-muted-foreground/50 hover:text-primary transition-colors duration-200 font-bold text-lg tracking-[0.1em] flex-shrink-0 uppercase">
                {brand}
              </Link>
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Academy */}
      <section className="py-20 px-4 lg:px-8 bg-card border-y border-border" aria-labelledby="academy-heading">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-muted">
              <img src={IMG.diver2} alt="Academia de pesca submarina en Málaga" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button aria-label="Ver vídeo de la academia" className="w-16 h-16 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-300 shadow-2xl shadow-primary/40">
                  <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 bg-background border border-border p-4 rounded-sm shadow-xl">
              <div className="text-3xl font-bold text-foreground font-mono">+200</div>
              <div className="text-xs text-muted-foreground">Alumnos formados</div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="order-1 lg:order-2">
            <p className="text-primary text-[10px] font-mono tracking-[0.25em] uppercase mb-3">Academia Depescar.top</p>
            <h2 id="academy-heading" className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
              Aprende con los<br />Mejores del Mar
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-base">
              Nuestra academia online y presencial en Málaga te enseña técnica de apnea, selección de equipo, zonas de pesca del Mediterráneo y protocolos de seguridad.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-sm hover:bg-primary/90 transition-colors hover:shadow-lg hover:shadow-primary/20">
                <BookOpen className="w-4 h-4" />
                Ver Cursos
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 px-4 lg:px-8" aria-labelledby="reviews-heading">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-12">
            <p className="text-primary text-[10px] font-mono tracking-[0.25em] uppercase mb-3">Opiniones Verificadas</p>
            <h2 id="reviews-heading" className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Lo que dicen nuestros clientes</h2>
            <div className="flex items-center justify-center gap-2">
              <Stars rating={5} size="md" />
              <span className="text-foreground font-bold font-mono ml-1">4.9</span>
              <span className="text-muted-foreground text-sm">· +500 reseñas verificadas</span>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r, i) => (
              <article
                key={r.id}
                className={`bg-card border rounded-sm p-5 transition-all duration-500 cursor-pointer ${
                  i === activeReview ? "border-primary/40 shadow-xl shadow-primary/10 scale-[1.02]" : "border-border hover:border-primary/20"
                }`}
                onClick={() => setActiveReview(i)}
              >
                <Stars rating={r.rating} />
                <p className="text-sm text-muted-foreground leading-relaxed my-3 italic">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-border">
                  <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-xs font-bold font-mono">{r.avatar}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{r.name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono">{r.product}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-16 px-4 lg:px-8 bg-card border-y border-border" aria-label="Síguenos en Instagram">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary text-[10px] font-mono tracking-[0.25em] uppercase mb-1">Comunidad</p>
              <h2 className="text-2xl font-bold text-foreground">@depescar.top en Instagram</h2>
            </div>
            <a href="#" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-medium group">
              <Instagram className="w-4 h-4" />
              Seguir
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[IMG.diver1, IMG.diver2, IMG.mask, IMG.ocean1, IMG.diver1, IMG.ocean2].map((img, i) => (
              <a key={i} href="#" className="group relative aspect-square rounded-sm overflow-hidden bg-muted">
                <img src={img} alt={`Contenido Instagram ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 lg:px-8 relative overflow-hidden" aria-labelledby="newsletter-heading">
        <div className="absolute inset-0">
          <img src={IMG.sunset} alt="" aria-hidden="true" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background" />
        </div>
        <ScrollReveal className="relative max-w-xl mx-auto text-center">
          <p className="text-primary text-[10px] font-mono tracking-[0.25em] uppercase mb-3">Newsletter</p>
          <h2 id="newsletter-heading" className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
            Ofertas Exclusivas para Suscriptores
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sé el primero en conocer las mejores ofertas, guías de pesca submarina y novedades de equipamiento.
          </p>
          {subscribed ? (
            <div className="bg-primary/10 border border-primary/30 rounded-sm px-6 py-4 text-primary font-semibold">
              ¡Bienvenido a la comunidad DePescar! Revisa tu email.
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 bg-card border border-border text-foreground placeholder:text-muted-foreground px-4 py-3.5 rounded-sm focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <button type="submit" className="bg-primary text-primary-foreground font-semibold px-6 py-3.5 rounded-sm hover:bg-primary/90 transition-colors whitespace-nowrap hover:shadow-lg hover:shadow-primary/20">
                Suscribirme
              </button>
            </form>
          )}
        </ScrollReveal>
      </section>
    </>
  );
}
