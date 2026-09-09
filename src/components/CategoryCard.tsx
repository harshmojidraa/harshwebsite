import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory, PageId } from '../types';

interface CategoryCardProps {
  name: ProductCategory | 'Collections';
  count: number;
  image: string;
  description: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  count,
  image,
  description,
}) => {
  const { navigateTo } = useShop();

  const handleClick = () => {
    if (name === 'Collections') {
      navigateTo('collections');
    } else {
      const page = name.toLowerCase() as PageId;
      navigateTo(page);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] sm:aspect-square"
    >
      {/* Background image */}
      <img
        src={image}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
      />

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity group-hover:opacity-90" />

      {/* Content */}
      <div className="relative z-10 p-5 text-white flex flex-col justify-end h-full">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
            {count} Items
          </span>
          <span className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center group-hover:bg-white group-hover:text-gray-900 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
        <h3 className="text-xl font-bold font-sans tracking-tight">{name}</h3>
        <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">{description}</p>
      </div>
    </div>
  );
};
