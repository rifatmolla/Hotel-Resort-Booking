import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PropertyType } from '../types';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Building2,
  Sparkles,
  Palmtree,
  Home,
  Mountain,
  Zap,
  Check,
  RotateCcw,
  X,
} from 'lucide-react';
import { formatPrice } from '../utils/i18n';

export const FiltersBar: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    selectedAmenities,
    toggleAmenity,
    currency,
    hotels,
  } = useApp();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const categories: { id: PropertyType | 'all' | 'last-minute'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Stays', icon: Building2 },
    { id: 'resort', label: 'Resorts', icon: Palmtree },
    { id: 'villa', label: 'Villas', icon: Home },
    { id: 'boutique', label: 'Boutique', icon: Sparkles },
    { id: 'chalet', label: 'Chalets', icon: Mountain },
    { id: 'last-minute', label: 'Flash Deals', icon: Zap },
  ];

  const amenityOptions = [
    'Private Onsen Baths',
    'Michelin-Starred Dining',
    'Panoramic Indoor Pool',
    'Private Lagoon Plunge Pool',
    'Heated Cliffside Infinity Pool',
    'The Ritz Club & Spa',
    'Ski-In / Ski-Out Butler & Equipment Locker',
    'Cloud 22 Rooftop Sky Pool',
    'High-Speed Fiber WiFi',
    'Butler Service',
  ];

  // Count active non-default filters
  let activeFilterCount = 0;
  if (minRating > 0) activeFilterCount++;
  if (priceRange[0] > 500 || priceRange[1] < 4000) activeFilterCount++;
  if (selectedAmenities.length > 0) activeFilterCount += selectedAmenities.length;

  const resetFilters = () => {
    setPriceRange([500, 4000]);
    setMinRating(0);
  };

  return (
    <div id="properties-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? cat.id === 'last-minute'
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md'
                    : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${cat.id === 'last-minute' && !isActive ? 'text-red-500' : ''}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort and Filter controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 px-3 py-2 rounded-xl text-xs font-medium">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-stone-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-800 dark:text-stone-100 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="recommended" className="dark:bg-stone-900">Recommended</option>
              <option value="price-low" className="dark:bg-stone-900">Price: Low to High</option>
              <option value="price-high" className="dark:bg-stone-900">Price: High to Low</option>
              <option value="rating" className="dark:bg-stone-900">Guest Rating (Highest)</option>
            </select>
          </div>

          {/* Filter Drawer Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeFilterCount > 0
                ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Modal / Drawer */}
      {isFilterModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Filter Properties
                </h3>
              </div>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-4">
              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                  <span>Price Range per Night</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">
                    {formatPrice(priceRange[0], currency)} - {formatPrice(priceRange[1], currency)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-amber-600"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>{formatPrice(500, currency)}</span>
                  <span>{formatPrice(4000, currency)}+</span>
                </div>
              </div>

              {/* Guest Rating Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2.5">
                  Guest Review Score
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { score: 0, label: 'Any Rating' },
                    { score: 9.0, label: '9.0+ Superb' },
                    { score: 9.5, label: '9.5+ Exceptional' },
                  ].map((item) => (
                    <button
                      key={item.score}
                      onClick={() => setMinRating(item.score)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        minRating === item.score
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 ring-2 ring-amber-500/20'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2.5">
                  Luxury Amenities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {amenityOptions.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100 font-semibold'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="truncate mr-2">{amenity}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
