import React, { useState, useEffect, useMemo } from 'react';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminHeader } from './components/admin/AdminHeader';
import { DashboardView } from './components/admin/DashboardView';
import { ProductManagementView } from './components/admin/ProductManagementView';
import { AddProductView } from './components/admin/AddProductView';
import { EditProductView } from './components/admin/EditProductView';
import { DeleteProductView } from './components/admin/DeleteProductView';
import { OrderManagementView } from './components/admin/OrderManagementView';
import { CustomerListView } from './components/admin/CustomerListView';
import { SettingsView } from './components/admin/SettingsView';
import { StorefrontPreviewModal } from './components/admin/StorefrontPreviewModal';
import { QuickPriceModal } from './components/QuickPriceModal';
import { PRODUCTS as DEFAULT_PRODUCTS } from './data/marketplaceData';
import { INITIAL_ORDERS } from './data/sampleOrders';
import { INITIAL_CUSTOMERS } from './data/sampleCustomers';
import { DEFAULT_SETTINGS } from './data/defaultSettings';
import { Product, Order, Customer, StoreSettings, AdminNavPage, OrderStatus } from './types';
import { Check } from 'lucide-react';
import { formatBDT } from './utils/currency';

const PRODUCTS_KEY = 'orangeshop_admin_products_bdt';
const ORDERS_KEY = 'orangeshop_admin_orders_bdt';
const CUSTOMERS_KEY = 'orangeshop_admin_customers_bdt';
const SETTINGS_KEY = 'orangeshop_admin_settings_bdt';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AdminNavPage>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected product for edit page
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  // Quick price modal
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);
  // Storefront preview modal
  const [isStorefrontPreviewOpen, setIsStorefrontPreviewOpen] = useState(false);

  // Products state with local storage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  // Orders state with local storage persistence
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  // Customers state with local storage persistence
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    } catch {
      // ignore
    }
  }, [customers]);

  // Settings state with local storage persistence
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Extract unique categories from current products
  const allCategories = useMemo(() => {
    const set = new Set(['Electronics', 'Fashion', 'Beauty', 'Home Living', 'Shoes & Bags', 'Watches', 'Groceries']);
    products.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [products]);

  // Counts
  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.status === 'Pending').length,
    [orders]
  );

  // Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalog!`);
  };

  const handleEditProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Updated "${updated.name}"!`);
  };

  const handleDeleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Deleted "${prod?.name || 'Product'}"`);
  };

  const handleBatchDeleteProducts = (productIds: string[]) => {
    setProducts((prev) => prev.filter((p) => !productIds.includes(p.id)));
    showToast(`Deleted ${productIds.length} products`);
  };

  const handleResetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    showToast('Catalog restored to default demo items');
  };

  const handleUpdatePrice = (
    productId: string,
    newPrice: number,
    newOldPrice?: number,
    newDiscount?: number
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            price: newPrice,
            oldPrice: newOldPrice,
            discountPercent: newDiscount !== undefined ? newDiscount : p.discountPercent,
          };
        }
        return p;
      })
    );
    showToast(`Updated price to ${formatBDT(newPrice)}`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order #${orderId} marked as ${newStatus}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted`);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    showToast(`Added customer "${newCustomer.name}"`);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    showToast('Store settings saved!');
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    showToast('Settings restored to defaults');
  };

  const navigateToEdit = (prod: Product) => {
    setProductToEdit(prod);
    setCurrentPage('edit-product');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex font-sans antialiased selection:bg-orange-200 selection:text-orange-900">
      {/* Sidebar Navigation */}
      <AdminSidebar
        currentPage={currentPage}
        onSelectPage={(page) => setCurrentPage(page)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        pendingOrdersCount={pendingOrdersCount}
        totalProductsCount={products.length}
        totalCustomersCount={customers.length}
        onOpenStorefrontPreview={() => setIsStorefrontPreviewOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AdminHeader
          currentPage={currentPage}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onNavigate={(page) => setCurrentPage(page)}
          onOpenStorefrontPreview={() => setIsStorefrontPreviewOpen(true)}
          pendingOrdersCount={pendingOrdersCount}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <DashboardView
              products={products}
              orders={orders}
              customers={customers}
              onNavigate={(page) => setCurrentPage(page)}
              onEditProduct={navigateToEdit}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          )}

          {currentPage === 'products' && (
            <ProductManagementView
              products={products}
              onNavigate={(page) => setCurrentPage(page)}
              onEditProduct={navigateToEdit}
              onDeleteProduct={handleDeleteProduct}
              onOpenQuickPrice={(p) => setQuickPriceProduct(p)}
            />
          )}

          {currentPage === 'add-product' && (
            <AddProductView
              categories={allCategories}
              onAddProduct={handleAddProduct}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'edit-product' && (
            <EditProductView
              products={products}
              selectedProduct={productToEdit}
              onEditProduct={handleEditProduct}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'delete-product' && (
            <DeleteProductView
              products={products}
              onDeleteProduct={handleDeleteProduct}
              onBatchDeleteProducts={handleBatchDeleteProducts}
              onResetToDefaults={handleResetToDefaults}
              onNavigate={(page) => setCurrentPage(page)}
            />
          )}

          {currentPage === 'orders' && (
            <OrderManagementView
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {currentPage === 'customers' && (
            <CustomerListView
              customers={customers}
              onAddCustomer={handleAddCustomer}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetSettings={handleResetSettings}
            />
          )}
        </main>
      </div>

      {/* Quick Price & Discount Adjustment Modal */}
      <QuickPriceModal
        product={quickPriceProduct}
        isOpen={quickPriceProduct !== null}
        onClose={() => setQuickPriceProduct(null)}
        onUpdatePrice={handleUpdatePrice}
      />

      {/* Customer Storefront Live Simulator Modal */}
      <StorefrontPreviewModal
        isOpen={isStorefrontPreviewOpen}
        onClose={() => setIsStorefrontPreviewOpen(false)}
        products={products}
      />

      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
