import React from 'react';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Flame } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Hero: React.FC = () => {
  const { navigateTo, formatPrice } = useShop();

  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-6 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#F8F9FA] via-[#F1F3F4] to-[#E8F0FE]/60 rounded-3xl border border-gray-200/90 p-6 sm:p-10 lg:p-14 overflow-hidden shadow-xs">
          
          {/* Subtle background ambient Google color dots */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 shadow-xs text-xs font-semibold text-gray-800">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4285F4] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4285F4]" />
                </span>
                <span>The 2026 Official Merch Redesign</span>
                <span className="text-gray-300">|</span>
                <span className="text-[#1A73E8]">KES Shroff College</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 font-sans leading-[1.1]">
                  Find Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]">
                    Google.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-600 font-normal max-w-lg leading-relaxed">
                  Gear made for work, play and everything in between. Designed with clean aesthetics, durable organic materials, and authentic developer spirit.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  id="hero-bestsellers-btn"
                  onClick={() => navigateTo('collections')}
                  className="px-6 py-3.5 rounded-xl bg-gray-900 hover:bg-[#1A73E8] text-white font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Best Sellers</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  id="hero-collections-btn"
                  onClick={() => navigateTo('collections')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Explore Collections</span>
                </button>
              </div>

              {/* Trust micro metrics */}
              <div className="pt-4 border-t border-gray-200/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-lg font-bold text-gray-900">100%</div>
                  <div className="text-xs text-gray-500">Official merch</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">4.9 ★</div>
                  <div className="text-xs text-gray-500">Shopper rating</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">GA4</div>
                  <div className="text-xs text-gray-500">Data-driven UX</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual (6 cols): Product Composition (Hoodie, Water Bottle, Bag, Cap) */}
            <div className="lg:col-span-6">
              <div className="relative">
                {/* 2x2 grid collage with interactive hotspots */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 p-2 bg-white/70 backdrop-blur-sm rounded-2xl border border-white shadow-lg">
                  {/* Item 1: Google Hoodie */}
                  <div
                    onClick={() => navigateTo('product', { productId: 'prod-hoodie-heritage' })}
                    className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                      alt="Google Heritage Hoodie"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">Apparel</span>
                      <p className="text-xs font-semibold truncate">Heritage Hoodie</p>
                      <p className="text-[11px] font-bold text-white/90">{formatPrice(68)}</p>
                    </div>
                  </div>

                  {/* Item 2: Insulated Flask */}
                  <div
                    onClick={() => navigateTo('product', { productId: 'prod-bottle-insulated-matte' })}
                    className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80"
                      alt="Chroma Insulated Flask"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">Drinkware</span>
                      <p className="text-xs font-semibold truncate">Chroma Flask</p>
                      <p className="text-[11px] font-bold text-white/90">{formatPrice(34)}</p>
                    </div>
                  </div>

                  {/* Item 3: Daypack Tech Backpack */}
                  <div
                    onClick={() => navigateTo('product', { productId: 'prod-bag-commuter-backpack' })}
                    className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
                      alt="Modular Tech Backpack"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">Accessories</span>
                      <p className="text-xs font-semibold truncate">Tech Backpack</p>
                      <p className="text-[11px] font-bold text-white/90">{formatPrice(89)}</p>
                    </div>
                  </div>

                  {/* Item 4: Google Cap */}
                  <div
                    onClick={() => navigateTo('product', { productId: 'prod-cap-dad-hat-google' })}
                    className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80"
                      alt="1998 Twill Cap"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300">Heritage</span>
                      <p className="text-xs font-semibold truncate">1998 Twill Cap</p>
                      <p className="text-[11px] font-bold text-white/90">{formatPrice(24)}</p>
                    </div>
                  </div>
                </div>

                {/* Floating pill badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-md flex items-center gap-2 whitespace-nowrap z-20">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-semibold text-gray-800">
                    Tap any item to inspect details
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
