import React, { useState } from 'react';
import { X, CheckCircle2, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';
import { formatBDT } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderComplete,
}) => {
  const [formData, setFormData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    address: '123 Market Street, Apt 4B',
    city: 'San Francisco',
    postalCode: '94103',
    cardNumber: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '921',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 5000 || items.length === 0 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingCost + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setIsProcessing(false);
      setOrderConfirmed(true);
      onOrderComplete();
    }, 1200);
  };

  const handleFinish = () => {
    setOrderConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity"
        onClick={orderConfirmed ? handleFinish : onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        id="checkout-dialog"
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {orderConfirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-900">Thank you for your order!</h3>
              <p className="text-sm text-stone-500 mt-1">
                Order confirmation and tracking details sent to{' '}
                <span className="font-semibold text-stone-700">{formData.email}</span>
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Order Number</span>
                <span className="font-mono font-semibold text-stone-900">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping To</span>
                <span className="font-medium text-stone-800">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-semibold">
                <span className="text-stone-700">Total Paid</span>
                <span className="text-stone-900">{formatBDT(total)}</span>
              </div>
            </div>

            <button
              id="order-success-continue-btn"
              onClick={handleFinish}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-stone-500" />
                <h3 className="text-base font-semibold text-stone-900">Secure Checkout</h3>
              </div>
              <button
                id="close-checkout-btn"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full transition-colors"
                aria-label="Close checkout"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Contact & Shipping */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Contact & Shipping
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Street Address
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      City
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      ZIP / Postal Code
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* Payment simulation */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Payment Method
                  </h4>
                  <div className="flex items-center gap-1.5 text-stone-500 text-xs">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Card</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Card Number
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Expiration
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Order Totals */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-stone-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'FREE' : formatBDT(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax</span>
                  <span>{formatBDT(tax)}</span>
                </div>
                <div className="border-t border-stone-200 pt-1.5 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total</span>
                  <span>{formatBDT(total)}</span>
                </div>
              </div>

              {/* Submit */}
              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Place Order • {formatBDT(total)}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
