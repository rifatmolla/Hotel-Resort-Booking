import React, { useState } from 'react';
import { Hotel } from '../types';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/i18n';
import {
  Star,
  MapPin,
  Flame,
  Bell,
  CheckCircle2,
  ChevronRight,
  Shield,
  Coffee,
  Sparkles,
} from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { currency, setSelectedHotel, setBookingModalRoom, addPriceAlert, priceAlerts, t } = useApp();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Check lowest remaining room inventory for real-time stock alert
  const minAvailableRooms = Math.min(...hotel.rooms.map((r) => r.availableRooms));
  const isWatched = priceAlerts.some((a) => a.hotelId === hotel.id);

  // Rating descriptor
  const getDescriptor = (score: number) => {
    if (score >= 9.5) return 'Exceptional';
    if (score >= 9.0) return 'Superb';
    if (score >= 8.5) return 'Fabulous';
    return 'Very Good';
  };

  return (
    <article
      className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden border border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
      aria-labelledby={`hotel-title-${hotel.id}`}
    >
      {/* Top Image & Visual Media */}
      <div className="relative aspect-16/10 overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={hotel.gallery[activePhotoIdx] || hotel.featuredImage}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5 items-center">
            {hotel.isLastMinuteDeal && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
                <Flame className="w-3 h-3 text-amber-300 fill-amber-300" />
                <span>Last Minute -{hotel.dealDiscount}%</span>
              </span>
            )}
            <span className="capitalize px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20">
              {hotel.type}
            </span>
          </div>

          {/* Price Tracking Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addPriceAlert(hotel, Math.round(hotel.startingPrice * 0.9));
            }}
            title={isWatched ? 'Price alert active' : 'Track price drops for this hotel'}
            aria-label={`Track price drops for ${hotel.name}`}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isWatched
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-black/40 hover:bg-black/70 text-white'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${isWatched ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Image Indicators */}
        {hotel.gallery.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
            {hotel.gallery.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIdx(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  activePhotoIdx === i ? 'w-5 bg-white' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`View photo ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Real-time Room Stock Pill */}
        {minAvailableRooms <= 3 && (
          <div className="absolute bottom-3 right-3 z-10 bg-amber-950/90 backdrop-blur-md text-amber-200 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Only {minAvailableRooms} suites left!</span>
          </div>
        )}
      </div>

      {/* Hotel Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Star Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400 text-xs truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">{hotel.city}, {hotel.country}</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 shrink-0" aria-label={`${hotel.starRating} stars`}>
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Hotel Name */}
          <h2
            id={`hotel-title-${hotel.id}`}
            onClick={() => setSelectedHotel(hotel)}
            className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
          >
            {hotel.name}
          </h2>

          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 mt-1 font-light leading-relaxed">
            {hotel.tagline}
          </p>

          {/* Booking.com Style Review Score Bar */}
          <div className="flex items-center gap-2.5 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <div className="w-9 h-9 rounded-xl bg-amber-900 dark:bg-amber-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {hotel.reviewScore.toFixed(1)}
            </div>
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {getDescriptor(hotel.reviewScore)}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {hotel.reviewCount} verified guest reviews
              </div>
            </div>
          </div>

          {/* Top Perked Features */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              <Shield className="w-3 h-3" />
              Free 48h cancellation
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
              <Coffee className="w-3 h-3" />
              Breakfast included
            </span>
          </div>
        </div>

        {/* Pricing & CTA Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-stone-400 font-medium">Starting from</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold font-serif text-stone-900 dark:text-stone-100">
                {formatPrice(hotel.startingPrice, currency)}
              </span>
              {hotel.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPrice(hotel.originalPrice, currency)}
                </span>
              )}
              <span className="text-xs text-stone-500 font-normal">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedHotel(hotel)}
              className="py-2.5 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                const firstAvailableRoom = hotel.rooms[0];
                setBookingModalRoom({ hotel, room: firstAvailableRoom });
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all active:scale-95"
            >
              Book Suite
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
