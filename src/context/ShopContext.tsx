import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Product, CartItem, Order, PageId, NavigationState, CurrencyCode, CurrencyConfig } from '../types';
import { PRODUCTS } from '../data/products';
import {
  initGA4,
  trackPageView,
  trackAddToCart as gaAddToCart,
  trackRemoveFromCart as gaRemoveFromCart,
  trackAddToWishlist as gaAddToWishlist,
  trackPurchase as gaPurchase,
} from '../utils/analytics';

const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0 },
  INR: { code: 'INR', symbol: '₹', rate: 86.5 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79 },
};

interface ShopContextType {
  // Navigation
  navigation: NavigationState;
  navigateTo: (page: PageId, params?: Partial<NavigationState>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, deltaOrQuantity: number, isAbsolute?: boolean) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  shippingCost: number;
  taxCost: number;
  cartTotal: number;
  shippingMethod: 'standard' | 'express';
  setShippingMethod: (method: 'standard' | 'express') => void;
  appliedPromo: { code: string; discountPercent: number } | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Orders
  orders: Order[];
  createOrder: (details: {
    address: Order['shippingAddress'];
    paymentMethod: 'google_pay' | 'card';
  }) => Order;
  getOrderById: (orderId: string) => Order | undefined;

  // Recently Viewed
  recentlyViewed: string[];
  recordProductView: (productId: string) => void;

  // Currency & Localization
  currency: CurrencyConfig;
  setCurrencyCode: (code: CurrencyCode) => void;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number) => string;

  // Feedback Toast
  toast: { message: string; type?: 'info' | 'success' | 'error' } | null;
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;

  // GA Inspector Modal Toggle
  isGaInspectorOpen: boolean;
  setIsGaInspectorOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'gms2_cart_v1';
const WISHLIST_STORAGE_KEY = 'gms2_wishlist_v1';
const ORDERS_STORAGE_KEY = 'gms2_orders_v1';
const RECENT_STORAGE_KEY = 'gms2_recent_v1';
const CURRENCY_STORAGE_KEY = 'gms2_currency_v1';

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [navigation, setNavigation] = useState<NavigationState>({ page: 'home' });

  // Currency
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && saved in CURRENCIES) return saved as CurrencyCode;
    } catch {
      // ignore
    }
    return 'USD';
  });

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Shipping & Promo
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountPercent: number } | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

  // GA Inspector
  const [isGaInspectorOpen, setIsGaInspectorOpen] = useState(false);

  // Initialize GA4 once
  useEffect(() => {
    initGA4();
  }, []);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  // Save orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Save recently viewed to local storage
  useEffect(() => {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(recentlyViewed));
    } catch {
      // ignore
    }
  }, [recentlyViewed]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'success') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Navigation dispatcher
  const navigateTo = useCallback((page: PageId, params: Partial<NavigationState> = {}) => {
    setNavigation({
      page,
      ...params,
    });

    // Window scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // GA4 Page View tracking
    const pageTitles: Record<PageId, string> = {
      home: 'Google Merchandise Store 2.0 | Home',
      new: 'New Arrivals | Google Merchandise Store',
      apparel: 'Apparel & Wearables | Google Merchandise Store',
      lifestyle: 'Lifestyle & Tech Gear | Google Merchandise Store',
      stationery: 'Stationery & Workspace | Google Merchandise Store',
      collections: 'Curated Collections | Google Merchandise Store',
      brand: `${params.brand || 'Shop by Brand'} | Google Merchandise Store`,
      sale: 'Special Offers & Sale | Google Merchandise Store',
      search: `Search Results "${params.searchQuery || ''}" | Google Merchandise Store`,
      product: 'Product Details | Google Merchandise Store',
      wishlist: 'My Wishlist | Google Merchandise Store',
      cart: 'Shopping Bag | Google Merchandise Store',
      checkout: 'Secure Checkout | Google Merchandise Store',
      'order-success': 'Order Confirmed | Google Merchandise Store',
      account: 'My Account & Order History | Google Merchandise Store',
    };

    trackPageView(`/${page}`, pageTitles[page] || 'Google Merchandise Store');
  }, []);

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
    setCart(prev => {
      const itemKey = `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`;
      const existingIndex = prev.findIndex(item => item.id === itemKey);

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: itemKey,
        productId: product.id,
        product,
        quantity,
        selectedSize: selectedSize || (product.sizes ? product.sizes[0] : undefined),
        selectedColor: selectedColor || (product.colors ? product.colors[0].name : undefined),
        addedAt: Date.now(),
      };
      return [...prev, newItem];
    });

    // GA4 Add to cart tracking
    gaAddToCart({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      item_brand: product.brand,
      item_variant: selectedColor || selectedSize,
      price: product.price,
    }, quantity);

    showToast(`Added "${product.name}" to bag!`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart(prev => {
      const target = prev.find(i => i.id === cartItemId);
      if (target) {
        gaRemoveFromCart({
          item_id: target.product.id,
          item_name: target.product.name,
          item_category: target.product.category,
          price: target.product.price,
        }, target.quantity);
      }
      return prev.filter(i => i.id !== cartItemId);
    });
    showToast('Item removed from your bag.', 'info');
  }, [showToast]);

  const updateQuantity = useCallback((cartItemId: string, deltaOrQuantity: number, isAbsolute = false) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.id === cartItemId) {
            const nextQty = isAbsolute ? deltaOrQuantity : item.quantity + deltaOrQuantity;
            return {
              ...item,
              quantity: Math.max(0, nextQty),
            };
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Price & summary calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartSubtotal = cart.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const cartDiscount = appliedPromo ? (cartSubtotal * appliedPromo.discountPercent) / 100 : 0;

  // Shipping: free standard if subtotal >= 50, else 5. Express is 15.
  const shippingCost = cartCount === 0 
    ? 0 
    : shippingMethod === 'express'
      ? 15.0
      : (cartSubtotal >= 50 ? 0 : 5.0);

  // Tax: flat estimated 8%
  const taxCost = cartCount === 0 ? 0 : Number(((cartSubtotal - cartDiscount) * 0.08).toFixed(2));

  const cartTotal = Math.max(0, Number((cartSubtotal - cartDiscount + shippingCost + taxCost).toFixed(2)));

  const applyPromo = useCallback((code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GOOGLE10' || clean === 'GMS10') {
      setAppliedPromo({ code: clean, discountPercent: 10 });
      showToast('Promo code GOOGLE10 applied (10% OFF)!', 'success');
      return { success: true, message: '10% discount applied.' };
    }
    if (clean === 'KESSC20' || clean === 'KES20') {
      setAppliedPromo({ code: clean, discountPercent: 20 });
      showToast('KES Shroff College Promo applied (20% OFF)!', 'success');
      return { success: true, message: '20% college project discount applied.' };
    }
    return { success: false, message: 'Invalid promo code. Try GOOGLE10 or KESSC20' };
  }, [showToast]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    showToast('Promo code removed.', 'info');
  }, [showToast]);

  // Wishlist operations
  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist.`, 'info');
        return prev.filter(id => id !== product.id);
      } else {
        // Track GA4 wishlist event
        gaAddToWishlist({
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand,
          price: product.price,
        });
        showToast(`Saved "${product.name}" to wishlist!`, 'success');
        return [...prev, product.id];
      }
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // Order Placement
  const createOrder = useCallback((details: {
    address: Order['shippingAddress'];
    paymentMethod: 'google_pay' | 'card';
  }): Order => {
    const orderNumber = `GMS-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      createdAt: new Date().toISOString(),
      items: cart.map(item => ({
        productId: item.productId,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.product.image,
      })),
      subtotal: cartSubtotal,
      shipping: shippingCost,
      tax: taxCost,
      discount: cartDiscount,
      total: cartTotal,
      shippingMethod,
      shippingAddress: details.address,
      paymentMethod: details.paymentMethod,
      status: 'Confirmed',
    };

    // Save to order history
    setOrders(prev => [newOrder, ...prev]);

    // Dispatch GA4 purchase event
    gaPurchase(
      newOrder.orderNumber,
      newOrder.total,
      'USD',
      cart.map(item => ({
        item_id: item.productId,
        item_name: item.product.name,
        item_category: item.product.category,
        item_brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
      })),
      newOrder.tax,
      newOrder.shipping
    );

    // Empty the cart
    setCart([]);
    setAppliedPromo(null);

    return newOrder;
  }, [cart, cartSubtotal, cartDiscount, shippingCost, taxCost, cartTotal, shippingMethod]);

  const getOrderById = useCallback((orderId: string) => {
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  }, [orders]);

  // Recently Viewed
  const recordProductView = useCallback((productId: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  }, []);

  // Format price helper
  const formatPrice = useCallback((amountInUSD: number) => {
    const converted = amountInUSD * currency.rate;
    if (currency.code === 'INR') {
      return `${currency.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }
    return `${currency.symbol}${converted.toFixed(2)}`;
  }, [currency]);

  return (
    <ShopContext.Provider
      value={{
        navigation,
        navigateTo,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        shippingCost,
        taxCost,
        cartTotal,
        shippingMethod,
        setShippingMethod,
        appliedPromo,
        applyPromo,
        removePromo,
        wishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        orders,
        createOrder,
        getOrderById,
        recentlyViewed,
        recordProductView,
        currency,
        setCurrencyCode,
        setCurrency: setCurrencyCode,
        formatPrice,
        toast,
        showToast,
        isGaInspectorOpen,
        setIsGaInspectorOpen,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export function useShop(): ShopContextType {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
