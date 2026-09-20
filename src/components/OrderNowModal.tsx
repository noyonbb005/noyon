import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';

interface OrderNowModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: (product: Product, quantity: number, details: any) => void;
  onAddToCartInstead: (product: Product, quantity: number) => void;
}

export const OrderNowModal: React.FC<OrderNowModalProps> = ({
  product,
  isOpen,
  onClose,
  onConfirmOrder,
  onAddToCartInstead,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    phone: '+1 (555) 019-2834',
    address: '452 Elm Street, Apt 302, New York, NY',
    paymentMethod: 'cod', // cash on delivery or online
    deliveryNote: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen || !product) return null;

  const unitPrice = product.price;
  const deliveryFee = 60;
  const totalPrice = unitPrice * quantity + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedId);
      setIsSubmitting(false);
      setOrderPlaced(true);
      onConfirmOrder(product, quantity, formData);
    }, 800);
  };

  const handleResetAndClose = () => {
    setOrderPlaced(false);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={orderPlaced ? handleResetAndClose : onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card (Bottom-sheet style on mobile, centered on desktop) */}
      <div
        id="order-now-modal-panel"
        className="relative bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl overflow-hidden z-10 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        {orderPlaced ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-stone-900">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Your order is confirmed and being prepared for shipment.
              </p>
            </div>

            <div className="bg-orange-50/70 border border-orange-200/80 rounded-xl p-3.5 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID:</span>
                <span className="font-mono font-bold text-orange-600">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Item:</span>
                <span className="font-medium text-stone-800 line-clamp-1 max-w-[200px]">
                  {quantity}x {product.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment:</span>
                <span className="font-semibold text-stone-800 uppercase">
                  {formData.paymentMethod === 'cod' ? 'Cash On Delivery' : 'Online Payment'}
                </span>
              </div>
              <div className="flex justify-between border-t border-orange-200/60 pt-1.5 font-bold text-sm text-stone-900">
                <span>Total Amount:</span>
                <span className="text-orange-600">{formatBDT(totalPrice)}</span>
              </div>
            </div>

            <button
              id="order-done-continue-btn"
              onClick={handleResetAndClose}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-600" />
                <h3 className="text-sm font-bold text-stone-900">Quick Order Express</h3>
              </div>
              <button
                id="close-order-modal-btn"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Summary Row */}
            <div className="p-4 bg-orange-50/40 border-b border-orange-100 flex gap-3 items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border border-orange-200 bg-white shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-base font-black text-orange-600">
                    {formatBDT(product.price)}
                  </span>
                  {product.oldPrice && (
                    <span className="text-[11px] text-stone-400 line-through">
                      {formatBDT(product.oldPrice)}
                    </span>
                  )}
                  {product.discountPercent > 0 && (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-1 rounded">
                      -{product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Quantity adjuster */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-medium text-stone-600">Quantity:</span>
                  <div className="flex items-center border border-stone-200 rounded-md bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 text-stone-600 hover:text-orange-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 text-stone-600 hover:text-orange-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Recipient Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Phone Number
                </label>
                <input
                  required
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Delivery Address
                </label>
                <input
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Payment selection */}
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer text-xs transition-colors ${
                      formData.paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50/50 font-bold text-orange-700'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="accent-orange-600"
                    />
                    <span>Cash on Delivery</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer text-xs transition-colors ${
                      formData.paymentMethod === 'online'
                        ? 'border-orange-500 bg-orange-50/50 font-bold text-orange-700'
                        : 'border-stone-200 text-stone-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={formData.paymentMethod === 'online'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'online' })}
                      className="accent-orange-600"
                    />
                    <span>Online / Card</span>
                  </label>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/80 text-[11px] space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span>{formatBDT(unitPrice * quantity)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Standard Shipping</span>
                  <span>{formatBDT(deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-1 text-xs">
                  <span>Total Payable</span>
                  <span className="text-orange-600">{formatBDT(totalPrice)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="confirm-order-now-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      <span>Confirm Order ({formatBDT(totalPrice)})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAddToCartInstead(product, quantity);
                    onClose();
                  }}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-stone-500" />
                  <span>Add to Cart Instead</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400 pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Buyer Protection • 7-Day Hassle Free Returns</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
