import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, COLLECTIONS, BRANDS } from '../data/products';
import { Product, FilterState, PageId, ProductCategory, ProductBrand } from '../types';
import { FilterBar } from '../components/FilterBar';
import { ProductGrid } from '../components/ProductGrid';
import { ChevronRight, Sparkles, Tag, Layers } from 'lucide-react';

interface CategoryPageProps {
  pageType: 'new' | 'apparel' | 'lifestyle' | 'stationery' | 'collections' | 'brand' | 'sale';
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ pageType }) => {
  const { navigation, navigateTo } = useShop();

  // Selected brand or collection from navigation
  const currentBrand = navigation.brand;
  const currentCollectionId = navigation.collectionId;

  // Metadata per pageType
  const pageMeta: Record<string, { title: string; subtitle: string; categoryFilter?: ProductCategory }> = {
    new: {
      title: 'New Arrivals',
      subtitle: 'The latest drop of Google apparel, deskware, and everyday tech accessories.',
    },
    apparel: {
      title: 'Apparel & Wearables',
      subtitle: 'Premium cotton hoodies, graphic tees, jackets, and socks engineered for campus and code.',
      categoryFilter: 'Apparel',
    },
    lifestyle: {
      title: 'Lifestyle & Tech Accessories',
      subtitle: 'Wireless chargers, Dino plush companions, stormproof umbrellas, and home living.',
      categoryFilter: 'Lifestyle',
    },
    stationery: {
      title: 'Stationery & Workspace',
      subtitle: 'Dot-grid journals, precision anodized pens, dual-texture desk mats, and developer stickers.',
      categoryFilter: 'Stationery',
    },
    collections: {
      title: 'Curated Collections',
      subtitle: 'Special capsules inspired by iconic Google eras, developer workflows, and sustainability.',
    },
    brand: {
      title: currentBrand ? `${currentBrand} Merchandise` : 'Shop by Brand',
      subtitle: currentBrand
        ? `Official ${currentBrand} gear and collectible merchandise.`
        : 'Explore official gear across Google, Android, YouTube, Chrome, Google Cloud, and DeepMind.',
    },
    sale: {
      title: 'Good Gear. Better Prices.',
      subtitle: 'Special promotional offers, seasonal discounts, and limited-stock clearance favorites.',
    },
  };

  const meta = pageMeta[pageType] || {
    title: 'Merchandise Catalog',
    subtitle: 'Browse official Google merchandise.',
  };

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: meta.categoryFilter || (navigation.category ? navigation.category : 'All'),
    brand: currentBrand || 'All',
    priceRange: [0, 500],
    size: 'All',
    color: 'All',
    inStockOnly: false,
    sortBy: pageType === 'new' ? 'newest' : pageType === 'sale' ? 'price-asc' : 'featured',
  });

  // Base products for this pageType
  const baseProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (pageType === 'new') {
      list = list.filter(p => p.isNew || p.isTrending);
    } else if (pageType === 'sale') {
      list = list.filter(p => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    } else if (pageType === 'collections') {
      if (currentCollectionId) {
        const col = COLLECTIONS.find(c => c.id === currentCollectionId);
        if (col) {
          list = list.filter(p => p.tags.includes(col.filterTag) || p.category === 'Accessories');
        }
      }
    } else if (pageType === 'brand') {
      if (currentBrand) {
        list = list.filter(p => p.brand.toLowerCase() === currentBrand.toLowerCase());
      }
    } else if (meta.categoryFilter) {
      list = list.filter(p => p.category === meta.categoryFilter);
    }

    return list;
  }, [pageType, currentBrand, currentCollectionId, meta.categoryFilter]);

  // Apply user interactive filters
  const filteredProducts = useMemo(() => {
    let result = [...baseProducts];

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    // Brand filter
    if (filters.brand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
    }

    // Price range
    result = result.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Size filter
    if (filters.size !== 'All') {
      result = result.filter(p => p.sizes && p.sizes.includes(filters.size));
    }

    // Color filter
    if (filters.color !== 'All') {
      result = result.filter(p =>
        p.colors && p.colors.some(c => c.name.toLowerCase().includes(filters.color.toLowerCase()))
      );
    }

    // In stock only
    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [baseProducts, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <button
          onClick={() => navigateTo('home')}
          className="hover:text-gray-900 transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        {pageType === 'brand' && currentBrand ? (
          <>
            <button
              onClick={() => navigateTo('brand')}
              className="hover:text-gray-900 transition-colors cursor-pointer"
            >
              Shop by Brand
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-semibold text-gray-900">{currentBrand}</span>
          </>
        ) : (
          <span className="font-semibold text-gray-900 capitalize">{meta.title}</span>
        )}
      </nav>

      {/* Hero Header for this Category */}
      <div className="mb-8">
        {pageType === 'sale' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-3">
            <Tag className="w-3.5 h-3.5" />
            <span>Limited Time Offers & Clearance</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
          {meta.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl leading-relaxed">
          {meta.subtitle}
        </p>

        {/* Collections Capsule Selector (if Collections page) */}
        {pageType === 'collections' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {COLLECTIONS.map(col => {
              const isSelected = currentCollectionId === col.id;
              return (
                <div
                  key={col.id}
                  onClick={() =>
                    navigateTo('collections', {
                      collectionId: isSelected ? undefined : col.id,
                    })
                  }
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1A73E8] bg-blue-50/60 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1A73E8]">Capsule</span>
                    {isSelected && (
                      <span className="text-[10px] bg-[#1A73E8] text-white px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{col.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{col.subtitle}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Brand Selector chips (if Brand page) */}
        {pageType === 'brand' && (
          <div className="flex items-center gap-2 flex-wrap mt-6">
            <button
              onClick={() => navigateTo('brand')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                !currentBrand
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              All Brands
            </button>
            {BRANDS.map(b => (
              <button
                key={b.name}
                onClick={() => navigateTo('brand', { brand: b.name })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentBrand === b.name
                    ? 'bg-[#1A73E8] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter and Sorting Controls */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        showCategoryFilter={!meta.categoryFilter}
        totalProductsCount={filteredProducts.length}
      />

      {/* Product Grid */}
      <ProductGrid
        products={filteredProducts}
        listName={`${meta.title} Listing`}
        emptyTitle="No merchandise matches your filter selection"
        emptySubtitle="Try selecting different filter options or clear filters to view all products."
      />
    </div>
  );
};
