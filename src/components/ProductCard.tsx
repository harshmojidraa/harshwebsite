import React from 'react';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { trackSelectItem } from '../utils/analytics';

interface ProductCardProps {
  product: Product;
  listName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, listName = 'Product Grid' }) => {
  const {
    navigateTo,
    formatPrice,
    toggleWishlist,
    isInWishlist,
    addToCart,
    cart,
  } = useShop();

  const isLiked = isInWishlist(product.id);

  // Check if already in cart
  const inCart = cart.some(item => item.productId === product.id);

  const handleClick = () => {
    // GA4 select_item tracking
    trackSelectItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      item_brand: product.brand,
      price: product.price,
    }, listName);

    navigateTo('product', { productId: product.id });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Compute discount percentage if sale
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-square bg-[#F8F9FA] overflow-hidden p-3 flex items-center justify-center">
        {/* Badges container */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.isSale && (
            <span className="bg-[#EA4335] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent > 0 ? `-${discountPercent}%` : 'SALE'}
            </span>
          )}
          {product.isTrending && !product.isSale && (
            <span className="bg-[#FBBC05] text-gray-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              TRENDING
            </span>
          )}
          {product.isBestSeller && !product.isSale && !product.isTrending && (
            <span className="bg-[#4285F4] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              BEST SELLER
            </span>
          )}
          {product.isNew && !product.isSale && !product.isTrending && !product.isBestSeller && (
            <span className="bg-[#34A853] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
            isLiked
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-gray-400 hover:text-gray-900 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-medium text-gray-400 uppercase tracking-wider text-[10px]">
              {product.brand}
            </span>
            <span className="text-[11px] text-gray-400">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 leading-snug group-hover:text-[#1A73E8] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-xs font-semibold text-gray-800">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
        </div>

        {/* Price & Add to Cart action */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to bag`}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              inCart
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-gray-900 text-white hover:bg-[#1A73E8]'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
