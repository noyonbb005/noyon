import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Award,
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Customer } from '../../types';
import { formatBDT } from '../../utils/currency';

interface CustomerListViewProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
}

export const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  onAddCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'VIP' | 'Active' | 'Inactive'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newStatus, setNewStatus] = useState<'Active' | 'VIP' | 'Inactive'>('Active');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, statusFilter]);

  // Metrics
  const totalCustomers = customers.length;
  const vipCount = customers.filter((c) => c.status === 'VIP').length;
  const totalSpendSum = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgSpend = totalCustomers > 0 ? totalSpendSum / totalCustomers : 0;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newCust: Customer = {
      id: 'CUST-' + Math.floor(100 + Math.random() * 900),
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+1 (555) 000-1122',
      city: newCity.trim() || 'New York, NY',
      country: 'United States',
      totalOrders: 1,
      totalSpent: 4999,
      status: newStatus,
      joinedDate: 'Just now',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    };

    onAddCustomer(newCust);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewCity('');
  };

  return (
    <div className="space-y-6">
      {/* 4 Mini Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Customer Database
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">{totalCustomers}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            100% Verified Profiles
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            VIP Tier Members
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">{vipCount}</p>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            Exclusive loyalty rewards
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Average Lifetime Value
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">{formatBDT(avgSpend)}</p>
          <span className="text-[11px] text-stone-500 font-semibold mt-1 block">
            Per active account
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
            Repeat Purchase Rate
          </span>
          <p className="text-2xl font-black text-stone-900 mt-1">78.4%</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            +4.2% higher than industry
          </span>
        </div>
      </div>

      {/* Filter and Action Header */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers by name, email, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-500 mr-1">Status:</span>
          {(['All', 'VIP', 'Active', 'Inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-stone-500">
            <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">No customers found</p>
            <p className="text-xs text-stone-400 mt-1">Try updating your search query or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-3">Contact Details</th>
                  <th className="py-3 px-3">City / Location</th>
                  <th className="py-3 px-3">Orders</th>
                  <th className="py-3 px-3">Total Spent</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.avatar}
                          alt={cust.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 bg-stone-100"
                        />
                        <div>
                          <p className="font-bold text-stone-900">{cust.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono">{cust.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="text-stone-800 font-medium">{cust.email}</div>
                      <div className="text-[10px] text-stone-500">{cust.phone}</div>
                    </td>

                    <td className="py-3 px-3 text-stone-700 font-medium">
                      {cust.city}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 font-bold text-stone-800">
                        {cust.totalOrders} orders
                      </span>
                    </td>

                    <td className="py-3 px-3 font-extrabold text-stone-900 text-sm">
                      {formatBDT(cust.totalSpent)}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          cust.status === 'VIP'
                            ? 'bg-purple-100 text-purple-800'
                            : cust.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {cust.status === 'VIP' && <Award className="w-3 h-3 mr-1" />}
                        {cust.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-stone-500 font-medium">
                      {cust.joinedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Quick Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="text-center">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-orange-500 shadow-sm"
              />
              <h3 className="text-base font-bold text-stone-900 mt-2">
                {selectedCustomer.name}
              </h3>
              <p className="text-xs text-stone-500">{selectedCustomer.email}</p>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  selectedCustomer.status === 'VIP'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {selectedCustomer.status} Customer
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold">Total Orders</span>
                <p className="font-extrabold text-stone-900">{selectedCustomer.totalOrders}</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold">Total Spent</span>
                <p className="font-extrabold text-orange-600">{formatBDT(selectedCustomer.totalSpent)}</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold">Phone</span>
                <p className="text-stone-700">{selectedCustomer.phone}</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold">Location</span>
                <p className="text-stone-700">{selectedCustomer.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-sm font-bold text-stone-900">Add New Customer</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jessica Williams"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jessica@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 123-4567"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                    City, State
                  </label>
                  <input
                    type="text"
                    placeholder="Miami, FL"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                  Loyalty Tier
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                >
                  <option value="Active">Active Shopper</option>
                  <option value="VIP">VIP Gold Member</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
