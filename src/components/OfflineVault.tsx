import React from 'react';
import { useApp } from '../context/AppContext';
import {
  WifiOff,
  Download,
  MapPin,
  Key,
  Compass,
  FileCheck,
  CheckCircle2,
  Trash2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

export const OfflineVault: React.FC = () => {
  const {
    hotels,
    bookings,
    offlineSavedIds,
    toggleOfflineSave,
    isOnline,
    toggleSimulatedNetwork,
    setActiveTab,
  } = useApp();

  // Saved hotels and bookings
  const savedHotels = hotels.filter((h) => offlineSavedIds.includes(h.id));
  const savedBookings = bookings.filter((b) => offlineSavedIds.includes(b.id) || b.offlineSaved);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <WifiOff className="w-4 h-4" />
            <span>Zero-Signal Offline Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-100">
            Offline Itineraries & Maps
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Fully functional on flights, remote private islands, and subterranean transit without cellular signal.
          </p>
        </div>

        {/* Network simulator toggle */}
        <button
          onClick={toggleSimulatedNetwork}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            !isOnline
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200'
          }`}
        >
          <WifiOff className="w-4 h-4" />
          <span>{isOnline ? 'Test Offline Mode' : 'Offline Mode Active (Tap to Restore)'}</span>
        </button>
      </div>

      {/* Offline Status Card */}
      <div className="p-5 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Local Storage Cache Verified</span>
          </div>
          <p className="text-xs text-emerald-800/80 dark:text-emerald-400 font-light">
            All stored digital key pins, map coordinates, and itineraries are cryptographically cached on your browser device.
          </p>
        </div>
        <div className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 shrink-0">
          {savedHotels.length + savedBookings.length} Packages Cached (24.2 MB)
        </div>
      </div>

      {/* Offline Bookings Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
          Saved Active Stay Passes & Key PINs
        </h2>

        {savedBookings.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 text-xs text-stone-500">
            No active reservations saved for offline use yet. Go to Reservations and click "Save Offline".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedBookings.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-600">
                      Offline Keycard Pass
                    </span>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {b.hotelName}
                    </h3>
                    <div className="text-xs text-stone-500">
                      {b.hotelCity}, {b.hotelCountry}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleOfflineSave(b.id)}
                    className="p-1 text-stone-400 hover:text-red-500"
                    title="Remove from offline cache"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-stone-600 dark:text-stone-400">Door PIN Code:</span>
                  </div>
                  <span className="font-mono text-base font-bold text-amber-900 dark:text-amber-200">
                    {b.pinCode}
                  </span>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-400 space-y-1">
                  <div>Dates: {b.checkInDate} to {b.checkOutDate}</div>
                  <div>Guest: {b.guestName} • Ref: {b.bookingReference}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Hotel Guides & Offline Map Packs */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
          Downloaded Regional Map Packs & Local Guides
        </h2>

        {savedHotels.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 text-xs text-stone-500">
            No hotel map packs downloaded yet. Open any hotel details page and click "Download for Offline Travel".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedHotels.map((h) => (
              <div
                key={h.id}
                className="p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-600">
                      Offline City & Transit Guide
                    </span>
                    <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                      {h.name}
                    </h3>
                    <div className="text-xs text-stone-500">{h.address}</div>
                  </div>
                  <button
                    onClick={() => toggleOfflineSave(h.id)}
                    className="p-1 text-stone-400 hover:text-red-500"
                    title="Remove pack"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="font-bold text-stone-800 dark:text-stone-200">
                    Offline Insider Concierge Tips:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600 dark:text-stone-400">
                    {h.offlineMapGuide.localTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                  <span className="text-stone-400">Pack size: {h.offlineMapGuide.downloadSize}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ready for flight
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
