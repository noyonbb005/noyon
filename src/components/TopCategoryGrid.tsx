import React from 'react';
import {
  Zap,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  ShoppingBag,
  Watch,
  Utensils,
  Grid,
} from 'lucide-react';
import { TopCategory } from '../types';

interface TopCategoryGridProps {
  categories: TopCategory[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onViewAllCategories?: () => void;
}

export const TopCategoryGrid: React.FC<TopCategoryGridProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  onViewAllCategories,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-orange-600 fill-orange-500/20" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-orange-600" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-orange-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-orange-600" />;
      case 'Home':
        return <Home className="w-5 h-5 text-orange-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-orange-600" />;
      case 'Watch':
        return <Watch className="w-5 h-5 text-orange-600" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-orange-600" />;
      default:
        return <Grid className="w-5 h-5 text-orange-600" />;
    }
  };

  return (
    <section className="px-4 py-3 bg-white border-y border-stone-100 my-2">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Top Categories
        </h2>
        {onViewAllCategories && (
          <button
            id="view-all-categories-btn"
            onClick={onViewAllCategories}
            className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            See All &gt;
          </button>
        )}
      </div>

      {/* 4 or 8 grid items in mobile marketplace layout */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
        {categories.map((cat) => {
          const isSelected =
            activeCategory.toLowerCase() === cat.name.toLowerCase() ||
            (cat.name === 'Flash Deals' && activeCategory === 'Flash');

          return (
            <button
              key={cat.id}
              id={`top-category-item-${cat.id}`}
              onClick={() => onSelectCategory(cat.name)}
              className="flex flex-col items-center group active:scale-95 transition-transform"
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/25 ring-2 ring-orange-500/30'
                      : 'bg-orange-50/80 group-hover:bg-orange-100/80 border border-orange-100'
                  }`}
                >
                  {React.cloneElement(getIcon(cat.iconName), {
                    className: `w-5 h-5 ${
                      isSelected ? 'text-white fill-white/20' : 'text-orange-600'
                    }`,
                  })}
                </div>

                {cat.badge && (
                  <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[9px] font-extrabold rounded-full shadow-xs leading-tight">
                    {cat.badge}
                  </span>
                )}
              </div>

              <span
                className={`mt-1.5 text-[11px] font-medium leading-tight text-center line-clamp-1 transition-colors ${
                  isSelected ? 'text-orange-600 font-bold' : 'text-stone-700'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
