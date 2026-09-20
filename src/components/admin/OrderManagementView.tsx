import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
  User,
  Phone,
  MapPin,
  Trash2,
  Filter,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { formatBDT } from '../../utils/currency';

interface OrderManagementViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onDeleteOrder: (orderId: string) => void;
}

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
}) => {
  const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: orders.length };
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === 'All' || order.status === activeTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.phone.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Status Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, phone, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Managing <span className="font-bold text-stone-900">{orders.length}</span> Total Customer Orders
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-stone-100 pt-3">
          {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
            (tab) => {
              const count = statusCounts[tab] || 0;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                  }`}
                >
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">No orders found</p>
            <p className="text-xs text-stone-400 mt-1">There are no orders matching this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-3">Customer Information</th>
                  <th className="py-3 px-3">Purchased Items</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Order ID */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-stone-900 block">{order.id}</span>
                      <span className="text-[10px] text-stone-400">{order.createdAt}</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-800">{order.customerName}</div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {order.phone}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400 flex-shrink-0" />
                        <span className="truncate">{order.address}</span>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.productImage}
                            alt={item.productName}
                            title={`${item.productName} (x${item.quantity})`}
                            className="w-8 h-8 rounded-lg object-cover border border-stone-200 bg-stone-100"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-1 rounded-md">
                            +{order.items.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} items total
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-3 font-extrabold text-stone-900 text-sm">
                      {formatBDT(order.totalPrice)}
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                        {order.paymentMethod}
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-1.5 text-stone-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                          title="View Invoice & Delivery Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteOrder(order.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  Order Invoice
                </span>
                <h3 className="text-base font-black text-stone-900">
                  {selectedOrderForInvoice.id}
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getStatusBadge(
                  selectedOrderForInvoice.status
                )}`}
              >
                {selectedOrderForInvoice.status}
              </span>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-stone-50 rounded-xl text-xs">
              <div>
                <span className="font-bold text-stone-500 text-[10px] uppercase">Customer</span>
                <p className="font-bold text-stone-900 mt-0.5">
                  {selectedOrderForInvoice.customerName}
                </p>
                <p className="text-stone-500">{selectedOrderForInvoice.phone}</p>
              </div>

              <div>
                <span className="font-bold text-stone-500 text-[10px] uppercase">Shipping Address</span>
                <p className="text-stone-700 mt-0.5">{selectedOrderForInvoice.address}</p>
              </div>
            </div>

            {/* Itemized list */}
            <div>
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                Order Items ({selectedOrderForInvoice.items.length})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrderForInvoice.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-200"
                      />
                      <div>
                        <p className="font-bold text-stone-800 line-clamp-1">{item.productName}</p>
                        <p className="text-[11px] text-stone-500">
                          {formatBDT(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900 font-mono">
                      {formatBDT(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Payment Method:</span>
                <span className="text-xs font-bold text-stone-800">
                  {selectedOrderForInvoice.paymentMethod}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">Final Total:</span>
                <span className="text-lg font-black text-orange-600">
                  {formatBDT(selectedOrderForInvoice.totalPrice)}
                </span>
              </div>
            </div>

            {/* Close */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
