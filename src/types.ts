export type ProductCategory = 'Apparel' | 'Drinkware' | 'Accessories' | 'Stationery' | 'Lifestyle';

export type ProductBrand = 'Google' | 'Android' | 'YouTube' | 'Chrome' | 'Google Cloud' | 'DeepMind';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  brand: ProductBrand;
  price: number;
  originalPrice?: number;
  image: string;
  additionalImages?: string[];
  rating: number;
  reviews: number;
  description: string;
  details?: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  tags: string[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  addedAt: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  createdAt?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingMethod: 'standard' | 'express';
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  paymentMethod: 'google_pay' | 'card';
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
}

export type PageId =
  | 'home'
  | 'new'
  | 'apparel'
  | 'lifestyle'
  | 'stationery'
  | 'collections'
  | 'brand'
  | 'sale'
  | 'search'
  | 'product'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account';

export interface NavigationState {
  page: PageId;
  productId?: string;
  category?: ProductCategory;
  brand?: ProductBrand;
  collectionId?: string;
  searchQuery?: string;
  filterTag?: string;
  orderId?: string;
}

export interface FilterState {
  category: string;
  brand: string;
  priceRange: [number, number];
  size: string;
  color: string;
  inStockOnly: boolean;
  sortBy: 'featured' | 'popular' | 'newest' | 'price-asc' | 'price-desc';
}

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP';
export type Currency = CurrencyCode;

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export interface GAItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  item_variant?: string;
}

export interface GAEventLog {
  id: string;
  timestamp: string;
  eventName: string;
  params: Record<string, unknown>;
}
