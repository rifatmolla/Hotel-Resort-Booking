export type PropertyType = 'hotel' | 'resort' | 'villa' | 'boutique' | 'chalet';

export interface RoomOption {
  id: string;
  name: string;
  description: string;
  sizeSqM: number;
  bedType: string;
  maxGuests: number;
  pricePerNight: number;
  originalPrice?: number;
  availableRooms: number; // Real-time availability
  images: string[];
  perks: string[];
  cancellationPolicy: string;
  breakfastIncluded: boolean;
}

export interface Review {
  id: string;
  hotelId: string;
  author: string;
  avatar: string;
  country: string;
  travelerType: 'couple' | 'family' | 'solo' | 'business' | 'friends';
  rating: number; // e.g. 9.6
  date: string;
  title: string;
  comment: string;
  categories: {
    cleanliness: number;
    comfort: number;
    location: number;
    facilities: number;
    staff: number;
    valueForMoney: number;
  };
}

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  type: PropertyType;
  city: string;
  country: string;
  address: string;
  coordinates: { lat: number; lng: number };
  starRating: number; // 4, 5
  reviewScore: number; // 9.4
  reviewCount: number;
  featuredImage: string;
  gallery: string[];
  startingPrice: number;
  originalPrice?: number;
  isLastMinuteDeal?: boolean;
  dealDiscount?: number; // percentage
  amenities: string[];
  rooms: RoomOption[];
  reviews: Review[];
  checkInTime: string;
  checkOutTime: string;
  popularHighlights: string[];
  nearbyAttractions: { name: string; distance: string; type: string }[];
  offlineMapGuide: {
    title: string;
    downloadSize: string;
    highlights: string[];
    localTips: string[];
  };
}

export interface Booking {
  id: string;
  bookingReference: string;
  hotelId: string;
  hotelName: string;
  hotelCity: string;
  hotelCountry: string;
  hotelImage: string;
  roomId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  totalPrice: number;
  currency: string;
  pointsEarned: number;
  pointsRedeemed: number;
  discountApplied: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  pinCode: string;
  qrCodeValue: string;
  isBiometricAuthenticated: boolean;
  paymentMethod: 'credit_card' | 'apple_pay' | 'google_pay' | 'biometric_vault';
  last4CardDigits?: string;
  calendarExported?: boolean;
  offlineSaved?: boolean;
}

export type LoyaltyTier = 'Silver' | 'Gold' | 'Platinum' | 'VIP Black';

export interface LoyaltyProfile {
  tier: LoyaltyTier;
  points: number;
  nightsThisYear: number;
  memberId: string;
  memberSince: string;
  annualNightsForNextTier: number;
  multiplier: number;
  perks: string[];
  history: {
    id: string;
    date: string;
    description: string;
    points: number;
    type: 'earned' | 'redeemed';
  }[];
}

export interface PriceAlert {
  id: string;
  hotelId: string;
  hotelName: string;
  city: string;
  originalPrice: number;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
  createdAt: string;
  notified: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'concierge' | 'system';
  content: string;
  text?: string;
  timestamp: string;
  time?: string;
  attachment?: {
    type: 'image' | 'itinerary' | 'badge';
    url?: string;
    title?: string;
  };
  imageUrl?: string;
  synced: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'price_drop' | 'booking_update' | 'travel_alert' | 'loyalty';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  hotelId?: string;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ar';
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';
