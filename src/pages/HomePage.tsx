import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryCard } from '../components/CategoryCard';
import { RecommendationSection } from '../components/RecommendationSection';
import { CATEGORIES } from '../data/products';
import { getTrendingProducts, getBestSellers, getUserPersonalizedRecommendations } from '../utils/recommendations';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, RefreshCw, Lock, Sparkles, ArrowRight, Award, Compass, HeartHandshake } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, recentlyViewed, wishlist } = useShop();

  const trendingProducts = getTrendingProducts(6);
  const bestSellers = getBestSellers(8);
  const personalized = getUserPersonalizedRecommendations([...recentlyViewed, ...wishlist], 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Section: Shop by Category */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Explore Departments
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-sans mt-0.5">
                Shop by Category
              </h2>
            </div>
            <button
              onClick={() => navigateTo('collections')}
              className="text-sm font-semibold text-[#1A73E8] hover:text-blue-700 inline-flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
            >
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.name}
                name={cat.name}
                count={cat.count}
                image={cat.image}
                description={cat.description}
              />
            ))}
            <CategoryCard
              name="Collections"
              count={3}
              image="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&q=80"
              description="Curated capsules, vintage 1998, and developer drops."
            />
          </div>
        </div>
      </section>

      {/* 3. Section: Trending Now (Data-Driven UX) */}
      <RecommendationSection
        title="Trending Now"
        subtitle="What shoppers are checking out right now."
        badge="Live Demand Analytics"
        products={trendingProducts}
        listName="Trending Now - Home"
        viewAllAction={() => navigateTo('new')}
        viewAllLabel="See all trending"
      />

      {/* 4. Section: Campaign Banner "GOOGLE IT. WEAR IT." */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 text-white p-8 sm:p-14 lg:p-16 shadow-xl">
          {/* Subtle Google accent colors ambient background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Signature 2026 Capsule Collection</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans leading-tight">
              GOOGLE IT. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-rose-400 to-amber-300">
                WEAR IT.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
              Your favourite Google moments, made for everyday life. From campus hoodies engineered with organic combed cotton to vacuum-sealed commuter tumblers and collector pins.
            </p>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => navigateTo('collections')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-semibold text-sm transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 cursor-pointer group"
              >
                <span>Shop the collection</span>
                <ArrowRight className="w-4 h-4 text-gray-950 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section: Best Sellers */}
      <RecommendationSection
        title="Best Sellers"
        subtitle="The merchandise people keep coming back for."
        badge="Community Favorites"
        products={bestSellers}
        listName="Best Sellers - Home"
        viewAllAction={() => navigateTo('apparel')}
        viewAllLabel="Explore all gear"
      />

      {/* 6. Section: You Might Like These */}
      <RecommendationSection
        title="You Might Like These"
        subtitle="Based on what you're browsing."
        badge="Tailored For You"
        products={personalized}
        listName="Personalized Recommendations - Home"
      />

      {/* 7. Section: Trust Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-white rounded-2xl border border-gray-200/90 p-8 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Official Merchandise</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Authentic designs crafted with premium sustainable materials and licensed Google branding.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Easy Shopping</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Fast filtering, real-time localized currency, and streamlined 1-click bag checkout.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Secure Checkout</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Distraction-free end-to-end purchasing prototype with test Google Pay verification.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#DC2626] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Made for Everyday</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Engineered for comfort during long coding marathons, campus life, and office summits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
