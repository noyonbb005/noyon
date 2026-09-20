import React, { useState } from 'react';
import {
  Store,
  Truck,
  CreditCard,
  Bell,
  Save,
  CheckCircle2,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { StoreSettings } from '../../types';

interface SettingsViewProps {
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
  onResetSettings: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings: initialSettings,
  onSaveSettings,
  onResetSettings,
}) => {
  const [formData, setFormData] = useState<StoreSettings>(initialSettings);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Store settings saved successfully and active across all views!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Store Information */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Store Profile & Branding</h3>
              <p className="text-xs text-stone-500">General marketplace identity and contact points</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Customer Support Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => handleChange('supportEmail', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Support Phone Line
              </label>
              <input
                type="text"
                value={formData.supportPhone}
                onChange={(e) => handleChange('supportPhone', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Shipping & Tax Policy */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Shipping Rates & Tax Calculation</h3>
              <p className="text-xs text-stone-500">Checkout rules applied automatically to carts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Standard Shipping Fee (৳)
              </label>
              <input
                type="number"
                step="1"
                value={formData.standardShippingFee}
                onChange={(e) => handleChange('standardShippingFee', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Free Shipping Threshold (৳)
              </label>
              <input
                type="number"
                step="10"
                value={formData.freeShippingThreshold}
                onChange={(e) => handleChange('freeShippingThreshold', parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Gateways */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">Accepted Payment Gateways</h3>
              <p className="text-xs text-stone-500">Enable or disable customer checkout methods</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</p>
                <p className="text-[11px] text-stone-500">Customers pay in cash upon doorstep delivery</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableCod}
                onChange={(e) => handleChange('enableCod', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900">Credit / Debit Card Online</p>
                <p className="text-[11px] text-stone-500">Direct digital checkout via Visa, MasterCard</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableOnlinePayment}
                onChange={(e) => handleChange('enableOnlinePayment', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Notifications & Stock Warnings */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">System & Admin Notifications</h3>
              <p className="text-xs text-stone-500">Alert preferences for order updates and stock levels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900">Instant Order Email Notifications</p>
                <p className="text-[11px] text-stone-500">Send instant alert when a customer places an order</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableOrderNotifications}
                onChange={(e) => handleChange('enableOrderNotifications', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
              <div>
                <p className="text-xs font-bold text-stone-900">Low Inventory Warnings</p>
                <p className="text-[11px] text-stone-500">Highlight products when stock dips under 5 units</p>
              </div>
              <input
                type="checkbox"
                checked={formData.enableLowStockAlert}
                onChange={(e) => handleChange('enableLowStockAlert', e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetSettings}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-orange-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
