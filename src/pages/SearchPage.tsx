import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ProductGrid } from '../components/ProductGrid';
import { trackSearch } from '../utils/analytics';
import { useShop } from '../context/ShopContext';

export const SearchPage: React.FC = () => {
  const { navigation, navigateTo } = useShop();

  const [query, setQuery] = useState(navigation.searchQuery || '');

  const suggestedSearches = [
    'Hoodies',
    'Mugs',
    'Best Sellers',
    'Android',
    'Google 1998',
    'Gifts',
  ];

  // Dispatch search analytics when query settles
  useEffect(() => {
    if (query.trim().length >= 2) {
      const timer = setTimeout(() => {
        trackSearch(query.trim());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [query]);

  // Filter products matching query
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter(p => {
      // Special handles
      if (q === 'best sellers' || q === 'bestseller') return p.isBestSeller;
      if (q === 'gifts') return p.price <= 35 || p.category === 'Lifestyle';
      if (q === 'google 1998' || q === '1998') return p.tags.includes('1998') || p.tags.includes('heritage');

      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const handleSuggestedClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Search Header Container */}
      <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
          What are you looking for?
        </h1>

        {/* Big Search Bar Input */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="w-6 h-6 text-gray-400 absolute left-5 pointer-events-none" />
            <input
              id="main-search-input"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search hoodies, mugs, caps..."
              autoFocus
              className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-[#1A73E8] rounded-2xl py-4 sm:py-5 pl-14 pr-12 text-base sm:text-lg text-gray-900 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Suggested Searches chips */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1 mr-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            Suggested:
          </span>
          {suggestedSearches.map(term => (
            <button
              key={term}
              onClick={() => handleSuggestedClick(term)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                query.toLowerCase() === term.toLowerCase()
                  ? 'bg-blue-100 text-[#1A73E8] font-bold border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      {query.trim() ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{results.length}</span> results for &ldquo;
              <span className="font-semibold text-gray-900">{query}</span>&rdquo;
            </div>
          </div>

          <ProductGrid
            products={results}
            listName={`Search: ${query}`}
            emptyTitle={`No results found for "${query}"`}
            emptySubtitle="Check your spelling, try broader search terms, or explore our popular categories below."
          />
        </div>
      ) : (
        /* Empty Query Showcase: Show Best Sellers as fallback */
        <div className="space-y-8 pt-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800">Popular items across the store</h3>
            <p className="text-xs text-gray-500 mt-1">Start typing above or explore popular essentials.</p>
          </div>
          <ProductGrid
            products={PRODUCTS.filter(p => p.isBestSeller).slice(0, 8)}
            listName="Search Page Fallback - Popular"
          />
        </div>
      )}
    </div>
  );
};
