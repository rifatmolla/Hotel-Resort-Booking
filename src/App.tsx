import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { FiltersBar } from './components/FiltersBar';
import { HotelCard } from './components/HotelCard';
import { HotelDetailModal } from './components/HotelDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReservationDashboard } from './components/ReservationDashboard';
import { LoyaltyProgram } from './components/LoyaltyProgram';
import { OfflineVault } from './components/OfflineVault';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ConciergeChat } from './components/ConciergeChat';
import { AccessibilityModal } from './components/AccessibilityModal';
import { VoiceCommandModal } from './components/VoiceCommandModal';
import {
  Sparkles,
  ShieldCheck,
  Compass,
  Heart,
  Globe,
  Lock,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    filteredHotels = [],
    selectedHotel,
    bookingModalRoom,
    isAccessibilityModalOpen,
    isVoiceModalOpen,
    setActiveCategory,
    setPriceRange,
    setMinRating,
    setSearch,
  } = useApp();

  const handleResetFilters = () => {
    setActiveCategory('all');
    setPriceRange([500, 4000]);
    setMinRating(0);
    setSearch((prev) => ({ ...prev, destination: '' }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Content Dynamic Views */}
      <main className="flex-1">
        {activeTab === 'explore' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search Header Banner */}
            <HeroSearch />

            {/* Filter and Sorting Controls */}
            <FiltersBar />

            {/* Hotel Properties Grid */}
            <section
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
              aria-label="Sanctuary listings"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                    Hand-Selected Luxury Properties
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Showing {filteredHotels.length} available sanctuaries with guaranteed instant confirmation.
                  </p>
                </div>
              </div>

              {filteredHotels.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center mx-auto">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                    No properties match your current filter
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Try relaxing your price slider, clearing specific luxury amenities, or searching for another destination like Tokyo or Paris.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'bookings' && <ReservationDashboard />}
        {activeTab === 'loyalty' && <LoyaltyProgram />}
        {activeTab === 'offline' && <OfflineVault />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      {/* Luxury Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white font-serif font-bold">
                L
              </div>
              <span className="font-serif font-bold text-base tracking-tight text-stone-900 dark:text-stone-100">
                LuxeStay
              </span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed">
              Curated global resorts, private villas, and alpine chalets with biometric reservation security, real-time availability, and offline travel access.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">
              Guaranteed Protections
            </h4>
            <ul className="space-y-2 text-stone-500 dark:text-stone-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit Encrypted Payments</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>48h Flexible Free Cancellation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Real-Time Suite Inventory Lock</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>WCAG 2.1 AA Accessibility Compliant</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">
              Exclusive Destinations
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-stone-500 dark:text-stone-400">
              <span>Tokyo, Japan</span>
              <span>Bora Bora</span>
              <span>Amalfi, Italy</span>
              <span>Swiss Alps</span>
              <span>Paris, France</span>
              <span>Dubai, UAE</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3">
              24/7 VIP Global Support
            </h4>
            <p className="text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
              Our multilingual private butler concierge is available around the clock via in-app chat, voice, and offline hotline.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Concierge Active</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} LuxeStay International Hospitality. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Whitepaper</span>
            <span>Offline Sync Protocol</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedHotel && <HotelDetailModal />}
      {bookingModalRoom && <CheckoutModal />}
      {isAccessibilityModalOpen && <AccessibilityModal />}
      {isVoiceModalOpen && <VoiceCommandModal />}

      {/* 24/7 Floating VIP Concierge Chat */}
      <ConciergeChat />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
