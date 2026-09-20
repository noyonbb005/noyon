import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { BannerSlide } from '../types';

interface BannerSliderProps {
  banners: BannerSlide[];
  onSelectCategory?: (category: string) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  onSelectCategory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative px-4 pt-3 pb-1">
      {/* Banner Card Container */}
      <div
        id="marketplace-banner-slider"
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentBanner.bgColor} text-white shadow-sm transition-all duration-500 min-h-[150px] sm:min-h-[170px] flex items-center`}
      >
        {/* Decorative background overlay */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply pointer-events-none" />
        
        {/* Banner Content */}
        <div className="relative z-10 w-3/5 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>{currentBanner.tag}</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold leading-tight text-white line-clamp-1 drop-shadow-xs">
              {currentBanner.title}
            </h3>
            <p className="text-xs text-white/90 line-clamp-1 mt-0.5">
              {currentBanner.subtitle}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-amber-200 bg-black/20 px-2 py-0.5 rounded">
              {currentBanner.discountText}
            </span>
            <button
              id={`banner-action-btn-${currentBanner.id}`}
              onClick={() => {
                if (currentBanner.categoryLink && onSelectCategory) {
                  onSelectCategory(currentBanner.categoryLink);
                }
              }}
              className="px-2.5 py-1 bg-white text-orange-600 text-[11px] font-bold rounded-lg hover:bg-orange-50 active:scale-95 transition-all shadow-xs"
            >
              {currentBanner.buttonText}
            </button>
          </div>
        </div>

        {/* Banner Image */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden">
          <img
            src={currentBanner.image}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-orange-600/90 to-transparent pointer-events-none" />
        </div>

        {/* Controls */}
        <button
          id="banner-prev-btn"
          onClick={prevSlide}
          className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/40 transition-colors z-20"
          aria-label="Previous banner"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          id="banner-next-btn"
          onClick={nextSlide}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/40 transition-colors z-20"
          aria-label="Next banner"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? 'w-5 bg-orange-600'
                : 'w-1.5 bg-stone-300 hover:bg-stone-400'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
