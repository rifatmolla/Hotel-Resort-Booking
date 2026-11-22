import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Hotel,
  RoomOption,
  Booking,
  LoyaltyProfile,
  PriceAlert,
  ChatMessage,
  NotificationItem,
  SupportedCurrency,
  SupportedLanguage,
  PropertyType,
} from '../types';
import { MOCK_HOTELS } from '../data/mockHotels';
import { TRANSLATIONS } from '../utils/i18n';

interface SearchState {
  destination: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
}

interface AppContextType {
  hotels: Hotel[];
  filteredHotels: Hotel[];
  search: SearchState;
  setSearch: React.Dispatch<React.SetStateAction<SearchState>>;
  activeCategory: PropertyType | 'all' | 'last-minute';
  setActiveCategory: (cat: PropertyType | 'all' | 'last-minute') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'rating';
  setSortBy: (sort: 'recommended' | 'price-low' | 'price-high' | 'rating') => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (hotel: Hotel | null) => void;
  bookingModalRoom: { hotel: Hotel; room: RoomOption } | null;
  setBookingModalRoom: (item: { hotel: Hotel; room: RoomOption } | null) => void;
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'status' | 'pinCode' | 'qrCodeValue' | 'pointsEarned'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  loyaltyProfile: LoyaltyProfile;
  priceAlerts: PriceAlert[];
  addPriceAlert: (hotel: Hotel, targetPrice: number) => void;
  removePriceAlert: (id: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string, attachment?: { type: 'image' | 'itinerary' | 'badge'; url?: string; title?: string } | string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isOnline: boolean;
  toggleOnlineStatus: () => void;
  toggleSimulatedNetwork: () => void;
  offlineSavedIds: string[];
  toggleOfflineSave: (bookingId: string) => void;
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
  language: SupportedLanguage;
  setLanguage: (l: SupportedLanguage) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  textSize: 'normal' | 'medium' | 'large';
  setTextSize: (size: 'normal' | 'medium' | 'large') => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  activeTab: 'explore' | 'bookings' | 'loyalty' | 'offline' | 'analytics';
  setActiveTab: (tab: 'explore' | 'bookings' | 'loyalty' | 'offline' | 'analytics') => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isVoiceActive: boolean;
  setIsVoiceActive: (active: boolean) => void;
  isAccessibilityModalOpen: boolean;
  setIsAccessibilityModalOpen: (open: boolean) => void;
  isVoiceModalOpen: boolean;
  setIsVoiceModalOpen: (open: boolean) => void;
  executeVoiceCommand: (cmd: string) => string;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial seed booking for immediate dashboard demonstration
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-demo-1',
    bookingReference: 'LX-892401',
    hotelId: 'aman-tokyo',
    hotelName: 'Aman Tokyo Sanctuary',
    hotelCity: 'Tokyo',
    hotelCountry: 'Japan',
    hotelImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=85',
    roomId: 'aman-deluxe-palace',
    roomName: 'Deluxe Suite - Imperial Palace Garden View',
    checkInDate: '2026-10-14',
    checkOutDate: '2026-10-18',
    nights: 4,
    guests: { adults: 2, children: 0, rooms: 1 },
    totalPrice: 3560,
    currency: 'USD',
    pointsEarned: 3560,
    pointsRedeemed: 0,
    discountApplied: 200,
    status: 'confirmed',
    createdAt: '2026-09-12T14:32:00Z',
    guestName: 'Alex Thorne',
    guestEmail: 'alex.thorne@luxurytravel.com',
    guestPhone: '+1 (555) 234-8976',
    specialRequests: 'High floor preferred, extra feather pillows and traditional green tea upon arrival.',
    pinCode: '7842',
    qrCodeValue: 'LUXESTAY-AMAN-TK-892401',
    isBiometricAuthenticated: true,
    paymentMethod: 'biometric_vault',
    last4CardDigits: '4092',
    calendarExported: true,
    offlineSaved: true,
  },
];

const INITIAL_LOYALTY: LoyaltyProfile = {
  tier: 'Platinum',
  points: 24850,
  nightsThisYear: 18,
  memberId: 'LX-PLAT-9021',
  memberSince: '2023',
  annualNightsForNextTier: 25,
  multiplier: 1.5,
  perks: [
    'Complimentary room upgrade upon availability',
    'Guaranteed 4:00 PM late check-out',
    'Executive lounge access & sommelier welcome',
    'Free high-speed fiber internet and spa credit ($100)',
    '1.5x points multiplier on all stays',
  ],
  history: [
    { id: 'h-1', date: '2026-09-12', description: 'Stay at Aman Tokyo Sanctuary', points: 3560, type: 'earned' },
    { id: 'h-2', date: '2026-07-20', description: 'Points redeemed for private helicopter shuttle', points: 5000, type: 'redeemed' },
    { id: 'h-3', date: '2026-06-15', description: 'Stay at Belmond Hotel Caruso Palace', points: 2340, type: 'earned' },
    { id: 'h-4', date: '2026-04-02', description: 'Gold to Platinum Tier Upgrade Bonus', points: 4000, type: 'earned' },
  ],
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'price_drop',
    title: 'Price Drop Alert: Amalfi Coast',
    message: 'Belmond Hotel Caruso dropped by 21% for next week bookings!',
    timestamp: '10 mins ago',
    read: false,
    hotelId: 'belmond-caruso-amalfi',
  },
  {
    id: 'notif-2',
    type: 'booking_update',
    title: 'Online Check-in Ready',
    message: 'Your upcoming reservation in Tokyo is confirmed. Room PIN: 7842.',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: 'notif-3',
    type: 'loyalty',
    title: 'Platinum Tier Benefits Active',
    message: 'You have earned 1.5x points multiplier on all bookings this season.',
    timestamp: '1 day ago',
    read: true,
  },
];

const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'concierge',
    content: 'Welcome to LuxeStay Private Concierge. I am Marcus, your personal lifestyle host. How may I assist your upcoming voyage today?',
    timestamp: '10:00 AM',
    synced: true,
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
  const [search, setSearch] = useState<SearchState>({
    destination: '',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const [activeCategory, setActiveCategory] = useState<PropertyType | 'all' | 'last-minute'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 4000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [bookingModalRoom, setBookingModalRoom] = useState<{ hotel: Hotel; room: RoomOption } | null>(null);

  // Bookings state with LocalStorage persistence
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('luxestay_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Loyalty state
  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile>(() => {
    try {
      const saved = localStorage.getItem('luxestay_loyalty');
      return saved ? JSON.parse(saved) : INITIAL_LOYALTY;
    } catch {
      return INITIAL_LOYALTY;
    }
  });

  // Price Alerts
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'pa-1',
      hotelId: 'four-seasons-bora-bora',
      hotelName: 'Four Seasons Resort Bora Bora',
      city: 'Bora Bora',
      originalPrice: 1650,
      targetPrice: 1400,
      currentPrice: 1420,
      active: true,
      createdAt: '2026-09-10',
      notified: false,
    },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Concierge chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('luxestay_chat');
      return saved ? JSON.parse(saved) : INITIAL_CHAT;
    } catch {
      return INITIAL_CHAT;
    }
  });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Offline features
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineSavedIds, setOfflineSavedIds] = useState<string[]>(['bkg-demo-1']);

  // Settings
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [textSize, setTextSize] = useState<'normal' | 'medium' | 'large'>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'loyalty' | 'offline' | 'analytics'>('explore');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState<boolean>(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);

  // Memoized filtered hotels calculation
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // Destination search filter
        if (search.destination.trim()) {
          const q = search.destination.toLowerCase().trim();
          const matches =
            hotel.name.toLowerCase().includes(q) ||
            hotel.city.toLowerCase().includes(q) ||
            hotel.country.toLowerCase().includes(q) ||
            hotel.address.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Category filter
        if (activeCategory === 'last-minute') {
          if (!hotel.isLastMinuteDeal) return false;
        } else if (activeCategory !== 'all') {
          if (hotel.type !== activeCategory) return false;
        }

        // Price range filter
        if (hotel.startingPrice < priceRange[0] || hotel.startingPrice > priceRange[1]) {
          return false;
        }

        // Min rating filter
        if (minRating > 0 && hotel.reviewScore < minRating) {
          return false;
        }

        // Selected amenities filter
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            hotel.amenities.some((ha) => ha.toLowerCase().includes(amenity.toLowerCase()))
          );
          if (!hasAll) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'rating') return b.reviewScore - a.reviewScore;
        return 0; // recommended default
      });
  }, [hotels, search.destination, activeCategory, priceRange, minRating, selectedAmenities, sortBy]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('luxestay_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('luxestay_loyalty', JSON.stringify(loyaltyProfile));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [loyaltyProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('luxestay_chat', JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [chatMessages]);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle native online/offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live simulation: periodic room availability micro-fluctuation to showcase real-time inventory
  useEffect(() => {
    const interval = setInterval(() => {
      setHotels((prev) =>
        prev.map((h) => {
          if (Math.random() > 0.7) {
            const updatedRooms = h.rooms.map((r) => {
              const delta = Math.random() > 0.5 ? -1 : 1;
              const nextAvail = Math.max(1, Math.min(8, r.availableRooms + delta));
              return { ...r, availableRooms: nextAvail };
            });
            return { ...h, rooms: updatedRooms };
          }
          return h;
        })
      );
    }, 28000);
    return () => clearInterval(interval);
  }, []);

  // Helper translation function
  const t = (key: string, variables?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = langDict[key] || TRANSLATIONS.en[key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleOnlineStatus = () => {
    setIsOnline((prev) => {
      const next = !prev;
      if (next) {
        // Sync pending chat messages
        setChatMessages((messages) =>
          messages.map((m) => ({ ...m, synced: true }))
        );
        setNotifications((notifs) => [
          {
            id: `sync-${Date.now()}`,
            type: 'travel_alert',
            title: 'Connection Restored',
            message: 'All offline itineraries and messages synchronized with cloud vault.',
            timestamp: 'Just now',
            read: false,
          },
          ...notifs,
        ]);
      }
      return next;
    });
  };

  const toggleOfflineSave = (bookingId: string) => {
    setOfflineSavedIds((prev) => {
      const exists = prev.includes(bookingId);
      const updated = exists ? prev.filter((id) => id !== bookingId) : [...prev, bookingId];
      setBookings((bList) =>
        bList.map((b) => (b.id === bookingId ? { ...b, offlineSaved: !exists } : b))
      );
      return updated;
    });
  };

  const createBooking = (
    bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'status' | 'pinCode' | 'qrCodeValue' | 'pointsEarned'>
  ): Booking => {
    const randomRef = 'LX-' + Math.floor(100000 + Math.random() * 900000);
    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const earnedPoints = Math.round(bookingData.totalPrice * loyaltyProfile.multiplier);

    const newBooking: Booking = {
      ...bookingData,
      id: `bkg-${Date.now()}`,
      bookingReference: randomRef,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      pinCode: pin,
      qrCodeValue: `LUXESTAY-${bookingData.hotelId}-${randomRef}`,
      pointsEarned: earnedPoints,
      calendarExported: false,
      offlineSaved: true,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update loyalty points
    setLoyaltyProfile((prev) => {
      const updatedPoints = prev.points + earnedPoints - (bookingData.pointsRedeemed || 0);
      const newHistoryItem = {
        id: `h-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `Booking confirmed at ${bookingData.hotelName}`,
        points: earnedPoints,
        type: 'earned' as const,
      };
      return {
        ...prev,
        points: Math.max(0, updatedPoints),
        nightsThisYear: prev.nightsThisYear + bookingData.nights,
        history: [newHistoryItem, ...prev.history],
      };
    });

    // Add alert notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'booking_update',
        title: 'Booking Confirmed!',
        message: `${bookingData.hotelName} (${bookingData.nights} nights). Reference: ${randomRef}.`,
        timestamp: 'Just now',
        read: false,
        hotelId: bookingData.hotelId,
      },
      ...prev,
    ]);

    // Automatically decrement room availability
    setHotels((prev) =>
      prev.map((h) => {
        if (h.id === bookingData.hotelId) {
          const rooms = h.rooms.map((r) => {
            if (r.id === bookingData.roomId) {
              return { ...r, availableRooms: Math.max(1, r.availableRooms - 1) };
            }
            return r;
          });
          return { ...h, rooms };
        }
        return h;
      })
    );

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'booking_update',
        title: 'Reservation Cancelled',
        message: 'Free refund initiated according to the flexible luxury cancellation policy.',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const addPriceAlert = (hotel: Hotel, targetPrice: number) => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      city: hotel.city,
      originalPrice: hotel.startingPrice,
      targetPrice,
      currentPrice: hotel.startingPrice,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      notified: false,
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'price_drop',
        title: 'Price Tracking Activated',
        message: `We will notify you immediately if ${hotel.name} drops below $${targetPrice}.`,
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  };

  const removePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const sendChatMessage = (
    content: string,
    attachment?: { type: 'image' | 'itinerary' | 'badge'; url?: string; title?: string } | string
  ) => {
    const attachObj =
      typeof attachment === 'string'
        ? { type: 'image' as const, url: attachment }
        : attachment;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content,
      text: content,
      timestamp: timeStr,
      time: timeStr,
      attachment: attachObj,
      imageUrl: attachObj?.url,
      synced: isOnline,
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Automated smart concierge response simulation
    setTimeout(() => {
      let reply = 'Thank you for contacting LuxeStay Concierge. Our 24/7 dedicated butler service has recorded your inquiry and is handling the arrangements immediately.';
      const lower = content.toLowerCase();

      if (lower.includes('checkout') || lower.includes('late')) {
        reply = 'As a Platinum tier member, your 4:00 PM complimentary late check-out is pre-approved for your stay! We have updated the front desk ledger.';
      } else if (lower.includes('transfer') || lower.includes('airport') || lower.includes('car')) {
        reply = 'We can coordinate private Mercedes Maybach or helicopter transfers directly from the tarmac. Would you like our chauffeur team to meet you at the arrivals gate?';
      } else if (lower.includes('breakfast') || lower.includes('diet') || lower.includes('food')) {
        reply = 'All dietary preferences (organic, gluten-free, vegan, halal) are passed directly to our Michelin executive chef team before your arrival.';
      } else if (lower.includes('upgrade') || lower.includes('suite')) {
        reply = 'We actively track suite inventory. If a premier penthouse or beachfront villa unlocks 24 hours prior to check-in, we will automatically upgrade your reservation with zero added charge.';
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'concierge',
        content: reply,
        text: reply,
        timestamp: botTime,
        time: botTime,
        synced: true,
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  // Natural Language Voice Command Execution
  const executeVoiceCommand = (cmd: string): string => {
    const clean = cmd.trim().toLowerCase();
    if (!clean) return 'Please say a command.';

    if (clean.includes('dark mode') || clean.includes('night mode')) {
      toggleDarkMode();
      return 'Dark mode toggled.';
    }
    if (clean.includes('light mode') || clean.includes('day mode')) {
      if (isDarkMode) toggleDarkMode();
      return 'Light mode activated.';
    }
    if (clean.includes('booking') || clean.includes('reservation') || clean.includes('itinerary')) {
      setActiveTab('bookings');
      return 'Navigated to your reservations dashboard.';
    }
    if (clean.includes('loyalty') || clean.includes('point') || clean.includes('reward')) {
      setActiveTab('loyalty');
      return 'Navigated to loyalty rewards club.';
    }
    if (clean.includes('offline') || clean.includes('map') || clean.includes('download')) {
      setActiveTab('offline');
      return 'Navigated to offline hub and downloaded guides.';
    }
    if (clean.includes('analytics') || clean.includes('metric') || clean.includes('trend')) {
      setActiveTab('analytics');
      return 'Navigated to analytics metrics.';
    }
    if (clean.includes('chat') || clean.includes('concierge') || clean.includes('help') || clean.includes('support')) {
      setIsChatOpen(true);
      return 'Opened 24/7 concierge live chat.';
    }
    if (clean.includes('deal') || clean.includes('discount') || clean.includes('last minute')) {
      setActiveCategory('last-minute');
      setActiveTab('explore');
      return 'Displaying exclusive last-minute deals.';
    }
    if (clean.includes('resort')) {
      setActiveCategory('resort');
      setActiveTab('explore');
      return 'Filtering by world-class luxury resorts.';
    }
    if (clean.includes('villa')) {
      setActiveCategory('villa');
      setActiveTab('explore');
      return 'Filtering by private pool villas.';
    }
    if (clean.includes('tokyo') || clean.includes('paris') || clean.includes('bali') || clean.includes('dubai') || clean.includes('amalfi')) {
      const words = clean.split(' ');
      const city = words[words.length - 1];
      setSearch((prev) => ({ ...prev, destination: city.charAt(0).toUpperCase() + city.slice(1) }));
      setActiveTab('explore');
      return `Searching stays in ${city}.`;
    }

    return `Command recognized: "${cmd}". Navigating to explore.`;
  };

  return (
    <AppContext.Provider
      value={{
        hotels,
        filteredHotels,
        search,
        setSearch,
        activeCategory,
        setActiveCategory,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        selectedAmenities,
        toggleAmenity,
        sortBy,
        setSortBy,
        selectedHotel,
        setSelectedHotel,
        bookingModalRoom,
        setBookingModalRoom,
        bookings,
        createBooking,
        cancelBooking,
        loyaltyProfile,
        priceAlerts,
        addPriceAlert,
        removePriceAlert,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        chatMessages,
        sendChatMessage,
        isChatOpen,
        setIsChatOpen,
        isOnline,
        toggleOnlineStatus,
        toggleSimulatedNetwork: toggleOnlineStatus,
        offlineSavedIds,
        toggleOfflineSave,
        currency,
        setCurrency,
        language,
        setLanguage,
        isDarkMode,
        toggleDarkMode,
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
        activeTab,
        setActiveTab,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isVoiceActive,
        setIsVoiceActive,
        isAccessibilityModalOpen,
        setIsAccessibilityModalOpen,
        isVoiceModalOpen,
        setIsVoiceModalOpen,
        executeVoiceCommand,
        t,
      }}
    >
      <div
        className={`${
          textSize === 'large' ? 'text-lg' : textSize === 'medium' ? 'text-base' : 'text-sm'
        } ${highContrast ? 'contrast-125' : ''}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
