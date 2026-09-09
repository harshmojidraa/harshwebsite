import React, { useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { trackViewItemList } from '../utils/analytics';
import { PackageSearch } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  listName?: string;
  columns?: 2 | 3 | 4;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  listName = 'Product Catalog',
  emptyTitle = 'No products found',
  emptySubtitle = 'Try adjusting your filters or search terms.',
}) => {
  // Fire GA4 view_item_list when rendered
  useEffect(() => {
    if (products.length > 0) {
      trackViewItemList(
        products.slice(0, 12).map(p => ({
          item_id: p.id,
          item_name: p.name,
          item_category: p.category,
          item_brand: p.brand,
          price: p.price,
        })),
        listName
      );
    }
  }, [products, listName]);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-200/80 my-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 text-gray-400 mb-4">
          <PackageSearch className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} listName={listName} />
      ))}
    </div>
  );
};
