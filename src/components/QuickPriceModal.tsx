import React, { useState, useEffect } from 'react';
import { X, DollarSign, Percent, ArrowRight, Check } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';

interface QuickPriceModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePrice: (productId: string, newPrice: number, newOldPrice?: number, newDiscount?: number) => void;
}

export const QuickPriceModal: React.FC<QuickPriceModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdatePrice,
}) => {
  const [price, setPrice] = useState<string>('');
  const [oldPrice, setOldPrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    if (product) {
      setPrice(product.price.toString());
      setOldPrice(product.oldPrice ? product.oldPrice.toString() : Math.round(product.price * 1.3).toString());
      setDiscountPercent(product.discountPercent || 0);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handlePriceChange = (val: string) => {
    setPrice(val);
    const p = parseFloat(val);
    const op = parseFloat(oldPrice);
    if (!isNaN(p) && !isNaN(op) && op > p) {
      setDiscountPercent(Math.round(((op - p) / op) * 100));
    }
  };

  const handleOldPriceChange = (val: string) => {
    setOldPrice(val);
    const op = parseFloat(val);
    const p = parseFloat(price);
    if (!isNaN(p) && !isNaN(op) && op > p) {
      setDiscountPercent(Math.round(((op - p) / op) * 100));
    }
  };

  const handleDiscountChange = (val: number) => {
    setDiscountPercent(val);
    const op = parseFloat(oldPrice);
    if (!isNaN(op) && op > 0 && val >= 0 && val < 100) {
      const calculatedNewPrice = Math.round(op * (1 - val / 100)).toString();
      setPrice(calculatedNewPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = parseFloat(price);
    const finalOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
    if (!isNaN(finalPrice) && finalPrice > 0) {
      onUpdatePrice(product.id, finalPrice, finalOldPrice, discountPercent);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        id="quick-price-modal"
        className="relative bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Percent className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Change Price & Discount</h3>
              <p className="text-[10px] text-orange-100 truncate max-w-[200px]">
                {product.name}
              </p>
            </div>
          </div>
          <button
            id="close-quick-price-btn"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-3 bg-stone-50/50">
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-800 line-clamp-1">{product.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs">
              <span className="text-stone-400">Current:</span>
              <span className="font-bold text-orange-600">{formatBDT(product.price)}</span>
              {product.oldPrice && (
                <span className="text-[10px] text-stone-400 line-through">
                  {formatBDT(product.oldPrice)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                New Price (৳)
              </label>
              <div className="relative">
                <span className="font-bold text-xs text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2">৳</span>
                <input
                  id="quick-price-input"
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-extrabold text-stone-900 focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Original Price (৳)
              </label>
              <div className="relative">
                <span className="font-bold text-xs text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2">৳</span>
                <input
                  id="quick-oldprice-input"
                  type="number"
                  step="1"
                  min="1"
                  value={oldPrice}
                  onChange={(e) => handleOldPriceChange(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:bg-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Discount Slider & Buttons */}
          <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between font-bold text-stone-800">
              <span>Set Discount:</span>
              <span className="px-2 py-0.5 bg-orange-600 text-white font-black rounded text-[11px]">
                {discountPercent}% OFF
              </span>
            </div>

            <input
              id="quick-discount-slider"
              type="range"
              min="0"
              max="90"
              step="5"
              value={discountPercent}
              onChange={(e) => handleDiscountChange(parseInt(e.target.value, 10))}
              className="w-full accent-orange-600"
            />

            <div className="grid grid-cols-5 gap-1 pt-1">
              {[0, 10, 25, 50, 75].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleDiscountChange(pct)}
                  className={`py-1 rounded text-[10px] font-bold transition-colors ${
                    discountPercent === pct
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-stone-600 hover:bg-orange-100'
                  }`}
                >
                  {pct === 0 ? '0%' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Preview */}
          <div className="p-2.5 bg-stone-50 rounded-xl flex items-center justify-between text-[11px]">
            <span className="text-stone-500">Live Preview:</span>
            <div className="flex items-center gap-1.5 font-bold">
              <span className="text-orange-600 text-sm">
                {formatBDT(parseFloat(price || '0'))}
              </span>
              {oldPrice && parseFloat(oldPrice) > parseFloat(price || '0') && (
                <span className="text-stone-400 line-through text-[10px]">
                  {formatBDT(parseFloat(oldPrice))}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-1.5 py-0.2 bg-orange-100 text-orange-700 text-[10px] rounded font-extrabold">
                  -{discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="quick-price-submit-btn"
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Price</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
