import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Store,
} from 'lucide-react';
import { Product, Order, Customer } from '../../types';
import { BannerSlider } from '../BannerSlider';
import { TopCategoryGrid } from '../TopCategoryGrid';
import { FlashDealSection } from '../FlashDealSection';
import { ProductCard } from '../ProductCard';
import { ProductModal } from '../ProductModal';
import { OrderNowModal } from '../OrderNowModal';
import { BANNER_SLIDES, TOP_CATEGORIES } from '../../data/marketplaceData';

interface StorefrontPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onPlaceOrder?: (product: Product, quantity: number, customerInfo: any) => void;
}

export const StorefrontPreviewModal: React.FC<StorefrontPreviewModalProps> = ({
  isOpen,
  onClose,
  products,
  onPlaceOrder,
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [previewKey, setPreviewKey] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const flashDealProducts = products.filter((p) => p.isFlashDeal);
  const trendingProducts = products.filter((p) => p.isTrending && !p.isFlashDeal);
  const normalProducts = products.filter((p) => !p.isFlashDeal && !p.isTrending);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in">
      {/* Modal Top Controls Bar */}
      <div className="w-full max-w-4xl bg-stone-900 text-white rounded-t-2xl px-5 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-bold">Live Customer Storefront Simulator</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
            Real-time Sync
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1.5 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded-lg text-stone-200 transition-colors cursor-pointer"
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Expand View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Phone Frame</span>
              </>
            )}
          </button>

          <button
            onClick={() => setPreviewKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-600 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div
        className={`w-full bg-stone-100 rounded-b-2xl overflow-hidden shadow-2xl flex items-center justify-center p-4 max-h-[82vh] overflow-y-auto ${
          isPhoneFrame ? 'max-w-md' : 'max-w-4xl'
        }`}
      >
        <div
          key={previewKey}
          className="w-full bg-white rounded-2xl shadow-md border border-stone-200 overflow-hidden flex flex-col min-h-[640px]"
        >
          {/* Mock Store Header */}
          <div className="bg-white border-b border-stone-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-600 text-white font-black text-sm flex items-center justify-center">
                O
              </div>
              <span className="font-extrabold text-stone-900 text-sm">OrangeShop</span>
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              Mobile Customer View
            </span>
          </div>

          {/* Store Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <BannerSlider banners={BANNER_SLIDES} onSelectCategory={() => {}} />

            <TopCategoryGrid
              categories={TOP_CATEGORIES}
              activeCategory="All"
              onSelectCategory={() => {}}
              onViewAllCategories={() => {}}
            />

            {flashDealProducts.length > 0 && (
              <FlashDealSection
                products={flashDealProducts}
                onOrderNow={(p) => setOrderProduct(p)}
                onQuickView={(p) => setQuickViewProduct(p)}
                onViewAll={() => {}}
              />
            )}

            {trendingProducts.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-black text-stone-900 uppercase">
                  🔥 Trending Products
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {trendingProducts.slice(0, 4).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOrderNow={(prod) => setOrderProduct(prod)}
                      onQuickView={(prod) => setQuickViewProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            )}

            {normalProducts.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-black text-stone-900 uppercase">
                  ✨ Recommended Catalog
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {normalProducts.slice(0, 4).map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onOrderNow={(prod) => setOrderProduct(prod)}
                      onQuickView={(prod) => setQuickViewProduct(prod)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={() => {}}
          onOrderNowDirectly={(p) => {
            setQuickViewProduct(null);
            setOrderProduct(p);
          }}
        />
      )}

      {/* Customer Instant Order Modal */}
      {orderProduct && (
        <OrderNowModal
          isOpen={true}
          product={orderProduct}
          onClose={() => setOrderProduct(null)}
          onConfirmOrder={(prod, qty, info) => {
            if (onPlaceOrder) {
              onPlaceOrder(prod, qty, info);
            }
            setOrderProduct(null);
          }}
        />
      )}
    </div>
  );
};
