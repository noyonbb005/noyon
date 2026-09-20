import React, { useState, useRef } from 'react';
import {
  Plus,
  Image as ImageIcon,
  DollarSign,
  Tag,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowLeft,
  Sparkles,
  Flame,
  Zap,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { Product, AdminNavPage } from '../../types';
import { formatBDT } from '../../utils/currency';
import { uploadProductImage } from '../../lib/firebase';

interface AddProductViewProps {
  categories: string[];
  onAddProduct: (product: Product) => void;
  onNavigate: (page: AdminNavPage) => void;
}

const PRESET_IMAGES = [
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
  { label: 'Perfume', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80' },
];

export const AddProductView: React.FC<AddProductViewProps> = ({
  categories,
  onAddProduct,
  onNavigate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Electronics');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('2999');
  const [oldPrice, setOldPrice] = useState('4999');
  const [discountPercent, setDiscountPercent] = useState(40);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [inStock, setInStock] = useState(true);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [isTrending, setIsTrending] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setErrorMsg(null);
      const downloadURL = await uploadProductImage(file);
      setImage(downloadURL);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setErrorMsg('Failed to upload image to Firebase Storage. You can also paste an image URL.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Auto-calculate discount when price or oldPrice changes
  const handlePriceChange = (newPriceVal: string) => {
    setPrice(newPriceVal);
    const p = parseFloat(newPriceVal) || 0;
    const op = parseFloat(oldPrice) || 0;
    if (op > p && op > 0) {
      setDiscountPercent(Math.round(((op - p) / op) * 100));
    } else {
      setDiscountPercent(0);
    }
  };

  const handleOldPriceChange = (newOldPriceVal: string) => {
    setOldPrice(newOldPriceVal);
    const op = parseFloat(newOldPriceVal) || 0;
    const p = parseFloat(price) || 0;
    if (op > p && op > 0) {
      setDiscountPercent(Math.round(((op - p) / op) * 100));
    } else {
      setDiscountPercent(0);
    }
  };

  const handleDiscountSlider = (val: number) => {
    setDiscountPercent(val);
    const op = parseFloat(oldPrice) || 0;
    if (op > 0) {
      const computedPrice = Math.round(op * (1 - val / 100));
      setPrice(computedPrice.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Product name is required');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setErrorMsg('Please enter a valid selling price');
      return;
    }

    const finalCategory = customCategory.trim() ? customCategory.trim() : category;
    const numOldPrice = parseFloat(oldPrice);

    const newProduct: Product = {
      id: 'prod-' + Date.now().toString().slice(-6),
      name: name.trim(),
      description: description.trim() || 'High quality marketplace item with warranty.',
      price: numPrice,
      oldPrice: !isNaN(numOldPrice) && numOldPrice > numPrice ? numOldPrice : undefined,
      discountPercent: discountPercent,
      category: finalCategory,
      rating: 5.0,
      reviewsCount: 1,
      soldCount: 'New',
      image: image.trim() || PRESET_IMAGES[0].url,
      inStock,
      isFlashDeal,
      isTrending,
    };

    onAddProduct(newProduct);
    onNavigate('products');
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('products')}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>

        <span className="text-xs text-stone-500 font-medium">
          Step 1 of 1: Product Specifications
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Product Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ergonomic Bluetooth Wireless Headphones Pro"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrorMsg(null);
                }}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>

            {/* Category & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none cursor-pointer"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">+ New Custom Category</option>
                </select>

                {category === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter custom category name"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="mt-2 w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs outline-none focus:border-orange-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Inventory Stock Status
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={inStock}
                      onChange={() => setInStock(true)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>In Stock (Ready to Ship)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="stockStatus"
                      checked={!inStock}
                      onChange={() => setInStock(false)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-orange-600" />
                  Pricing & Dynamic Discount
                </span>
                <span className="text-xs font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                  {discountPercent}% OFF
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Selling Price (৳) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-900 outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Original Price (৳) (Optional)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={oldPrice}
                    onChange={(e) => handleOldPriceChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-bold text-stone-900 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Discount Percentage Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 mb-1">
                  <span>Quick Discount Adjuster</span>
                  <span>{discountPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="5"
                  value={discountPercent}
                  onChange={(e) => handleDiscountSlider(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Product Description
              </label>
              <textarea
                rows={3}
                placeholder="Key features, specifications, package contents..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none"
              />
            </div>

            {/* Image selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Product Image
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer disabled:opacity-50"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Uploading to Firebase...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload to Firebase Storage</span>
                    </>
                  )}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://... or upload from device"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              {/* Curated Preset Buttons */}
              <div className="mt-2">
                <span className="text-[11px] text-stone-500 font-medium">Or pick a sample preset:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all cursor-pointer ${
                        image === preset.url
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Badges Toggle */}
            <div className="pt-2 border-t border-stone-100">
              <span className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Storefront Badges & Placement
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlashDeal}
                    onChange={(e) => setIsFlashDeal(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      Flash Deal Section
                    </span>
                    <span className="text-[10px] text-stone-500 block">Show in live flash countdown carousel</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                      Trending Badge
                    </span>
                    <span className="text-[10px] text-stone-500 block">Highlight in trending hot picks</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onNavigate('products')}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs shadow-orange-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Product</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Live Product Preview Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-orange-600" />
                Live Customer Card Preview
              </h3>
              <span className="text-[10px] text-stone-400">Updates in real-time</span>
            </div>

            {/* Customer Store Mockup Card */}
            <div className="max-w-[240px] mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="relative aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={image}
                  alt={name || 'Preview'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PRESET_IMAGES[0].url;
                  }}
                />
                {discountPercent > 0 && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-orange-600 text-white text-[10px] font-black shadow-xs">
                    -{discountPercent}%
                  </span>
                )}
                {isFlashDeal && (
                  <span className="absolute top-2 right-2 p-1 rounded-full bg-amber-500 text-white shadow-xs">
                    <Zap className="w-3 h-3 fill-white" />
                  </span>
                )}
              </div>

              <div className="p-3 space-y-1.5">
                <span className="text-[10px] font-semibold text-stone-400 uppercase">
                  {customCategory.trim() || category}
                </span>
                <p className="text-xs font-bold text-stone-900 line-clamp-2 leading-tight">
                  {name || 'Sample Product Title Goes Here'}
                </p>

                <div className="flex items-baseline gap-1.5 pt-1">
                  <span className="text-sm font-black text-orange-600">
                    {formatBDT(parseFloat(price || '0'))}
                  </span>
                  {oldPrice && parseFloat(oldPrice) > parseFloat(price || '0') && (
                    <span className="text-[10px] text-stone-400 line-through">
                      {formatBDT(parseFloat(oldPrice))}
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-1.5 rounded-lg bg-orange-600 text-white font-bold text-[11px] text-center"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-stone-50 rounded-xl text-center">
              <p className="text-[11px] text-stone-600 font-medium">
                This product will immediately appear across search queries, catalog grids, and the mobile home feed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
