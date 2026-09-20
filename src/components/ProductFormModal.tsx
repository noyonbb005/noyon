import React, { useState, useEffect } from 'react';
import { X, Image, Tag, DollarSign, Percent, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit: Product | null;
  categories: string[];
}

const PRESET_IMAGES = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Smartwatch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Camera', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80' },
  { label: 'Handbag', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  categories,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('2999');
  const [oldPrice, setOldPrice] = useState<string>('4999');
  const [discountPercent, setDiscountPercent] = useState<number>(40);
  const [image, setImage] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setCategory(productToEdit.category);
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price.toString());
      setOldPrice(productToEdit.oldPrice ? productToEdit.oldPrice.toString() : '');
      setDiscountPercent(productToEdit.discountPercent || 0);
      setImage(productToEdit.image);
      setInStock(productToEdit.inStock);
      setIsFlashDeal(Boolean(productToEdit.isFlashDeal));
      setIsTrending(Boolean(productToEdit.isTrending));
      setFeatured(Boolean(productToEdit.featured));
    } else {
      setName('');
      setCategory(categories[0] || 'Electronics');
      setDescription('');
      setPrice('2999');
      setOldPrice('4999');
      setDiscountPercent(40);
      setImage(PRESET_IMAGES[0].url);
      setInStock(true);
      setIsFlashDeal(false);
      setIsTrending(false);
      setFeatured(false);
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  // Auto calculate discount percentage when price and old price change
  const handlePriceChange = (val: string) => {
    setPrice(val);
    const numPrice = parseFloat(val);
    const numOld = parseFloat(oldPrice);
    if (!isNaN(numPrice) && !isNaN(numOld) && numOld > numPrice) {
      setDiscountPercent(Math.round(((numOld - numPrice) / numOld) * 100));
    }
  };

  const handleOldPriceChange = (val: string) => {
    setOldPrice(val);
    const numOld = parseFloat(val);
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice) && !isNaN(numOld) && numOld > numPrice) {
      setDiscountPercent(Math.round(((numOld - numPrice) / numOld) * 100));
    }
  };

  const handleDiscountChange = (val: number) => {
    setDiscountPercent(val);
    const numOld = parseFloat(oldPrice);
    if (!isNaN(numOld) && numOld > 0 && val >= 0 && val < 100) {
      const calculatedNewPrice = Math.round(numOld * (1 - val / 100)).toString();
      setPrice(calculatedNewPrice);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(price) || 0;
    const parsedOldPrice = oldPrice ? parseFloat(oldPrice) : undefined;

    const productData: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      name: name.trim(),
      category,
      description: description.trim() || `${name} with premium quality and manufacturer warranty.`,
      price: parsedPrice,
      oldPrice: parsedOldPrice && parsedOldPrice > parsedPrice ? parsedOldPrice : undefined,
      discountPercent: discountPercent || 0,
      image: image.trim() || PRESET_IMAGES[0].url,
      inStock,
      isFlashDeal,
      isTrending,
      featured,
      rating: productToEdit?.rating || 4.8,
      reviewsCount: productToEdit?.reviewsCount || 1,
      soldCount: productToEdit?.soldCount || '10+ sold',
    };

    onSave(productData);
    onClose();
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
        id="product-form-modal"
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden z-10 my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-white">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-[11px] text-orange-100">
              {productToEdit
                ? 'Update product details, pricing, discount, and stock'
                : 'Create and list a new marketplace item'}
            </p>
          </div>
          <button
            id="close-product-form-btn"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 max-h-[75vh] overflow-y-auto space-y-3.5 text-xs">
          {/* Product Name */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Product Title *</label>
            <input
              id="product-form-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Category *</label>
            <select
              id="product-form-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing & Discount Card */}
          <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-orange-800 font-bold">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span>Price & Discount Settings</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-0.5">
                  Selling Price (৳) *
                </label>
                <input
                  id="product-form-price"
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:border-orange-500 focus:outline-none font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-0.5">
                  Original Price (৳)
                </label>
                <input
                  id="product-form-old-price"
                  type="number"
                  step="1"
                  min="0"
                  value={oldPrice}
                  onChange={(e) => handleOldPriceChange(e.target.value)}
                  placeholder="e.g. 4999"
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg focus:border-orange-500 focus:outline-none text-stone-700"
                />
              </div>
            </div>

            {/* Discount percentage slider & quick presets */}
            <div>
              <div className="flex items-center justify-between font-semibold text-stone-700 mb-1">
                <span>Discount:</span>
                <span className="px-2 py-0.5 bg-orange-600 text-white font-black rounded-md text-[11px]">
                  {discountPercent}% OFF
                </span>
              </div>
              <input
                id="product-form-discount-slider"
                type="range"
                min="0"
                max="90"
                step="5"
                value={discountPercent}
                onChange={(e) => handleDiscountChange(parseInt(e.target.value, 10))}
                className="w-full accent-orange-600"
              />
              <div className="flex gap-1.5 mt-1">
                {[0, 15, 30, 50, 70].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleDiscountChange(pct)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors ${
                      discountPercent === pct
                        ? 'bg-orange-600 text-white'
                        : 'bg-white text-stone-600 hover:bg-orange-100/60'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">
              Image URL *
            </label>
            <div className="flex gap-2">
              <input
                id="product-form-image"
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
              />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  className="w-9 h-9 object-cover rounded-lg border border-stone-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                  }}
                />
              )}
            </div>

            {/* Presets */}
            <div className="mt-2">
              <span className="text-[10px] text-stone-500 block mb-1">Or pick a preset image:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className="flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-orange-100/70 text-stone-700 hover:text-orange-700 rounded-lg text-[10px] shrink-0 transition-colors"
                  >
                    <Image className="w-3 h-3 text-orange-600" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Description</label>
            <textarea
              id="product-form-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of product features..."
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
            <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
              <input
                id="product-form-instock"
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="font-semibold text-stone-700">In Stock</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
              <input
                id="product-form-flashdeal"
                type="checkbox"
                checked={isFlashDeal}
                onChange={(e) => setIsFlashDeal(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="font-semibold text-stone-700">⚡ Flash Deal</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
              <input
                id="product-form-trending"
                type="checkbox"
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="font-semibold text-stone-700">🔥 Trending</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100 transition-colors">
              <input
                id="product-form-featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-orange-600 rounded"
              />
              <span className="font-semibold text-stone-700">⭐ Featured</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              id="product-form-save-btn"
              type="submit"
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{productToEdit ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
