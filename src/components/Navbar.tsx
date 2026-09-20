import React from 'react';
import { ShoppingBag, Search, X } from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category;
  onSelectCategory: (cat: Category) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-white font-bold text-lg tracking-tight">
              S
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-lg tracking-tight text-stone-900">
                SimpleStore
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                Essentials
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm bg-stone-100 hover:bg-stone-150 focus:bg-white border border-transparent focus:border-stone-400 rounded-full transition-all outline-none text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cart action */}
          <div className="flex items-center gap-3">
            <button
              id="cart-toggle-btn"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-stone-700 hover:bg-stone-100 active:scale-95 transition-all flex items-center gap-2"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <span className="hidden md:inline text-sm font-medium text-stone-800">
                Cart
              </span>
              {cartCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="min-w-5 h-5 px-1 bg-stone-900 text-white text-xs font-semibold rounded-full flex items-center justify-center animate-in fade-in zoom-in"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
