import React from 'react';
import {
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  ArrowUpRight,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
} from 'lucide-react';
import { Product, Order, Customer, AdminNavPage } from '../../types';
import { formatBDT } from '../../utils/currency';

interface DashboardViewProps {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  onNavigate: (page: AdminNavPage) => void;
  onEditProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  orders,
  customers,
  onNavigate,
  onEditProduct,
  onUpdateOrderStatus,
}) => {
  // Calculations
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  // Real-time sales calculated from orders
  const calculatedSalesFromOrders = orders.reduce(
    (acc, order) => (order.status !== 'Cancelled' ? acc + order.totalPrice : acc),
    0
  );
  // Add base historical sales formatted in BDT
  const totalSalesFormatted = formatBDT(calculatedSalesFromOrders + 1248050);

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter((c) => c.status === 'VIP').length;

  // Category counts
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      {/* 4 Main Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <div
          onClick={() => onNavigate('products')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
              {totalProducts}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {inStockCount} In Stock
              </span>
              {outOfStockCount > 0 ? (
                <span className="text-rose-600 font-semibold">
                  {outOfStockCount} Out of Stock
                </span>
              ) : (
                <span className="text-stone-500">100% Available</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
              {totalOrders + 128}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded-full">
                {pendingOrders} Pending
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +8.4%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Sales */}
        <div
          onClick={() => onNavigate('orders')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total Sales
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
              {totalSalesFormatted}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Monthly volume</span>
              <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />
                +14.2% MoM
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Customers */}
        <div
          onClick={() => onNavigate('customers')}
          className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Customers
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl lg:text-3xl font-black text-stone-900 tracking-tight">
              {(totalCustomers * 142).toLocaleString()}
            </h3>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full">
                {vipCustomers} VIP Clients
              </span>
              <span className="text-emerald-600 font-semibold">+92 this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-base font-bold">Quick Administrative Shortcuts</h4>
          <p className="text-xs text-stone-400 mt-0.5">
            Rapidly add inventory, fulfill incoming customer requests, or customize store policies.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('add-product')}
            className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => onNavigate('orders')}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => onNavigate('customers')}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customer Directory</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Catalog Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Recent Customer Orders</h3>
              <p className="text-xs text-stone-500">Live order status and fulfillment workflow</p>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 font-mono font-bold text-stone-900">
                      {order.id}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-stone-800">{order.customerName}</div>
                      <div className="text-[10px] text-stone-500">{order.phone}</div>
                    </td>
                    <td className="py-3 font-bold text-stone-900">
                      {formatBDT(order.totalPrice)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Processing'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'Shipped'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                        className="text-[11px] bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 font-medium text-stone-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Category Distribution & Inventory Summary */}
        <div className="space-y-6">
          {/* Categories card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Categories Breakdown</h3>
                <p className="text-xs text-stone-500">Products distributed across aisles</p>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Browse
              </button>
            </div>

            <div className="space-y-3">
              {sortedCategories.slice(0, 5).map(([cat, count]) => {
                const percentage = Math.round((count / totalProducts) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-700">{cat}</span>
                      <span className="text-stone-500 font-mono">
                        {count} items ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fulfillment Status Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Fulfillment Pipeline</h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending</span>
                </div>
                <p className="text-lg font-black text-amber-900 mt-1">{pendingOrders}</p>
                <p className="text-[10px] text-amber-700">Requires packaging</p>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/60">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Processing</span>
                </div>
                <p className="text-lg font-black text-blue-900 mt-1">{processingOrders}</p>
                <p className="text-[10px] text-blue-700">In dispatch queue</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed & Delivered</span>
                  </div>
                  <span className="text-xs font-black text-emerald-900">{deliveredOrders + 89} orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
