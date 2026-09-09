import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { getCartRecommendations } from '../utils/recommendations';
import { trackViewCart, trackBeginCheckout } from '../utils/analytics';
import { ProductCard } from '../components/ProductCard';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    cartDiscount,
    shippingCost,
    taxCost,
    cartTotal,
    formatPrice,
    navigateTo,
    appliedPromo,
    applyPromo,
    removePromo,
    shippingMethod,
    setShippingMethod,
  } = useShop();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // GA4 view_cart tracking
  useEffect(() => {
    trackViewCart(
      cart.map(item => ({
        item_id: item.productId,
        item_name: item.product.name,
        item_category: item.product.category,
        item_brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
      })),
      cartTotal
    );
  }, [cart, cartTotal]);

  const cartProductIds = cart.map(item => item.productId);
  const cartRecommendations = getCartRecommendations(cartProductIds, 4);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    if (!res.success) {
      setPromoError(res.message);
    } else {
      setPromoInput('');
    }
  };

  const handleProceedToCheckout = () => {
    // GA4 begin_checkout tracking
    trackBeginCheckout(
      cart.map(item => ({
        item_id: item.productId,
        item_name: item.product.name,
        item_category: item.product.category,
        item_brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
      })),
      cartTotal
    );
    navigateTo('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-200 p-10 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#1A73E8] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 font-sans">
            Your shopping bag is empty
          </h2>
          <p className="text-sm text-gray-500">
            Looks like you haven&apos;t added any Google merchandise yet. Discover fresh arrivals or explore campus gear!
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('home')}
              className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-[#1A73E8] text-white text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        </div>

        {/* Popular recommendations even when empty */}
        <div className="mt-16 text-left">
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans">
            You might be interested in these
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {cartRecommendations.map(p => (
              <ProductCard key={p.id} product={p} listName="Empty Cart Recommendations" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 font-sans">
            Shopping Bag ({cartCount})
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review your selected gear before proceeding to secure checkout.
          </p>
        </div>
        <button
          onClick={() => navigateTo('home')}
          className="text-xs font-semibold text-[#1A73E8] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
            {cart.map(item => (
              <div key={item.id} className="p-4 sm:p-6 flex items-start sm:items-center gap-4">
                {/* Thumbnail */}
                <div
                  onClick={() => navigateTo('product', { productId: item.productId })}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 cursor-pointer"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#1A73E8] uppercase tracking-wider">
                        {item.product.brand}
                      </span>
                      <h3
                        onClick={() => navigateTo('product', { productId: item.productId })}
                        className="font-bold text-gray-900 text-sm sm:text-base truncate hover:text-[#1A73E8] cursor-pointer transition-colors"
                      >
                        {item.product.name}
                      </h3>
                    </div>
                    {/* Line Subtotal */}
                    <div className="text-right font-extrabold text-gray-900 text-base">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>

                  {/* Selected Variants */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    {item.selectedSize && (
                      <span>
                        Size: <strong className="text-gray-700">{item.selectedSize}</strong>
                      </span>
                    )}
                    {item.selectedColor && (
                      <span>
                        Color: <strong className="text-gray-700">{item.selectedColor}</strong>
                      </span>
                    )}
                    <span>
                      Unit: {formatPrice(item.product.price)}
                    </span>
                  </div>

                  {/* Quantity Stepper & Remove Button */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold hover:bg-white rounded cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold hover:bg-white rounded cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery perk info */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {cartSubtotal >= 50
                ? '🎉 Congratulations! You have unlocked FREE Standard Shipping ($50+).'
                : `Add ${formatPrice(50 - cartSubtotal)} more merchandise to qualify for FREE Standard Delivery.`}
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-gray-900 font-sans border-b border-gray-100 pb-3">
              Order Summary
            </h2>

            {/* Price lines */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-gray-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-emerald-600 font-medium">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Promo ({appliedPromo.code} -{appliedPromo.discountPercent}%)</span>
                  </div>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              {/* Shipping Method Selector */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-gray-700 mb-1.5">Shipping Method:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-2 rounded-xl border text-left cursor-pointer ${
                      shippingMethod === 'standard'
                        ? 'border-[#1A73E8] bg-blue-50/60 font-bold text-[#1A73E8]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs font-bold">Standard</div>
                    <div className="text-[11px] text-gray-500">
                      {cartSubtotal >= 50 ? 'FREE' : formatPrice(5)}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod('express')}
                    className={`p-2 rounded-xl border text-left cursor-pointer ${
                      shippingMethod === 'express'
                        ? 'border-[#1A73E8] bg-blue-50/60 font-bold text-[#1A73E8]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs font-bold">Express Air</div>
                    <div className="text-[11px] text-gray-500">{formatPrice(15)} (1-2 days)</div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-600 pt-1">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-gray-900">{formatPrice(taxCost)}</span>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-baseline justify-between text-base">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-gray-900 font-sans">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-gray-100">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-xs">
                  <span>Coupon {appliedPromo.code} applied!</span>
                  <button
                    onClick={removePromo}
                    className="font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. GOOGLE10)"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[11px] text-red-600">{promoError}</p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    College Viva codes: <strong>GOOGLE10</strong> (10% off) or <strong>KESSC20</strong> (20% off).
                  </p>
                </form>
              )}
            </div>

            {/* CTA Proceed to Checkout */}
            <button
              id="proceed-to-checkout-btn"
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-4 rounded-xl bg-[#1A73E8] hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free returns within 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations below cart: Frequently Bought Together */}
      <div className="mt-16 pt-12 border-t border-gray-200">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Smart Recommendations
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900 font-sans mt-0.5">
            Frequently Bought Together
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Shoppers who picked these items also added the following merchandise to their bag.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {cartRecommendations.map(p => (
            <ProductCard key={p.id} product={p} listName="Cart Cross-sell" />
          ))}
        </div>
      </div>
    </div>
  );
};
