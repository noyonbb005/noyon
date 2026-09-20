import React, { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Image as ImageIcon,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowLeft,
  Flame,
  Zap,
  Save,
  Search,
  UploadCloud,
  Loader2,
} from 'lucide-react';
import { Product, AdminNavPage } from '../../types';
import { formatBDT } from '../../utils/currency';
import { uploadProductImage } from '../../lib/firebase';

interface EditProductViewProps {
  products: Product[];
  selectedProduct: Product | null;
  onEditProduct: (product: Product) => void;
  onNavigate: (page: AdminNavPage) => void;
}

export const EditProductView: React.FC<EditProductViewProps> = ({
  products,
  selectedProduct: initialSelectedProduct,
  onEditProduct,
  onNavigate,
}) => {
  const [currentId, setCurrentId] = useState<string>(
    initialSelectedProduct ? initialSelectedProduct.id : products[0]?.id || ''
  );

  const activeProduct = products.find((p) => p.id === currentId) || products[0];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [image, setImage] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isFlashDeal, setIsFlashDeal] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const downloadURL = await uploadProductImage(file);
      setImage(downloadURL);
    } catch (err: any) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Sync state whenever activeProduct changes
  useEffect(() => {
    if (activeProduct) {
      setName(activeProduct.name);
      setDescription(activeProduct.description);
      setCategory(activeProduct.category);
      setPrice(activeProduct.price.toString());
      setOldPrice(activeProduct.oldPrice ? activeProduct.oldPrice.toString() : '');
      setDiscountPercent(activeProduct.discountPercent || 0);
      setImage(activeProduct.image);
      setInStock(activeProduct.inStock);
      setIsFlashDeal(!!activeProduct.isFlashDeal);
      setIsTrending(!!activeProduct.isTrending);
      setSuccessMsg(null);
    }
  }, [activeProduct]);

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
    if (!activeProduct) return;

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) return;

    const numOldPrice = parseFloat(oldPrice);

    const updated: Product = {
      ...activeProduct,
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: numPrice,
      oldPrice: !isNaN(numOldPrice) && numOldPrice > numPrice ? numOldPrice : undefined,
      discountPercent: discountPercent,
      image: image.trim() || activeProduct.image,
      inStock,
      isFlashDeal,
      isTrending,
    };

    onEditProduct(updated);
    setSuccessMsg(`Successfully updated "${updated.name}"!`);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
        <p className="text-sm font-bold text-stone-700">No products available in the store</p>
        <button
          onClick={() => onNavigate('add-product')}
          className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
        >
          Add First Product
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar with Selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('products')}
            className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>
          <span className="text-xs text-stone-400">|</span>
          <span className="text-xs font-bold text-stone-700">Select Item to Edit:</span>
        </div>

        {/* Product Picker Dropdown */}
        <div className="relative min-w-[280px]">
          <select
            value={currentId}
            onChange={(e) => setCurrentId(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatBDT(p.price)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Edit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Edit Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>

            {/* Category & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Stock Status
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="editStock"
                      checked={inStock}
                      onChange={() => setInStock(true)}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="editStock"
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
                  Price & Discount Adjustment
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
                    Original Price (৳)
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

              {/* Slider */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 mb-1">
                  <span>Discount Percentage</span>
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
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none"
              />
            </div>

            {/* Image URL */}
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

              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://... or upload from device"
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
              />
            </div>

            {/* Placement Badges */}
            <div className="pt-2 border-t border-stone-100">
              <span className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Badges & Placement
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFlashDeal}
                    onChange={(e) => setIsFlashDeal(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    Flash Deal Section
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-stone-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <div className="text-xs font-bold text-stone-800 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-500" />
                    Trending Badge
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
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs shadow-orange-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Real-time Updated Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-orange-600" />
                Live Preview
              </h3>
              <span className="text-[10px] text-stone-400">ID: {currentId}</span>
            </div>

            {/* Preview Card */}
            <div className="max-w-[240px] mx-auto bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="relative aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
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
                  {category}
                </span>
                <p className="text-xs font-bold text-stone-900 line-clamp-2 leading-tight">
                  {name}
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
          </div>
        </div>
      </div>
    </div>
  );
};
