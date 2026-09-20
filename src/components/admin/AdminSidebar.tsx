import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Edit3,
  Trash2,
  ShoppingCart,
  Users,
  Settings,
  Store,
  X,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { AdminNavPage } from '../../types';

interface AdminSidebarProps {
  currentPage: AdminNavPage;
  onSelectPage: (page: AdminNavPage) => void;
  isOpen: boolean;
  onClose: () => void;
  pendingOrdersCount: number;
  totalProductsCount: number;
  totalCustomersCount: number;
  onOpenStorefrontPreview: () => void;
}

interface NavItem {
  id: AdminNavPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  group?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpen,
  onClose,
  pendingOrdersCount,
  totalProductsCount,
  totalCustomersCount,
  onOpenStorefrontPreview,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      group: 'Overview',
    },
    {
      id: 'products',
      label: 'Product Management',
      icon: Package,
      badge: totalProductsCount,
      badgeColor: 'bg-stone-100 text-stone-700',
      group: 'Catalog',
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: PlusCircle,
      group: 'Catalog',
    },
    {
      id: 'edit-product',
      label: 'Edit Product',
      icon: Edit3,
      group: 'Catalog',
    },
    {
      id: 'delete-product',
      label: 'Delete Product',
      icon: Trash2,
      group: 'Catalog',
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: ShoppingCart,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined,
      badgeColor: 'bg-orange-500 text-white',
      group: 'Sales & People',
    },
    {
      id: 'customers',
      label: 'Customer List',
      icon: Users,
      badge: totalCustomersCount,
      badgeColor: 'bg-stone-100 text-stone-700',
      group: 'Sales & People',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      group: 'System',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-stone-200/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 border-b border-stone-100 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-500/30 text-white font-black text-lg">
              O
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-stone-900 tracking-tight text-base">OrangeShop</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Store Management Console</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Store Quick Preview Pill */}
        <div className="p-3">
          <button
            onClick={onOpenStorefrontPreview}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-orange-50/70 hover:bg-orange-100/70 border border-orange-200/60 text-orange-800 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold">Customer Storefront</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 group-hover:translate-x-0.5 transition-transform">
              <span>Preview</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
          {['Overview', 'Catalog', 'Sales & People', 'System'].map((group) => {
            const groupItems = navItems.filter((i) => i.group === group);
            if (groupItems.length === 0) return null;

            return (
              <div key={group} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                  {group}
                </div>
                {groupItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectPage(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-orange-600 text-white font-bold shadow-xs shadow-orange-600/20'
                          : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-white' : 'text-stone-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor || 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Quick Stats Footer Card */}
        <div className="p-3 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70">
            <div className="flex items-center justify-between text-xs text-stone-600 font-medium mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Store Status
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live & Active
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              Orders and inventory automatically synchronize across channels.
            </p>
          </div>

          {/* Admin User Profile */}
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900 leading-none">Admin Workspace</p>
                <p className="text-[10px] text-stone-600 font-medium mt-0.5">noyonbb005@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
