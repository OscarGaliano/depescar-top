import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product, CartItem } from "../types/shop";
import { FREE_SHIPPING_THRESHOLD } from "../data/products";

interface ShopContextValue {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  wishlist: number[];
  recentlyViewed: Product[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: number, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  isWished: (productId: number) => boolean;
  addRecentlyViewed: (product: Product) => void;
  cartCount: number;
  cartTotal: number;
  cartSubtotal: number;
  shippingCost: number;
  freeShippingRemaining: number;
  hasFreeShipping: boolean;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "depescar-cart";
const WISHLIST_KEY = "depescar-wishlist";

function cartItemKey(productId: number, size?: string) {
  return `${productId}-${size ?? "default"}`;
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.sale * item.quantity, 0);
  const hasFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = cart.length === 0 ? 0 : hasFreeShipping ? 0 : 4.95;
  const cartTotal = cartSubtotal + shippingCost;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  const addToCart = useCallback((product: Product, quantity = 1, size?: string) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.size === size
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity, size }];
    });
    toast.success(`${product.name} añadido al carrito`, {
      description: `€${product.sale} · ${size ? `Talla ${size}` : "Unidad"}`,
      action: {
        label: "Ver carrito",
        onClick: () => setCartOpen(true),
      },
    });
  }, []);

  const removeFromCart = useCallback((productId: number, size?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.size === size)));
    toast.info("Producto eliminado del carrito");
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist(prev => {
      const isIn = prev.includes(productId);
      if (isIn) {
        toast.info("Eliminado de favoritos");
        return prev.filter(id => id !== productId);
      }
      toast.success("Añadido a favoritos");
      return [...prev, productId];
    });
  }, []);

  const isWished = useCallback((productId: number) => wishlist.includes(productId), [wishlist]);

  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  }, []);

  return (
    <ShopContext.Provider
      value={{
        cart, cartOpen, setCartOpen, wishlist, recentlyViewed,
        addToCart, removeFromCart, updateQuantity, clearCart,
        toggleWishlist, isWished, addRecentlyViewed,
        cartCount, cartTotal, cartSubtotal, shippingCost,
        freeShippingRemaining, hasFreeShipping,
        quickViewProduct, setQuickViewProduct,
        searchOpen, setSearchOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}

export { cartItemKey };
