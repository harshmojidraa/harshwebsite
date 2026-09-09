import { Product } from '../types';
import { PRODUCTS } from '../data/products';

/**
 * Data-Driven Merchandising Utility
 * Implements mock recommendation algorithms inspired by ecommerce analytics (GA4 conversion pathways,
 * affinity scoring, and item association rules).
 */

export function getTrendingProducts(limit: number = 6): Product[] {
  return PRODUCTS.filter(p => p.isTrending).slice(0, limit);
}

export function getBestSellers(limit: number = 8): Product[] {
  return PRODUCTS.filter(p => p.isBestSeller).slice(0, limit);
}

export function getNewArrivals(limit: number = 8): Product[] {
  return PRODUCTS.filter(p => p.isNew).slice(0, limit);
}

export function getSaleProducts(): Product[] {
  return PRODUCTS.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
}

/**
 * Recommendation algorithm for "You Might Like These" or "Complete the Look".
 * Computes product affinity based on matching category, complementary subcategories, shared tags, or same brand.
 */
export function getRelatedProducts(currentProduct: Product, limit: number = 3): Product[] {
  const scored = PRODUCTS
    .filter(p => p.id !== currentProduct.id)
    .map(p => {
      let score = 0;
      // High score for same category
      if (p.category === currentProduct.category) score += 3;
      // High score for same brand
      if (p.brand === currentProduct.brand) score += 2;
      // Score for overlapping tags
      const commonTags = p.tags.filter(t => currentProduct.tags.includes(t));
      score += commonTags.length * 2;
      // Popularity boost
      if (p.isBestSeller) score += 1;
      if (p.isTrending) score += 1;
      return { product: p, score };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(item => item.product);
}

/**
 * Cart recommendations ("Frequently Bought Together")
 * Finds products not currently in the cart with high affinity.
 */
export function getCartRecommendations(cartProductIds: string[], limit: number = 4): Product[] {
  return PRODUCTS
    .filter(p => !cartProductIds.includes(p.id))
    .filter(p => p.isBestSeller || p.isTrending)
    .slice(0, limit);
}

/**
 * User-based recommendations for the Account page.
 */
export function getUserPersonalizedRecommendations(viewedOrLikedIds: string[], limit: number = 6): Product[] {
  if (viewedOrLikedIds.length === 0) {
    return getBestSellers(limit);
  }

  // Find categories preferred in viewed/liked
  const preferredCategories = PRODUCTS
    .filter(p => viewedOrLikedIds.includes(p.id))
    .map(p => p.category);

  const scored = PRODUCTS
    .filter(p => !viewedOrLikedIds.includes(p.id))
    .map(p => {
      let score = 0;
      if (preferredCategories.includes(p.category)) score += 4;
      if (p.isTrending) score += 2;
      if (p.rating >= 4.8) score += 1;
      return { product: p, score };
    });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.product);
}
