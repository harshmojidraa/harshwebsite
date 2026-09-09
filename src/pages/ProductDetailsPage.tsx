import React, { useState, useEffect } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  RefreshCw,
  Truck,
  ArrowLeft,
  ChevronRight,
  Share2,
  Lock,
  Package
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { getRelatedProducts } from '../utils/recommendations';
import { trackViewItem } from '../utils/analytics';
import { RecommendationSection } from '../components/RecommendationSection';

export const ProductDetailsPage: React.FC = () => {
  const {
    navigation,
    navigateTo,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    recordProductView,
    showToast,
  } = useShop();

  // Find product by id
  const product = PRODUCTS.find(p => p.id === navigation.productId) || PRODUCTS[0];

  // Selected state
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors ? product.colors[0].name : ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    setSelectedImage(product.image);
    setSelectedColor(product.colors ? product.colors[0].name : '');
    setSelectedSize(product.sizes ? product.sizes[0] : '');
    setQuantity(1);

    // Record viewed for personalized recommendations
    recordProductView(product.id);

    // Fire GA4 view_item event
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      item_brand: product.brand,
      price: product.price,
    });
  }, [product, recordProductView]);

  const allImages = [product.image, ...(product.additionalImages || [])];
  const isLiked = isInWishlist(product.id);

  // Complete the Look (3 related products)
  const completeTheLook = getRelatedProducts(product, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
        <button
          onClick={() => navigateTo('home')}
          className="hover:text-gray-900 transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <button
          onClick={() => navigateTo(product.category.toLowerCase() as any)}
          className="hover:text-gray-900 transition-colors cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-[#F8F9FA] border border-gray-200/90 flex items-center justify-center p-4">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
              {product.isSale && (
                <span className="bg-[#EA4335] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  SAVE {discountPercent}%
                </span>
              )}
              {product.isTrending && (
                <span className="bg-[#FBBC05] text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                  TRENDING
                </span>
              )}
            </div>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center rounded-2xl transition-all duration-300"
            />
          </div>

          {/* Thumbnails Gallery */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-[#F8F9FA] shrink-0 cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#1A73E8] shadow-xs'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info & Actions (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
          <div>
            {/* Brand and Subcategory */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-bold text-[#1A73E8] uppercase tracking-wider">
                {product.brand} Official Merch
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-900 cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
              {product.name}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">{product.rating.toFixed(1)}</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">{product.reviews} verified buyer reviews</span>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-gray-100">
              <span className="text-3xl font-extrabold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    You save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>{product.description}</p>
            {product.details && product.details.length > 0 && (
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 pt-1">
                {product.details.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">
                  Colour: <span className="text-gray-500 font-normal">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map(col => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                      selectedColor === col.name
                        ? 'border-[#1A73E8] ring-2 ring-offset-2 ring-blue-400'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: col.hex }}
                    title={col.name}
                  >
                    {selectedColor === col.name && (
                      <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-800">
                  Size: <span className="text-[#1A73E8] font-bold">{selectedSize}</span>
                </span>
                <span className="text-gray-400 text-[11px]">Unisex Regular Fit</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-gray-900 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                id="pdp-add-to-cart-btn"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1A73E8] hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                  </>
                )}
              </button>

              {/* Wishlist Icon Button */}
              <button
                type="button"
                id="pdp-wishlist-toggle-btn"
                onClick={() => toggleWishlist(product)}
                aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Official merchandise</strong> • Guaranteed licensed Google authentic quality
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <Lock className="w-4 h-4 text-[#1A73E8] shrink-0" />
              <span>
                <strong>Secure checkout</strong> • 256-bit encrypted simulated Google Pay
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-600">
              <RefreshCw className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Easy returns</strong> • 30-day hassle-free exchange policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Below product: "Complete the Look" (3 related products) */}
      <div className="mt-16 pt-12 border-t border-gray-200">
        <RecommendationSection
          title="Complete the Look"
          subtitle="Pair with these complementary items for the full setup."
          badge="Coordinated Styling"
          products={completeTheLook}
          listName="Complete the Look - PDP"
        />
      </div>
    </div>
  );
};
