import React from 'react';
import {
  X,
  User,
  Zap,
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  ShoppingBag,
  Activity,
  Watch,
  Utensils,
  HelpCircle,
  Package,
  Heart,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { DRAWER_CATEGORIES } from '../data/marketplaceData';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
  onOpenLogin: () => void;
  onOpenAdmin?: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenLogin,
  onOpenAdmin,
}) => {
  if (!isOpen) return null;

  const getDrawerIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-4 h-4 text-orange-600" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-orange-600" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4 text-orange-600" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-orange-600" />;
      case 'Home':
        return <Home className="w-4 h-4 text-orange-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-orange-600" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-orange-600" />;
      case 'Watch':
        return <Watch className="w-4 h-4 text-orange-600" />;
      case 'Utensils':
        return <Utensils className="w-4 h-4 text-orange-600" />;
      default:
        return <Zap className="w-4 h-4 text-orange-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
        {/* User profile banner header */}
        <div className="bg-gradient-to-br from-orange-600 to-amber-500 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-orange-100 font-medium">Welcome to OrangeShop</p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="font-bold text-sm text-white hover:underline flex items-center gap-1"
                >
                  <span>Sign In / Register</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              id="close-side-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick status bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/20 text-center text-[11px]">
            <div className="cursor-pointer hover:opacity-90">
              <p className="font-extrabold text-white">12</p>
              <p className="text-orange-100 text-[10px]">Coupons</p>
            </div>
            <div className="cursor-pointer hover:opacity-90">
              <p className="font-extrabold text-white">250</p>
              <p className="text-orange-100 text-[10px]">Points</p>
            </div>
            <div className="cursor-pointer hover:opacity-90">
              <p className="font-extrabold text-white">VIP</p>
              <p className="text-orange-100 text-[10px]">Club</p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex-1 overflow-y-auto px-4 py-4 divide-y divide-stone-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
              All Categories
            </h3>
            <div className="space-y-1">
              {DRAWER_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  id={`drawer-category-${category.id}`}
                  onClick={() => {
                    onSelectCategory(category.name);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 active:bg-orange-100/70 text-stone-700 hover:text-orange-600 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-orange-100/80 flex items-center justify-center transition-colors">
                      {getDrawerIcon(category.icon)}
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-stone-800 group-hover:text-orange-600 block">
                        {category.name}
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        {category.count}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {category.hot && (
                      <span className="px-1.5 py-0.5 bg-orange-600 text-white text-[9px] font-bold rounded-full">
                        HOT
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-orange-600" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick shortcuts */}
          <div className="pt-4 mt-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 px-2">
              My Services
            </h3>
            <div className="space-y-1 text-xs">
              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <Package className="w-4 h-4 text-stone-500" />
                <span>Track My Orders</span>
              </button>
              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <Heart className="w-4 h-4 text-stone-500" />
                <span>My Wishlist & Followed Stores</span>
              </button>
              <button
                onClick={onClose}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-stone-500" />
                <span>Customer Help Center (24/7)</span>
              </button>

              {onOpenAdmin && (
                <button
                  id="drawer-admin-panel-btn"
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold transition-colors mt-2"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    <span>Admin Panel</span>
                  </div>
                  <span className="text-[10px] bg-orange-600 text-white font-bold px-1.5 py-0.5 rounded">
                    Manage
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-stone-100 bg-stone-50 text-center text-[10px] text-stone-400">
          <p className="font-semibold text-stone-600">OrangeShop Mobile Marketplace</p>
          <p>Version 2.4.0 • 100% Secure Shopping</p>
        </div>
      </div>
    </div>
  );
};
