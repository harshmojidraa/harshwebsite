import React, { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { FilterState, ProductCategory, ProductBrand } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  availableCategories?: ProductCategory[];
  availableBrands?: ProductBrand[];
  showCategoryFilter?: boolean;
  totalProductsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  availableCategories = ['Apparel', 'Drinkware', 'Accessories', 'Stationery', 'Lifestyle'],
  availableBrands = ['Google', 'Android', 'YouTube', 'Chrome', 'Google Cloud', 'DeepMind'],
  showCategoryFilter = true,
  totalProductsCount,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', '2XL'];
  const colors = [
    { label: 'All', hex: '' },
    { label: 'Black', hex: '#18181B' },
    { label: 'White', hex: '#FFFFFF' },
    { label: 'Blue', hex: '#2563EB' },
    { label: 'Green', hex: '#16A34A' },
    { label: 'Red', hex: '#DC2626' },
    { label: 'Gray', hex: '#4B5563' },
  ];

  const sortOptions: { label: string; value: FilterState['sortBy'] }[] = [
    { label: 'Featured', value: 'featured' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
  ];

  const priceRanges: { label: string; range: [number, number] }[] = [
    { label: 'All Prices', range: [0, 500] },
    { label: 'Under $25', range: [0, 25] },
    { label: '$25 to $50', range: [25, 50] },
    { label: '$50 to $100', range: [50, 100] },
    { label: 'Over $100', range: [100, 500] },
  ];

  const handleReset = () => {
    onFilterChange({
      category: 'All',
      brand: 'All',
      priceRange: [0, 500],
      size: 'All',
      color: 'All',
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  const isFiltered =
    filters.category !== 'All' ||
    filters.brand !== 'All' ||
    filters.size !== 'All' ||
    filters.color !== 'All' ||
    filters.inStockOnly ||
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 500;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 mb-8 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Quick filter chips & count */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {isFiltered && '•'}</span>
          </button>

          {/* Results count */}
          <span className="text-xs font-semibold text-gray-500 py-1 mr-2">
            {totalProductsCount} {totalProductsCount === 1 ? 'item' : 'items'}
          </span>

          {/* Desktop Category Filters */}
          {showCategoryFilter && (
            <div className="hidden md:flex items-center gap-1.5">
              <button
                onClick={() => onFilterChange({ ...filters, category: 'All' })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  filters.category === 'All'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ ...filters, category: cat })}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    filters.category === cat
                      ? 'bg-[#1A73E8] text-white font-semibold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 px-2 py-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          <label htmlFor="sort-dropdown" className="text-xs font-medium text-gray-500 whitespace-nowrap">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-dropdown"
              value={filters.sortBy}
              onChange={e =>
                onFilterChange({
                  ...filters,
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className="appearance-none bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A73E8]/30 cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Desktop secondary filter row */}
      <div className="hidden md:flex items-center flex-wrap gap-4 pt-4 mt-3 border-t border-gray-100 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Brand:</span>
          <select
            value={filters.brand}
            onChange={e => onFilterChange({ ...filters, brand: e.target.value })}
            aria-label="Filter by Brand"
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none"
          >
            <option value="All">All Brands</option>
            {availableBrands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Price:</span>
          <select
            value={`${filters.priceRange[0]}-${filters.priceRange[1]}`}
            onChange={e => {
              const [min, max] = e.target.value.split('-').map(Number);
              onFilterChange({ ...filters, priceRange: [min, max] });
            }}
            aria-label="Filter by Price"
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 font-medium focus:outline-none"
          >
            {priceRanges.map(pr => (
              <option key={pr.label} value={`${pr.range[0]}-${pr.range[1]}`}>
                {pr.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Size:</span>
          <div className="flex items-center gap-1">
            {sizes.map(sz => (
              <button
                key={sz}
                onClick={() => onFilterChange({ ...filters, size: sz })}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  filters.size === sz
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-medium">Color:</span>
          <div className="flex items-center gap-1.5">
            {colors.map(col => (
              <button
                key={col.label}
                title={col.label}
                onClick={() => onFilterChange({ ...filters, color: col.label })}
                className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                  col.label === 'All'
                    ? 'bg-gray-200 text-[9px] font-bold text-gray-700'
                    : ''
                } ${
                  filters.color === col.label
                    ? 'ring-2 ring-offset-1 ring-[#1A73E8]'
                    : 'border-gray-300'
                }`}
                style={col.hex ? { backgroundColor: col.hex } : {}}
              >
                {col.label === 'All' && 'A'}
              </button>
            ))}
          </div>
        </div>

        {/* In Stock toggle */}
        <label className="flex items-center gap-1.5 text-gray-700 cursor-pointer select-none ml-auto">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={e => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
            className="rounded text-[#1A73E8] focus:ring-[#1A73E8]"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Mobile Drawer Filter Accordion */}
      {mobileFilterOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-4 text-xs">
          {showCategoryFilter && (
            <div>
              <div className="font-semibold text-gray-800 mb-2">Category</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => onFilterChange({ ...filters, category: 'All' })}
                  className={`px-3 py-1.5 rounded-lg ${
                    filters.category === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  All
                </button>
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => onFilterChange({ ...filters, category: cat })}
                    className={`px-3 py-1.5 rounded-lg ${
                      filters.category === cat ? 'bg-[#1A73E8] text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="font-semibold text-gray-800 mb-2">Brand</div>
            <select
              value={filters.brand}
              onChange={e => onFilterChange({ ...filters, brand: e.target.value })}
              aria-label="Filter by Brand"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2"
            >
              <option value="All">All Brands</option>
              {availableBrands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <div className="font-semibold text-gray-800 mb-2">Price Range</div>
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map(pr => (
                <button
                  key={pr.label}
                  onClick={() => onFilterChange({ ...filters, priceRange: pr.range })}
                  className={`p-2 rounded-lg text-left border ${
                    filters.priceRange[0] === pr.range[0] && filters.priceRange[1] === pr.range[1]
                      ? 'border-[#1A73E8] bg-blue-50 text-[#1A73E8] font-bold'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={e => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              />
              <span>In Stock Only</span>
            </label>
            <button
              onClick={handleReset}
              className="text-red-600 font-semibold"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
