import React from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    toggleWishlist,
    clearWishlist,
    addToCart,
    formatPrice,
    navigateTo,
    showToast,
  } = useShop();

  const savedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    savedProducts.forEach(p => addToCart(p, 1));
    showToast(`Added all ${savedProducts.length} items to bag!`, 'success');
  };

  if (savedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-200 p-10 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 font-sans">
            Your Wishlist is Empty
          </h2>
          <p className="text-sm text-gray-500">
            Save your favorite hoodies, tumblers, and accessories by clicking the heart icon on any product card.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-[#1A73E8] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Discover Merchandise
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-sans">
            Saved Wishlist ({savedProducts.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Items saved to this browser session. Move them to your shopping bag anytime.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddAllToCart}
            className="px-4 py-2 bg-[#1A73E8] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add All to Bag</span>
          </button>

          <button
            type="button"
            onClick={clearWishlist}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {savedProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
          >
            <div>
              {/* Image */}
              <div
                onClick={() => navigateTo('product', { productId: product.id })}
                className="relative aspect-square rounded-xl bg-gray-50 overflow-hidden mb-3 cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-wider">
                {product.brand}
              </span>
              <h3
                onClick={() => navigateTo('product', { productId: product.id })}
                className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-[#1A73E8] cursor-pointer transition-colors mt-0.5"
              >
                {product.name}
              </h3>
              <div className="text-base font-extrabold text-gray-900 mt-2">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Actions: Add to Bag & Remove */}
            <div className="pt-4 mt-3 border-t border-gray-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="flex-1 py-2.5 px-3 bg-gray-900 hover:bg-[#1A73E8] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Remove item"
                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
