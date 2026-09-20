import React from 'react';
import {
  Grid,
  MessageSquare,
  Home,
  ShoppingBag,
  User,
} from 'lucide-react';
import { BottomNavTab } from '../types';

interface BottomNavigationProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavTab) => void;
  cartCount: number;
  unreadMessageCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  cartCount,
  unreadMessageCount = 2,
}) => {
  return (
    <nav
      id="mobile-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200/80 shadow-lg px-2 py-1 max-w-md mx-auto"
    >
      <div className="grid grid-cols-5 items-center">
        {/* 1. Category */}
        <button
          id="nav-tab-category"
          onClick={() => onTabChange('category')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            activeTab === 'category'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Grid className={`w-5 h-5 ${activeTab === 'category' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Category</span>
        </button>

        {/* 2. Message */}
        <button
          id="nav-tab-message"
          onClick={() => onTabChange('message')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            activeTab === 'message'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${activeTab === 'message' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {unreadMessageCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 bg-orange-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-1 ring-white">
                {unreadMessageCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Message</span>
        </button>

        {/* 3. Home (Center Highlight) */}
        <button
          id="nav-tab-home"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors ${
            activeTab === 'home'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeTab === 'home' ? 'bg-orange-50' : ''}`}>
            <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 4. Cart */}
        <button
          id="nav-tab-cart"
          onClick={() => onTabChange('cart')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            activeTab === 'cart'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'cart' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {cartCount > 0 && (
              <span
                id="bottom-nav-cart-badge"
                className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 bg-orange-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-1 ring-white"
              >
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* 5. Login / Account */}
        <button
          id="nav-tab-login"
          onClick={() => onTabChange('login')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
            activeTab === 'login'
              ? 'text-orange-600 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'login' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Login</span>
        </button>
      </div>
    </nav>
  );
};
