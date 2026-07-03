import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  ShoppingCart, Search, Menu, X, ChevronDown, Fish, Heart,
} from "lucide-react";
import { NAV_ITEMS } from "../../data/navigation";
import { useShop } from "../../context/ShopContext";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const { cartCount, setCartOpen, setSearchOpen, wishlist } = useShop();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 70);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const headerBg = scrolled || !isHome
    ? "bg-card/95 backdrop-blur-lg border-b border-border shadow-xl shadow-black/30"
    : "bg-transparent";

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center glow-pulse">
              <Fish className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight leading-none">
                de<span className="text-primary">pescar</span><span className="text-muted-foreground text-base">.top</span>
              </div>
              <div className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase font-mono">Málaga · España</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center" role="navigation" aria-label="Menú principal">
            <Link to="/tienda" className="relative nav-underline px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tienda
            </Link>
            {NAV_ITEMS.map(item => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setOpenNav(item.label)}
                onMouseLeave={() => setOpenNav(null)}
              >
                <button className="relative nav-underline flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                  {item.label}
                  <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                {openNav === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-52 bg-card border border-border rounded-sm shadow-2xl shadow-black/40 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.sub.map(s => (
                      <Link key={s.label} to={s.href} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar productos"
              className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-sm hover:bg-white/5 text-sm"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm opacity-60">Buscar...</span>
              <kbd className="text-[10px] border border-border px-1 rounded font-mono opacity-40">⌘K</kbd>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="md:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link to="/tienda" className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-white/5 hidden sm:block">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Carrito con ${cartCount} productos`}
              className="relative p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-white/5"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center font-mono animate-in zoom-in duration-200">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="hidden lg:inline-flex items-center gap-2 ml-1 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-sm hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
              Entrar
            </button>

            <button
              aria-label="Menú móvil"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <Link to="/tienda" className="block py-3 text-sm font-medium text-primary border-b border-border/50">
              Tienda
            </Link>
            {NAV_ITEMS.map(item => (
              <Link key={item.label} to="/tienda" className="block py-3 text-sm font-medium text-muted-foreground hover:text-primary border-b border-border/50 last:border-0 transition-colors">
                {item.label}
              </Link>
            ))}
            <button className="w-full mt-4 bg-primary text-primary-foreground font-semibold py-3 rounded-sm text-sm">
              Entrar / Registro
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
