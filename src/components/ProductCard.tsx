import React from 'react';
import { Star, ShoppingCart, Zap } from 'lucide-react';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  onOrderNow: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOrderNow,
  onQuickView,
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-white rounded-xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
    >
      {/* Product Image & Badges */}
      <div
        className="relative aspect-square w-full bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onQuickView && onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discountPercent > 0 && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-1.5 py-0.5 bg-orange-600 text-white text-[10px] font-black rounded tracking-tight shadow-xs flex items-center gap-0.5">
              <span>-{product.discountPercent}%</span>
            </span>
          </div>
        )}

        {/* Flash Deal Indicator */}
        {product.isFlashDeal && (
          <div className="absolute bottom-2 left-2 z-10">
            <span className="px-1.5 py-0.5 bg-stone-900/85 backdrop-blur-xs text-amber-400 text-[9px] font-bold rounded flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-amber-400" />
              <span>FLASH</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
            <span className="font-semibold text-orange-600 uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-800">{product.rating}</span>
              <span className="text-stone-400">({product.soldCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onQuickView && onQuickView(product)}
            className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-tight hover:text-orange-600 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing & Order Now Button */}
        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
          {/* Pricing Block */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-orange-600 tracking-tight">
              {formatBDT(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-stone-400 line-through">
                {formatBDT(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Orange "Order Now" Button */}
          <button
            id={`order-now-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onOrderNow(product);
            }}
            className="w-full py-2 px-3 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white text-xs font-bold rounded-lg shadow-sm shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
