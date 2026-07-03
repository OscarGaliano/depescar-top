export interface Product {
  id: number;
  slug: string;
  name: string;
  cat: string;
  catSlug: string;
  orig: number;
  sale: number;
  disc: number;
  brand: string;
  img: string;
  images: string[];
  rating: number;
  rev: number;
  badge: string | null;
  description: string;
  features: string[];
  sizes?: string[];
  stock: number;
  sku: string;
  permalink?: string;
  inStock?: boolean;
  type?: string;
}

export interface Category {
  id: number;
  name: string;
  full: string;
  slug: string;
  count: number;
  img: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  paymentMethod: "card" | "paypal" | "bizum";
}
