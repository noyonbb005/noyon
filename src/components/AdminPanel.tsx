import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  DollarSign,
  ArrowLeft,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  XCircle,
  Filter,
  Eye,
  Check,
  Percent,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, Order, OrderStatus } from '../types';
import { formatBDT } from '../utils/currency';
import { ProductFormModal } from './ProductFormModal';
import { QuickPriceModal } from './QuickPriceModal';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdatePrice: (productId: string, newPrice: number, newOldPrice?: number, newDiscount?: number) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
  onBackToStore: () => void;
  onLogout: () => void;
  categories: string[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdatePrice,
  onUpdateOrderStatus,
  onDeleteOrder,
  onBackToStore,
  onLogout,
  categories,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  // Product Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Order Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isQuickPriceOpen, setIsQuickPriceOpen] = useState(false);
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null);

  // Deletion confirm state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics summary
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.totalPrice : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending').length;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-3 h-3 text-amber-600" />;
      case 'Processing':
        return <SlidersHorizontal className="w-3 h-3 text-blue-600" />;
      case 'Shipped':
        return <Truck className="w-3 h-3 text-purple-600" />;
      case 'Delivered':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
      case 'Cancelled':
        return <XCircle className="w-3 h-3 text-red-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-16">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-stone-900 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              id="admin-back-to-store-btn"
              onClick={onBackToStore}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  Orange<span className="text-orange-500">Shop</span> Admin
                </span>
                <span className="px-1.5 py-0.5 bg-orange-600 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                  Manager
                </span>
              </div>
              <p className="text-[10px] text-stone-400">Store Management Console</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-200 hover:text-white transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span>View Store</span>
            </button>

            <button
              id="admin-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Logout from Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 flex gap-2 border-t border-stone-800">
          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-orange-500 text-orange-400 bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'border-orange-500 text-orange-400 bg-stone-800/40'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-orange-600 text-white text-[9px] font-black rounded-full animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 pt-4 space-y-4">
        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-stone-400">Total Products</p>
            <p className="text-lg font-black text-stone-900 mt-0.5">{products.length}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-stone-400">Total Orders</p>
            <p className="text-lg font-black text-stone-900 mt-0.5">{orders.length}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-stone-400">Pending Orders</p>
            <p className="text-lg font-black text-amber-600 mt-0.5">{pendingOrdersCount}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs">
            <p className="text-[10px] uppercase font-bold text-stone-400">Total Revenue</p>
            <p className="text-lg font-black text-emerald-600 mt-0.5">
              {formatBDT(totalRevenue)}
            </p>
          </div>
        </div>

        {/* ----------------- TAB: PRODUCTS ----------------- */}
        {activeTab === 'products' && (
          <div className="space-y-3">
            {/* Action Bar */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
              {/* Search & Category Filter */}
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="admin-product-search"
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <select
                  id="admin-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none font-medium text-stone-700"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Product Button */}
              <button
                id="admin-add-product-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500">
                <Package className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="font-bold text-sm text-stone-700">No products found</p>
                <p className="text-xs text-stone-400 mt-1">
                  Try changing your search or add a new product.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    id={`admin-product-item-${product.id}`}
                    className="bg-white p-3 sm:p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-200 transition-colors"
                  >
                    {/* Left: Product Thumbnail & Basic Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded">
                            {product.category}
                          </span>
                          {product.discountPercent > 0 && (
                            <span className="text-[10px] font-black px-1.5 py-0.5 bg-orange-600 text-white rounded">
                              -{product.discountPercent}%
                            </span>
                          )}
                          {!product.inStock && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                              Out of Stock
                            </span>
                          )}
                          {product.isFlashDeal && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                              ⚡ Flash Deal
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-stone-900 mt-1 line-clamp-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-xs">
                          <span className="font-black text-orange-600">
                            {formatBDT(product.price)}
                          </span>
                          {product.oldPrice && (
                            <span className="text-[11px] text-stone-400 line-through">
                              {formatBDT(product.oldPrice)}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400">
                            ⭐ {product.rating} ({product.reviewsCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions (Change Price, Edit, Delete) */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                      {/* Change Price & Discount Quick Action */}
                      <button
                        id={`btn-price-product-${product.id}`}
                        onClick={() => {
                          setQuickPriceProduct(product);
                          setIsQuickPriceOpen(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100/80 text-orange-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        title="Change Price & Discount"
                      >
                        <Percent className="w-3.5 h-3.5" />
                        <span>Price & Discount</span>
                      </button>

                      {/* Edit Product */}
                      <button
                        id={`btn-edit-product-${product.id}`}
                        onClick={() => {
                          setEditingProduct(product);
                          setIsProductModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        title="Edit Full Product Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      {/* Delete Product */}
                      <button
                        id={`btn-delete-product-${product.id}`}
                        onClick={() => setProductToDelete(product)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB: MANAGE ORDERS ----------------- */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-order-search"
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by Order ID, Customer Name, or Phone..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      id={`order-filter-${st.toLowerCase()}`}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1 rounded-xl font-bold shrink-0 transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 text-stone-500">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                <p className="font-bold text-sm text-stone-700">No orders found</p>
                <p className="text-xs text-stone-400 mt-1">
                  Placed orders from customers will show up here automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    id={`admin-order-card-${order.id}`}
                    className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3"
                  >
                    {/* Top Row: Order ID, Date, Status Badge & Dropdown */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-stone-900 bg-stone-100 px-2 py-1 rounded-lg">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-stone-400">{order.createdAt}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          <span>{order.status}</span>
                        </div>

                        <select
                          id={`select-status-${order.id}`}
                          value={order.status}
                          onChange={(e) =>
                            onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="px-2 py-1 text-xs bg-stone-50 border border-stone-200 rounded-lg font-bold text-stone-700 focus:outline-none focus:border-orange-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Customer & Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-stone-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">
                          Customer
                        </span>
                        <p className="font-bold text-stone-800">{order.customerName}</p>
                        <p className="text-stone-500 text-[11px]">{order.phone}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 uppercase font-bold block">
                          Shipping Address & Payment
                        </span>
                        <p className="text-stone-700 text-[11px] line-clamp-1">{order.address}</p>
                        <p className="text-orange-600 font-semibold text-[11px]">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-8 h-8 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-medium text-stone-800 line-clamp-1">
                                {item.productName}
                              </p>
                              <p className="text-[10px] text-stone-400">
                                Qty: {item.quantity} × {formatBDT(item.price)}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-stone-800">
                            {formatBDT(item.quantity * item.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Amount Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="font-bold text-stone-500">Total Order Amount:</span>
                      <span className="text-sm font-black text-orange-600">
                        {formatBDT(order.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={(prod) => {
          if (editingProduct) {
            onEditProduct(prod);
          } else {
            onAddProduct(prod);
          }
        }}
        productToEdit={editingProduct}
        categories={categories}
      />

      {/* Quick Price & Discount Modal */}
      <QuickPriceModal
        isOpen={isQuickPriceOpen}
        product={quickPriceProduct}
        onClose={() => {
          setIsQuickPriceOpen(false);
          setQuickPriceProduct(null);
        }}
        onUpdatePrice={onUpdatePrice}
      />

      {/* Confirm Delete Product Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl z-10 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Delete Product?</h3>
            <p className="text-xs text-stone-500">
              Are you sure you want to delete <strong>"{productToDelete.name}"</strong>? This will
              remove it from the store catalog.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 text-xs font-semibold bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-product-btn"
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="flex-1 py-2 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
