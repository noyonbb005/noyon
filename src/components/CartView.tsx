import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { CartItem } from '../types';
import { formatBDT } from '../utils/currency';

interface CartViewProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedCheckout,
  onContinueShopping,
}) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 5000;
  const isFreeShipping = subtotal >= freeShippingThreshold || items.length === 0;
  const shippingCost = isFreeShipping ? 0 : 60;
  const totalPayable = Math.max(0, subtotal - discountApplied + shippingCost);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (code === 'ORANGE50') {
      const discount = Math.round(subtotal * 0.15); // 15% discount
      setDiscountApplied(discount);
      setVoucherMessage('🎉 ORANGE50 applied! 15% off');
    } else if (code === 'FREESHIP') {
      setDiscountApplied(60);
      setVoucherMessage('🚚 Free shipping voucher applied!');
    } else {
      setVoucherMessage('⚠️ Invalid voucher code. Try ORANGE50');
    }
  };

  return (
    <div className="pb-24 bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-orange-600" />
          <h2 className="text-base font-extrabold text-stone-900">
            My Cart ({totalCount})
          </h2>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-stone-400 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-20 px-4 text-center">
          <div className="w-20 h-20 bg-orange-50 text-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
            <ShoppingBag className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Your shopping cart is empty</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto mb-5">
            Looks like you haven't added anything to your cart yet. Explore thousands of flash deals!
          </p>
          <button
            onClick={onContinueShopping}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-orange-500/20"
          >
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div>
          {/* Free Shipping Alert Bar */}
          <div className="bg-orange-50/80 border-b border-orange-200 px-4 py-2.5 text-xs text-orange-800">
            <div className="flex items-center justify-between mb-1">
              <span>
                {isFreeShipping
                  ? '🎉 You unlocked FREE standard shipping!'
                  : `Add ${formatBDT(freeShippingThreshold - subtotal)} more for FREE shipping`}
              </span>
              <span className="font-bold">
                {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
              </span>
            </div>
            <div className="w-full bg-orange-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-orange-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Cart Items */}
          <div className="p-3 space-y-2.5">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex gap-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg border border-stone-200 bg-stone-50 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-stone-400 hover:text-red-600 transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[10px] text-orange-600 font-semibold">
                      {item.product.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-black text-orange-600">
                        {formatBDT(item.product.price * item.quantity)}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        ({formatBDT(item.product.price)} ea)
                      </span>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-1 text-stone-600 hover:text-orange-600"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-1 text-stone-600 hover:text-orange-600"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher input */}
          <div className="px-3 pt-1">
            <form
              onSubmit={handleApplyVoucher}
              className="bg-white p-3 rounded-xl border border-stone-200 shadow-xs flex flex-col gap-2"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                <Tag className="w-3.5 h-3.5 text-orange-600" />
                <span>Store Voucher (Use: ORANGE50)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Promo Code"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg uppercase tracking-wider focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              {voucherMessage && (
                <p className="text-[11px] text-orange-700 font-medium">{voucherMessage}</p>
              )}
            </form>
          </div>

          {/* Order Summary */}
          <div className="p-3">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Merchandise Subtotal</span>
                <span>{formatBDT(subtotal)}</span>
              </div>
              {discountApplied > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount</span>
                  <span>-{formatBDT(discountApplied)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Shipping Fee</span>
                <span>{shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : formatBDT(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-stone-900 border-t border-stone-200 pt-2">
                <span>Total Payment</span>
                <span className="text-orange-600">{formatBDT(totalPayable)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Action */}
          <div className="px-3">
            <button
              id="cart-checkout-proceed-btn"
              onClick={onProceedCheckout}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Proceed to Checkout ({formatBDT(totalPayable)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
