import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/i18n';
import { RoomOption } from '../types';
import {
  X,
  Star,
  MapPin,
  Shield,
  Coffee,
  CheckCircle2,
  Users,
  Maximize2,
  Bed,
  Download,
  Flame,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Clock,
  Compass,
} from 'lucide-react';

export const HotelDetailModal: React.FC = () => {
  const {
    selectedHotel,
    setSelectedHotel,
    setBookingModalRoom,
    currency,
    notifications,
    toggleOfflineSave,
    offlineSavedIds,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rooms' | 'reviews' | 'amenities' | 'location'>('rooms');
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<string>('all');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!selectedHotel) return null;

  const filteredReviews = selectedReviewFilter === 'all'
    ? selectedHotel.reviews
    : selectedHotel.reviews.filter((r) => r.travelerType === selectedReviewFilter);

  const isDownloadedForOffline = offlineSavedIds.includes(selectedHotel.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hotel-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in"
    >
      <div className="w-full max-w-5xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="capitalize text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full">
              {selectedHotel.type}
            </span>
            <div className="flex items-center gap-0.5 text-amber-400">
              {Array.from({ length: selectedHotel.starRating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
          </div>
          <button
            onClick={() => setSelectedHotel(null)}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Visual Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 aspect-16/10 rounded-2xl overflow-hidden relative group">
              <img
                src={selectedHotel.gallery[activeImageIdx] || selectedHotel.featuredImage}
                alt={selectedHotel.name}
                className="w-full h-full object-cover transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full">
                Photo {activeImageIdx + 1} of {selectedHotel.gallery.length}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
              {selectedHotel.gallery.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`aspect-16/9 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                    activeImageIdx === i
                      ? 'border-amber-600 scale-[1.02]'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hotel Title & Key Attributes */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-xs mb-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{selectedHotel.address}</span>
              </div>
              <h1
                id="hotel-modal-title"
                className="text-2xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-100 leading-tight"
              >
                {selectedHotel.name}
              </h1>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-300 font-light max-w-2xl leading-relaxed">
                {selectedHotel.description}
              </p>
            </div>

            {/* Scorecard Box */}
            <div className="bg-stone-50 dark:bg-stone-800/80 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/80 text-left shrink-0 min-w-56">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-900 text-white font-serif font-bold text-lg flex items-center justify-center shadow-xs">
                  {selectedHotel.reviewScore.toFixed(1)}
                </div>
                <div>
                  <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                    Exceptional
                  </div>
                  <div className="text-xs text-stone-500">
                    {selectedHotel.reviewCount} verified guest reviews
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700/60 text-xs space-y-1 text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Cleanliness</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">9.9</span>
                </div>
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">9.8</span>
                </div>
                <div className="flex justify-between">
                  <span>Comfort & Spa</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">10.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Tabs inside modal */}
          <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
            {[
              { id: 'rooms', label: 'Suites & Availability' },
              { id: 'amenities', label: 'Amenities & Highlights' },
              { id: 'reviews', label: `Guest Reviews (${selectedHotel.reviews.length})` },
              { id: 'location', label: 'Neighborhood & Offline Map' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Available Suites & Real-Time Rooms */}
          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 dark:text-stone-300">
                  Select your preferred residence ({selectedHotel.rooms.length} categories available)
                </span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Real-time live inventory
                </span>
              </div>

              <div className="space-y-4">
                {selectedHotel.rooms.map((room) => (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 hover:border-amber-600/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                          {room.name}
                        </h3>
                        {room.availableRooms <= 2 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-bold animate-pulse">
                            Only {room.availableRooms} remaining!
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 font-light">
                        {room.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                          {room.sizeSqM} m² / {Math.round(room.sizeSqM * 10.764)} sq ft
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-stone-400" />
                          {room.bedType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-stone-400" />
                          Up to {room.maxGuests} guests
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {room.perks.map((perk, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {perk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Room Pricing & Booking Trigger */}
                    <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-stone-200 dark:border-stone-800 pt-4 md:pt-0 md:pl-6 shrink-0">
                      <div className="text-left md:text-right">
                        <div className="text-2xl font-serif font-black text-stone-900 dark:text-stone-100">
                          {formatPrice(room.pricePerNight, currency)}
                        </div>
                        {room.originalPrice && (
                          <div className="text-xs text-stone-400 line-through">
                            {formatPrice(room.originalPrice, currency)}
                          </div>
                        )}
                        <div className="text-[11px] text-stone-400">per night + taxes</div>
                      </div>

                      <button
                        onClick={() => {
                          setBookingModalRoom({ hotel: selectedHotel, room });
                        }}
                        className="mt-3 py-2.5 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/25 flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <span>Reserve Suite</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Amenities & Popular Highlights */}
          {activeTab === 'amenities' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 uppercase tracking-wider">
                  Popular Sanctuary Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedHotel.popularHighlights.map((hl, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 uppercase tracking-wider">
                  Full Property Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-700 dark:text-stone-300">
                  {selectedHotel.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Guest Reviews with Traveler Type Filter */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Filter by traveler category:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'couple', 'family', 'solo', 'business'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedReviewFilter(type)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        selectedReviewFilter === type
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    No reviews yet for this filter category.
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            className="w-10 h-10 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                              {rev.author}
                            </div>
                            <div className="text-[11px] text-stone-400">
                              {rev.country} • Stayed as {rev.travelerType} • {rev.date}
                            </div>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-amber-900 text-white font-bold text-xs">
                          {rev.rating.toFixed(1)}
                        </div>
                      </div>

                      <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                        "{rev.title}"
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Location, Attractions & Offline Map Pack */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              {/* Offline Map Download Banner */}
              <div className="p-5 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <Download className="w-4 h-4" />
                    <span>{selectedHotel.offlineMapGuide.title}</span>
                  </div>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400 mt-1">
                    Download complete offline GPS maps, secret neighborhood alleys, and transit guides ({selectedHotel.offlineMapGuide.downloadSize}).
                  </p>
                </div>
                <button
                  onClick={() => toggleOfflineSave(selectedHotel.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors shadow-xs"
                >
                  {isDownloadedForOffline ? 'Offline Pack Saved' : 'Download for Offline Travel'}
                </button>
              </div>

              {/* Nearby Attractions */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 uppercase tracking-wider">
                  Nearby Landmarks & Walking Distances
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedHotel.nearbyAttractions.map((att, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 text-xs"
                    >
                      <div className="font-bold text-stone-900 dark:text-stone-100">{att.name}</div>
                      <div className="text-stone-500 mt-0.5">{att.distance} • {att.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local Tips */}
              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300">
                <span className="font-bold">Concierge Local Insider Tip:</span>{' '}
                {selectedHotel.offlineMapGuide.localTips.join(' ')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
