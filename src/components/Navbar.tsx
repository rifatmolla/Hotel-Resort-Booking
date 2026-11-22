import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Tag,
  BookmarkCheck,
  Crown,
  Wifi,
  WifiOff,
  Bell,
  Sun,
  Moon,
  Mic,
  Eye,
  Globe,
  DollarSign,
  BarChart3,
  MessageSquare,
  Sparkles,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';
import { SupportedCurrency, SupportedLanguage } from '../types';

interface NavbarProps {
  onOpenAccessibility?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAccessibility }) => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    loyaltyProfile,
    isOnline,
    toggleOnlineStatus,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    currency,
    setCurrency,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    setIsVoiceActive,
    setIsAccessibilityModalOpen,
    setIsChatOpen,
    t,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
  ];

  const currencies: SupportedCurrency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

  return (
    <>
      {/* Top announcement / Offline notice banner */}
      {!isOnline && (
        <div className="bg-amber-700 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 animate-bounce" />
            <span className="font-semibold">Offline Mode Active:</span>
            <span>All downloaded itineraries, emergency contacts, and maps are accessible without internet.</span>
            <button
              onClick={toggleOnlineStatus}
              className="ml-auto underline text-xs font-bold hover:text-amber-200"
            >
              Simulate Reconnect
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('explore')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-600/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-amber-200" />
                </div>
                <div>
                  <span className="font-serif text-2xl font-black tracking-tight text-stone-950 dark:text-stone-50">
                    LuxeStay
                  </span>
                  <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-amber-400 -mt-1">
                    Hotels & Resorts
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'explore'
                    ? 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                Explore Stays
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 relative ${
                  activeTab === 'bookings'
                    ? 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                {t('myBookings')}
                {activeBookingsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeBookingsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('loyalty')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'loyalty'
                    ? 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-500" />
                Loyalty Club
              </button>

              <button
                onClick={() => setActiveTab('offline')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'offline'
                    ? 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <Wifi className="w-4 h-4 text-emerald-600" />
                Offline Hub
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'analytics'
                    ? 'bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </nav>

            {/* Utility Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Online/Offline Simulator Switch */}
              <button
                onClick={toggleOnlineStatus}
                title="Toggle Online / Offline Network Simulation"
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isOnline
                    ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300'
                }`}
              >
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Cloud</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-600" />
                    <span>Offline Cache</span>
                  </>
                )}
              </button>

              {/* Voice Command Button */}
              <button
                onClick={() => setIsVoiceActive(true)}
                title="Voice Navigation & Commands"
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                aria-label="Activate voice navigation"
              >
                <Mic className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </button>

              {/* Accessibility Settings */}
              <button
                onClick={onOpenAccessibility || (() => setIsAccessibilityModalOpen(true))}
                title="Accessibility & Text Size (WCAG 2.1)"
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                aria-label="Open accessibility options"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                    setIsLangMenuOpen(false);
                    setIsNotifOpen(false);
                  }}
                  className="px-2 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5 text-stone-400" />
                  {currency}
                </button>
                {isCurrencyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 py-1 z-50 animate-in fade-in">
                    {currencies.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrency(c);
                          setIsCurrencyMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs font-medium flex items-center justify-between hover:bg-amber-50 dark:hover:bg-stone-800 ${
                          currency === c
                            ? 'text-amber-700 dark:text-amber-400 font-bold bg-amber-50/50 dark:bg-stone-800/60'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span>{c}</span>
                        {currency === c && <CheckCircle className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsLangMenuOpen(!isLangMenuOpen);
                    setIsCurrencyMenuOpen(false);
                    setIsNotifOpen(false);
                  }}
                  className="px-2 py-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1 transition-colors"
                  aria-label="Select language"
                >
                  <Globe className="w-3.5 h-3.5 text-stone-400" />
                  <span className="uppercase">{language}</span>
                </button>
                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 py-1 z-50 animate-in fade-in">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-amber-50 dark:hover:bg-stone-800 ${
                          language === lang.code
                            ? 'text-amber-700 dark:text-amber-400 font-bold bg-amber-50/50 dark:bg-stone-800/60'
                            : 'text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </span>
                        {language === lang.code && <CheckCircle className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dark / Light Toggle */}
              <button
                onClick={toggleDarkMode}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
                ) : (
                  <Moon className="w-4 h-4 hover:-rotate-12 transition-transform" />
                )}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifOpen(!isNotifOpen);
                    setIsLangMenuOpen(false);
                    setIsCurrencyMenuOpen(false);
                  }}
                  className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 relative transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-600 ring-2 ring-white dark:ring-stone-900" />
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          Travel & Price Alerts
                        </span>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-72 overflow-y-auto mt-2">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center text-xs text-stone-400">
                          No alerts right now. All caught up!
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`py-3 px-1 text-left cursor-pointer transition-colors ${
                              !n.read ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                                {n.title}
                              </span>
                              <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                            </div>
                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 24/7 Concierge Chat Button */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-xs transition-transform active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                <span>Concierge</span>
              </button>

              {/* Loyalty Tier Pill */}
              <button
                onClick={() => setActiveTab('loyalty')}
                className="hidden md:flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">
                  P
                </div>
                <span>{loyaltyProfile.tier}</span>
                <span className="text-[10px] font-bold bg-amber-600/20 px-1.5 py-0.5 rounded-full text-amber-900 dark:text-amber-100">
                  {loyaltyProfile.points.toLocaleString()} pts
                </span>
              </button>

              {/* Mobile menu hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
                aria-label="Open mobile navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2">
            <button
              onClick={() => {
                setActiveTab('explore');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-left"
            >
              <Compass className="w-4 h-4 text-amber-600" />
              Explore Stays
            </button>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-left"
            >
              <span className="flex items-center gap-3">
                <BookmarkCheck className="w-4 h-4 text-amber-600" />
                My Reservations
              </span>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-xs font-bold">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('loyalty');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-left"
            >
              <Crown className="w-4 h-4 text-amber-500" />
              Loyalty Rewards Club
            </button>
            <button
              onClick={() => {
                setActiveTab('offline');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-left"
            >
              <Wifi className="w-4 h-4 text-emerald-600" />
              Offline Hub & Maps
            </button>
            <button
              onClick={() => {
                setActiveTab('analytics');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-left"
            >
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Analytics Dashboard
            </button>
            <button
              onClick={() => {
                setIsChatOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 text-left"
            >
              <MessageSquare className="w-4 h-4 text-amber-600" />
              24/7 Concierge Chat
            </button>
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Bar for quick last-minute bookings */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeTab === 'explore'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors relative ${
            activeTab === 'bookings'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <BookmarkCheck className="w-5 h-5" />
          <span>Bookings</span>
          {activeBookingsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">
              {activeBookingsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeTab === 'loyalty'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Crown className="w-5 h-5" />
          <span>Loyalty</span>
        </button>

        <button
          onClick={() => setActiveTab('offline')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-medium transition-colors ${
            activeTab === 'offline'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Wifi className="w-5 h-5" />
          <span>Offline</span>
        </button>

        <button
          onClick={() => setIsChatOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Concierge</span>
        </button>
      </div>
    </>
  );
};
