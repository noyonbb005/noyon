import React, { useState } from 'react';
import { X, Star, Plus, Minus, Check, Truck, RotateCcw, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOrderNowDirectly?: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOrderNowDirectly,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        id="product-quick-view-modal"
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        <button
          id="close-modal-btn"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 p-2 text-stone-600 hover:text-stone-900 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Image */}
          <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-2 py-0.5 text-xs font-black uppercase bg-orange-600 text-white rounded shadow-sm">
                -{product.discountPercent}% OFF
              </span>
            )}
            <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white rounded">
              {product.soldCount}
            </span>
          </div>

          {/* Info */}
          <div className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="uppercase tracking-wider font-bold text-orange-600 text-[10px]">
                  {product.category}
                </span>
                <span
                  className={`font-semibold ${
                    product.inStock ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {product.inStock ? '● In Stock' : 'Out of Stock'}
                </span>
              </div>

              <h2 className="text-base font-bold text-stone-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-700">
                  {product.rating}
                </span>
                <span className="text-xs text-stone-400">
                  ({product.reviewsCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-black text-orange-600">
                  {formatBDT(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatBDT(product.oldPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-stone-100">
              {product.inStock ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">Quantity</span>
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        id="modal-qty-decrease"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-l"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold text-stone-800">
                        {quantity}
                      </span>
                      <button
                        id="modal-qty-increase"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-r"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      id="modal-add-to-cart-btn"
                      onClick={handleAdd}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-orange-500 text-orange-600 hover:bg-orange-50 active:scale-[0.99]`}
                    >
                      {added ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span className="text-emerald-600">Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      id="modal-order-now-btn"
                      onClick={() => {
                        if (onOrderNowDirectly) {
                          onOrderNowDirectly(product, quantity);
                        }
                      }}
                      className="py-2.5 px-3 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Order Now • {formatBDT(product.price * quantity)}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 bg-stone-100 text-stone-400 rounded-xl font-bold text-xs cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-1 pt-3 mt-2 text-[10px] text-stone-500 border-t border-stone-100 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <Truck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                  <span>7-Day Return</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
                  <span>Authentic 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
