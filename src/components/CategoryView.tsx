import React, { useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { DRAWER_CATEGORIES } from '../data/marketplaceData';
import { Filter, ArrowUpDown } from 'lucide-react';

interface CategoryViewProps {
  products: Product[];
  initialCategory?: string;
  onOrderNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  products,
  initialCategory = 'All',
  onOrderNow,
  onQuickView,
}) => {
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  const categories = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home Living', 'Shoes & Bags', 'Watches', 'Groceries'];

  const filtered = products.filter((p) => {
    if (selectedCat === 'All') return true;
    return p.category.toLowerCase().includes(selectedCat.toLowerCase()) ||
      (selectedCat === 'Flash Deals' && p.isFlashDeal);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return b.rating - a.rating;
  });

  return (
    <div className="pb-20 bg-stone-50 min-h-screen">
      {/* Category header */}
      <div className="bg-white p-4 border-b border-stone-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">All Categories</h2>
            <p className="text-xs text-stone-500">Explore authentic products across departments</p>
          </div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
            {sorted.length} items
          </span>
        </div>

        {/* Horizontal scroll category badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sort options bar */}
      <div className="px-4 py-2 bg-white/70 border-b border-stone-200 flex items-center justify-between text-xs">
        <span className="text-stone-500 flex items-center gap-1 font-medium">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span>Showing {selectedCat}</span>
        </span>

        <div className="flex items-center gap-1 text-stone-700">
          <ArrowUpDown className="w-3.5 h-3.5 text-orange-600" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent font-semibold text-stone-800 text-xs focus:outline-none cursor-pointer"
          >
            <option value="popular">Top Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-3">
        {sorted.length === 0 ? (
          <div className="py-16 text-center text-stone-400 bg-white rounded-xl border border-stone-200 my-4">
            <p className="text-sm font-semibold text-stone-600">No items found in this category</p>
            <button
              onClick={() => setSelectedCat('All')}
              className="mt-3 px-4 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-bold"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sorted.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onOrderNow={onOrderNow}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
