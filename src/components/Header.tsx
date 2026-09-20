import React from 'react';
import { Menu, ShoppingBag, Search, X, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenCart,
  cartCount,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenAdmin,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-orange-100/80 shadow-xs">
      {/* Top row: Menu, Logo, Cart */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Side Menu Hamburger */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={onOpenMenu}
          className="p-2 -ml-1 text-stone-700 hover:text-orange-600 hover:bg-orange-50 active:scale-95 rounded-lg transition-colors"
          aria-label="Open menu drawer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center: Marketplace Logo */}
        <div className="flex items-center gap-1.5 select-none cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30 font-black text-base">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center">
              <span className="font-extrabold text-lg tracking-tight text-stone-900">
                Orange<span className="text-orange-600">Shop</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Cart Icon with Badge & Admin quick toggle */}
        <div className="flex items-center gap-1">
          {onOpenAdmin && (
            <button
              id="header-admin-btn"
              onClick={onOpenAdmin}
              className="p-2 text-stone-600 hover:text-orange-600 hover:bg-orange-50 active:scale-95 rounded-lg transition-colors flex items-center gap-1"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5 text-stone-700 hover:text-orange-600" />
            </button>
          )}

          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative p-2 text-stone-700 hover:text-orange-600 hover:bg-orange-50 active:scale-95 rounded-lg transition-colors"
            aria-label={`Shopping cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-6 h-6 text-stone-800" />
            {cartCount > 0 && (
              <span
                id="header-cart-badge"
                className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-white"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Second row: Search Bar */}
      <div className="px-4 pb-3">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-stone-400 pointer-events-none">
            <Search className="w-4 h-4 text-orange-500" />
          </div>
          <input
            id="marketplace-search-input"
            type="text"
            placeholder="Search deals, products, brands..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-9 pr-24 py-2 bg-stone-100 hover:bg-stone-150/70 focus:bg-white border border-transparent focus:border-orange-500 rounded-full text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
          />

          {searchQuery && (
            <button
              id="clear-search-query-btn"
              onClick={() => onSearchChange('')}
              className="absolute right-16 p-1 text-stone-400 hover:text-stone-600"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            id="search-action-btn"
            onClick={onSearchSubmit}
            className="absolute right-1 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white text-xs font-semibold rounded-full transition-colors flex items-center gap-1 shadow-xs"
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
};
