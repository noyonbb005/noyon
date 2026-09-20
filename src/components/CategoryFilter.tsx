import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Category, SortOption } from '../types';
import { CATEGORIES } from '../data/products';

interface CategoryFilterProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
  categoryCounts: Record<Category, number>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFilteredCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  sortBy,
  onSortChange,
  totalFilteredCount,
}) => {
  return (
    <div className="py-6 border-b border-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills (horizontal scroll on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            const count = categoryCounts[category] || 0;

            return (
              <button
                key={category}
                id={`category-btn-${category.toLowerCase()}`}
                onClick={() => onSelectCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-stone-800 text-stone-300'
                      : 'bg-stone-200/80 text-stone-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort and Count */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <span className="text-xs text-stone-500 font-medium">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'product' : 'products'}
          </span>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-3 pointer-events-none" />
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="pl-8 pr-8 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400 cursor-pointer appearance-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
