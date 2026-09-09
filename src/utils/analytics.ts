/**
 * Google Analytics 4 (GA4) Analytics Utility Module
 * 
 * Project: Google Merchandise Store 2.0 (KES Shroff College)
 * 
 * Instructions for production setup:
 * 1. Define VITE_GA_MEASUREMENT_ID in your .env or hosting environment variables (e.g. "G-XXXXXXXXXX").
 * 2. If configured, the gtag script will be initialized automatically in the document head.
 * 3. If VITE_GA_MEASUREMENT_ID is blank, the module safely falls back to standard console logging 
 *    and internal event broadcasting for live UI presentation/viva inspection.
 */

import { GAItem, GAEventLog } from '../types';

// Read configuration variable from environment (defaults to provided Google tag ID)
export const GA_MEASUREMENT_ID: string = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-09962BMX8X';

// Internal event listeners for live viva/debugger UI
type EventListener = (event: GAEventLog) => void;
const listeners: Set<EventListener> = new Set();
const eventHistory: GAEventLog[] = [];

export function subscribeToGAEvents(listener: EventListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getGAEventHistory(): GAEventLog[] {
  return [...eventHistory];
}

export function clearGAEventHistory(): void {
  eventHistory.length = 0;
}

// Global window declaration for gtag
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Initialize gtag once if valid measurement ID exists
let isInitialized = false;
export function initGA4(): void {
  if (isInitialized) return;

  if (typeof window !== 'undefined') {
    // If tag is already mounted in document head, connect seamlessly without duplicate tags
    if (typeof window.gtag === 'function') {
      isInitialized = true;
      console.info(`[GA4] Connected to active Google tag (gtag.js) for ${GA_MEASUREMENT_ID}`);
      return;
    }

    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.startsWith('G-')) {
      const existingScript = document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`);
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);
      }

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // Managed manually per route
      });

      console.info(`[GA4] Initialized with measurement ID: ${GA_MEASUREMENT_ID}`);
    } else {
      // Safe mock fallback for student development and preview environments
      console.info('[GA4] Running in simulated telemetry mode.');
    }
  }

  isInitialized = true;
}

// Core dispatcher helper
function trackEvent(eventName: string, params: Record<string, unknown>): void {
  // Push to local inspector for demonstration and college viva evaluation
  const logEntry: GAEventLog = {
    id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    eventName,
    params,
  };

  eventHistory.unshift(logEntry);
  if (eventHistory.length > 50) eventHistory.pop();
  listeners.forEach(fn => fn(logEntry));

  // Forward to real gtag if available
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
    } catch (err) {
      console.warn('[GA4] Error dispatching event:', err);
    }
  }

  // Debug log in developer console
  if (import.meta.env.DEV) {
    console.debug(`%c[GA4 Event] ${eventName}`, 'color: #4285F4; font-weight: bold;', params);
  }
}

// -------------------------------------------------------------
// REQUIRED GA4 E-COMMERCE EVENT FUNCTIONS
// -------------------------------------------------------------

/**
 * 1. page_view
 * Tracks navigation across the virtual storefront.
 */
export function trackPageView(page_path: string, page_title: string): void {
  trackEvent('page_view', {
    page_path,
    page_title,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
  });
}

/**
 * 2. view_item_list
 * Triggered when a collection or catalog of products is rendered to the user.
 */
export function trackViewItemList(items: GAItem[], item_list_name: string): void {
  trackEvent('view_item_list', {
    item_list_name,
    items: items.map((item, index) => ({
      ...item,
      index: index + 1,
    })),
  });
}

/**
 * 3. select_item
 * Triggered when a shopper clicks on a specific product card from a list.
 */
export function trackSelectItem(item: GAItem, item_list_name?: string): void {
  trackEvent('select_item', {
    item_list_name: item_list_name || 'Product Grid',
    items: [item],
  });
}

/**
 * 4. view_item
 * Triggered when a shopper views a full Product Detail Page.
 */
export function trackViewItem(item: GAItem): void {
  trackEvent('view_item', {
    currency: 'USD',
    value: item.price,
    items: [item],
  });
}

/**
 * 5. search
 * Triggered when a shopper queries the store search engine.
 */
export function trackSearch(search_term: string): void {
  trackEvent('search', {
    search_term,
  });
}

/**
 * 6. add_to_cart
 * Triggered when an item is added to the shopping bag.
 */
export function trackAddToCart(item: GAItem, quantity: number = 1): void {
  trackEvent('add_to_cart', {
    currency: 'USD',
    value: (item.price || 0) * quantity,
    items: [{
      ...item,
      quantity,
    }],
  });
}

/**
 * 7. remove_from_cart
 * Triggered when an item is discarded or quantity reduced to zero.
 */
export function trackRemoveFromCart(item: GAItem, quantity: number = 1): void {
  trackEvent('remove_from_cart', {
    currency: 'USD',
    value: (item.price || 0) * quantity,
    items: [{
      ...item,
      quantity,
    }],
  });
}

/**
 * 8. view_cart
 * Triggered when the user inspects their shopping cart page.
 */
export function trackViewCart(items: GAItem[], value: number): void {
  trackEvent('view_cart', {
    currency: 'USD',
    value,
    items,
  });
}

/**
 * 9. begin_checkout
 * Triggered when the user advances to the checkout flow.
 */
export function trackBeginCheckout(items: GAItem[], value: number): void {
  trackEvent('begin_checkout', {
    currency: 'USD',
    value,
    items,
  });
}

/**
 * 10. purchase
 * Triggered upon successful order placement.
 */
export function trackPurchase(
  transaction_id: string,
  value: number,
  currency: string = 'USD',
  items: GAItem[],
  tax?: number,
  shipping?: number
): void {
  trackEvent('purchase', {
    transaction_id,
    value,
    currency,
    tax: tax || 0,
    shipping: shipping || 0,
    items,
  });
}

/**
 * 11. add_to_wishlist
 * Triggered when an item is saved for later.
 */
export function trackAddToWishlist(item: GAItem): void {
  trackEvent('add_to_wishlist', {
    currency: 'USD',
    value: item.price,
    items: [item],
  });
}
