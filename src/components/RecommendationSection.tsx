import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

interface RecommendationSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  listName?: string;
  viewAllAction?: () => void;
  viewAllLabel?: string;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  subtitle,
  badge,
  products,
  listName = 'Recommendations',
  viewAllAction,
  viewAllLabel = 'View all',
}) => {
  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#1A73E8] text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-sans">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm sm:text-base text-gray-500 mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllAction && (
            <button
              onClick={viewAllAction}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A73E8] hover:text-blue-700 transition-colors group cursor-pointer"
            >
              <span>{viewAllLabel}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} listName={listName} />
          ))}
        </div>
      </div>
    </section>
  );
};
