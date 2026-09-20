import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Plus,
  Store,
  ExternalLink,
  CheckCircle,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { AdminNavPage } from '../../types';

interface AdminHeaderProps {
  currentPage: AdminNavPage;
  onOpenSidebar: () => void;
  onNavigate: (page: AdminNavPage) => void;
  onOpenStorefrontPreview: () => void;
  pendingOrdersCount: number;
}

const PAGE_TITLES: Record<AdminNavPage, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Dashboard Overview',
    subtitle: 'Store performance, live statistics, and recent customer activities',
  },
  products: {
    title: 'Product Management',
    subtitle: 'Manage catalog items, pricing, inventory stock, and promotions',
  },
  'add-product': {
    title: 'Add New Product',
    subtitle: 'Create a new catalog entry with pricing, images, and categories',
  },
  'edit-product': {
    title: 'Edit Product',
    subtitle: 'Update existing product information, stock levels, and discounts',
  },
  'delete-product': {
    title: 'Delete Product Management',
    subtitle: 'Review, remove inactive items, and audit inventory entries safely',
  },
  orders: {
    title: 'Order Management',
    subtitle: 'Track customer orders, update shipping progress, and review invoices',
  },
  customers: {
    title: 'Customer Directory',
    subtitle: 'Customer profiles, order frequency, loyalty tier, and contact info',
  },
  settings: {
    title: 'Store Settings',
    subtitle: 'Configure currency, shipping thresholds, taxes, and notification alerts',
  },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentPage,
  onOpenSidebar,
  onNavigate,
  onOpenStorefrontPreview,
  pendingOrdersCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const info = PAGE_TITLES[currentPage] || { title: 'Admin', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl font-extrabold text-stone-900 tracking-tight">
              {info.title}
            </h1>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-semibold border border-stone-200">
              Preview Mode
            </span>
          </div>
          <p className="hidden sm:block text-xs text-stone-500 font-medium">
            {info.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Quick Add Product Button */}
        {currentPage !== 'add-product' && (
          <button
            onClick={() => onNavigate('add-product')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-orange-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        )}

        {/* Storefront Preview Button */}
        <button
          onClick={onOpenStorefrontPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-700 rounded-xl text-xs font-semibold border border-stone-200/80 transition-all cursor-pointer"
          title="Open Mobile Storefront Preview"
        >
          <Store className="w-3.5 h-3.5 text-orange-600" />
          <span className="hidden md:inline">Storefront</span>
          <ExternalLink className="w-3 h-3 text-stone-400" />
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingOrdersCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-3 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                <p className="text-xs font-bold text-stone-900">Notifications</p>
                <span className="text-[10px] text-orange-600 font-semibold bg-orange-50 px-2 py-0.5 rounded-full">
                  {pendingOrdersCount} pending orders
                </span>
              </div>
              <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                <div
                  onClick={() => {
                    onNavigate('orders');
                    setShowNotifications(false);
                  }}
                  className="p-3 hover:bg-stone-50 cursor-pointer flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600 mt-0.5">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">New Order Received</p>
                    <p className="text-[11px] text-stone-500">Order #ORD-829141 is awaiting fulfillment.</p>
                    <span className="text-[10px] text-stone-400">10 mins ago</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    onNavigate('products');
                    setShowNotifications(false);
                  }}
                  className="p-3 hover:bg-stone-50 cursor-pointer flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-800">Inventory Synchronized</p>
                    <p className="text-[11px] text-stone-500">All product catalogs synced with live store.</p>
                    <span className="text-[10px] text-stone-400">1 hour ago</span>
                  </div>
                </div>
              </div>
              <div className="px-4 pt-2 border-t border-stone-100 text-center">
                <button
                  onClick={() => {
                    onNavigate('orders');
                    setShowNotifications(false);
                  }}
                  className="text-[11px] font-bold text-orange-600 hover:underline"
                >
                  View All Orders →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
