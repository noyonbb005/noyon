import React, { useState, useEffect } from 'react';
import { Zap, Clock, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FlashDealSectionProps {
  products: Product[];
  onOrderNow: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAll?: () => void;
}

export const FlashDealSection: React.FC<FlashDealSectionProps> = ({
  products,
  onOrderNow,
  onQuickView,
  onViewAll,
}) => {
  // Live countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 48,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="px-4 py-3 bg-white border-b border-stone-100 mb-2">
      {/* Flash Sale Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-orange-600 font-black text-sm tracking-tight">
            <Zap className="w-4 h-4 fill-orange-500 text-orange-600 animate-pulse" />
            <span>FLASH SALE</span>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span className="px-1.5 py-0.5 bg-stone-900 text-white rounded text-[11px] font-bold">
              {formatNum(timeLeft.hours)}
            </span>
            <span className="text-stone-700 font-bold">:</span>
            <span className="px-1.5 py-0.5 bg-stone-900 text-white rounded text-[11px] font-bold">
              {formatNum(timeLeft.minutes)}
            </span>
            <span className="text-stone-700 font-bold">:</span>
            <span className="px-1.5 py-0.5 bg-orange-600 text-white rounded text-[11px] font-bold">
              {formatNum(timeLeft.seconds)}
            </span>
          </div>
        </div>

        {onViewAll && (
          <button
            id="flash-sale-view-all-btn"
            onClick={onViewAll}
            className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
          >
            <span>See More</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 2-Column Grid for Flash Deals on Mobile */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOrderNow={onOrderNow}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
};
