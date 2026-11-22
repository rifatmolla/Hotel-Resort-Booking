import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  ChevronDown,
  X,
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    t,
  } = useApp();

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  const popularDestinations = [
    { name: 'Tokyo', country: 'Japan' },
    { name: 'Bora Bora', country: 'French Polynesia' },
    { name: 'Amalfi Coast', country: 'Italy' },
    { name: 'Paris', country: 'France' },
    { name: 'St. Moritz', country: 'Switzerland' },
    { name: 'Bali', country: 'Indonesia' },
    { name: 'Dubai', country: 'UAE' },
  ];

  // Calculate nights
  const checkInDate = new Date(search.checkIn);
  const checkOutDate = new Date(search.checkOut);
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Editorial Headline */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Curated Stays & Private Sanctuaries</span>
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-stone-900 dark:text-stone-50 leading-tight">
          {t('searchTitle')}
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-400 font-light max-w-2xl mx-auto">
          {t('searchSubtitle')}
        </p>
      </div>

      {/* Booking.com Style Elevated Search Bar */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-3 sm:p-4 shadow-xl border border-stone-200/90 dark:border-stone-800 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Destination */}
          <div className="md:col-span-4 relative group">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 ml-1">
              Destination / Hotel
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 focus-within:border-amber-600 dark:focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
              <input
                type="text"
                value={search.destination}
                onChange={(e) => setSearch((prev) => ({ ...prev, destination: e.target.value }))}
                placeholder={t('destinationPlaceholder')}
                className="w-full bg-transparent text-sm font-semibold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden"
              />
              {search.destination && (
                <button
                  onClick={() => setSearch((prev) => ({ ...prev, destination: '' }))}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dates: Check-in & Check-out */}
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-1 ml-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Check-in / Check-out
              </label>
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  type="date"
                  value={search.checkIn}
                  onChange={(e) => setSearch((prev) => ({ ...prev, checkIn: e.target.value }))}
                  className="w-full bg-transparent text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  type="date"
                  value={search.checkOut}
                  onChange={(e) => setSearch((prev) => ({ ...prev, checkOut: e.target.value }))}
                  className="w-full bg-transparent text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Guests Popover */}
          <div className="md:col-span-2 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 ml-1">
              Travelers
            </label>
            <button
              onClick={() => setIsGuestsOpen(!isGuestsOpen)}
              className="w-full flex items-center justify-between px-3 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 text-left text-xs font-semibold text-stone-900 dark:text-stone-100 focus:outline-hidden"
            >
              <span className="flex items-center gap-2 truncate">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {search.adults} Adults, {search.rooms} Room
                </span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </button>

            {/* Popover Dropdown */}
            {isGuestsOpen && (
              <div className="absolute left-0 sm:right-0 mt-2 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 z-50 animate-in fade-in">
                {/* Adults */}
                <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Adults</div>
                    <div className="text-[10px] text-stone-500">Ages 18 or above</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() =>
                        setSearch((prev) => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))
                      }
                      className="w-7 h-7 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{search.adults}</span>
                    <button
                      onClick={() =>
                        setSearch((prev) => ({ ...prev, adults: Math.min(10, prev.adults + 1) }))
                      }
                      className="w-7 h-7 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Children</div>
                    <div className="text-[10px] text-stone-500">Ages 0 to 17</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() =>
                        setSearch((prev) => ({ ...prev, children: Math.max(0, prev.children - 1) }))
                      }
                      className="w-7 h-7 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{search.children}</span>
                    <button
                      onClick={() =>
                        setSearch((prev) => ({ ...prev, children: Math.min(6, prev.children + 1) }))
                      }
                      className="w-7 h-7 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rooms */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Rooms</div>
                    <div className="text-[10px] text-stone-500">Suites & pavilions</div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() =>
                        setSearch((prev) => ({ ...prev, rooms: Math.max(1, prev.rooms - 1) }))
                      }
                      className="w-7 h-7 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      -
                    </button>
                    <span className="w-4 text-center text-xs font-bold">{search.rooms}</span>
                    <button
                      onClick={() =>
                        setSearch((prev) => ({ ...prev, rooms: Math.min(5, prev.rooms + 1) }))
                      }
                      className="w-7 h-7 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setIsGuestsOpen(false)}
                  className="w-full mt-3 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-bold transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="md:col-span-2">
            <label className="hidden md:block text-[11px] font-bold uppercase tracking-wider text-transparent mb-1">
              Search
            </label>
            <button
              onClick={() => {
                // Focus results / ensure explore tab
                const el = document.getElementById('properties-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>{t('search')}</span>
            </button>
          </div>
        </div>

        {/* Quick Filter chips and Last Minute Deals Toggle */}
        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            <span className="text-stone-400 font-medium whitespace-nowrap mr-1">Trending:</span>
            {popularDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => setSearch((prev) => ({ ...prev, destination: dest.name }))}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  search.destination.toLowerCase() === dest.name.toLowerCase()
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {dest.name}
              </button>
            ))}
          </div>

          {/* Last-Minute Deals Quick Switch */}
          <button
            onClick={() =>
              setActiveCategory(activeCategory === 'last-minute' ? 'all' : 'last-minute')
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              activeCategory === 'last-minute'
                ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 ring-2 ring-red-500/20'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-red-400 hover:text-red-600'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${activeCategory === 'last-minute' ? 'text-red-500' : ''}`} />
            <span>Last-Minute Flash Deals (-25%)</span>
            {activeCategory === 'last-minute' && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            )}
          </button>
        </div>
      </div>

      {/* Trust Highlights */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="flex items-center justify-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Real-time availability lock with immediate suite confirmation</span>
        </div>
        <div className="flex items-center justify-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Biometric Passkey security & flexible 48h cancellation</span>
        </div>
        <div className="flex items-center justify-center gap-2.5 text-xs text-stone-600 dark:text-stone-400">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Earn 1.5x Loyalty points & instant travel itinerary download</span>
        </div>
      </div>
    </div>
  );
};
