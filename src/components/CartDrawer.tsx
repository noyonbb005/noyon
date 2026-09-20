import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { formatBDT } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 5000;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingLeft = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 60;
  const estimatedTotal = subtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer-panel"
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition ease-in-out duration-300"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="text-base font-semibold text-stone-900">
                Shopping Cart ({totalCount})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  id="clear-cart-btn"
                  onClick={onClearCart}
                  className="text-xs text-stone-400 hover:text-rose-600 transition-colors mr-2"
                >
                  Clear all
                </button>
              )}
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Meter */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs">
              <div className="flex justify-between items-center mb-1.5">
                {freeShippingLeft === 0 ? (
                  <span className="font-semibold text-emerald-700">
                    🎉 You unlocked free standard shipping!
                  </span>
                ) : (
                  <span className="text-stone-600">
                    Add <span className="font-semibold text-stone-900">{formatBDT(freeShippingLeft)}</span> more for free shipping
                  </span>
                )}
                <span className="text-stone-400 font-medium">
                  {Math.round(shippingPercent)}%
                </span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    freeShippingLeft === 0 ? 'bg-emerald-500' : 'bg-stone-900'
                  }`}
                  style={{ width: `${shippingPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">Your cart is empty</h3>
                <p className="text-sm text-stone-500 mt-1 max-w-xs mb-6">
                  Explore our collection of everyday essentials and add your favorites.
                </p>
                <button
                  id="empty-cart-shop-now-btn"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          id={`remove-item-${item.product.id}`}
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {formatBDT(item.product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          id={`cart-decrease-${item.product.id}`}
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-l"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          id={`cart-increase-${item.product.id}`}
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-r"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-stone-900">
                        {formatBDT(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with totals & checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <strong className="text-emerald-700">FREE</strong> : formatBDT(shippingCost)}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between text-sm font-bold text-stone-900">
                  <span>Estimated Total</span>
                  <span>{formatBDT(estimatedTotal)}</span>
                </div>
              </div>

              <button
                id="proceed-checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted checkout & 30-day free returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
