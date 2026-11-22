import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/i18n';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  Fingerprint,
  Scan,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Calendar,
  Users,
  Download,
  Share2,
  ArrowRight,
  Info,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    bookingModalRoom,
    setBookingModalRoom,
    search,
    currency,
    loyaltyProfile,
    createBooking,
    setActiveTab,
    setSelectedHotel,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'biometric_vault' | 'credit_card' | 'apple_pay'>('biometric_vault');
  const [isProcessing, setIsProcessing] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<any>(null);

  // Guest details form state
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Thorne');
  const [email, setEmail] = useState('alex.thorne@luxurytravel.com');
  const [phone, setPhone] = useState('+1 (555) 234-8976');
  const [specialRequests, setSpecialRequests] = useState('High floor preferred with panoramic views.');

  // Credit card details
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4092');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('884');

  // Loyalty points slider
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);

  if (!bookingModalRoom) return null;

  const { hotel, room } = bookingModalRoom;

  // Nights calculation
  const checkInDate = new Date(search.checkIn);
  const checkOutDate = new Date(search.checkOut);
  const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

  const basePrice = room.pricePerNight * nights;
  const taxesAndFees = Math.round(basePrice * 0.1); // 10% luxury taxes & resort services
  const discountFromPoints = Math.round((pointsToRedeem / 1000) * 25);
  const finalTotal = Math.max(0, basePrice + taxesAndFees - discountFromPoints);

  const maxRedeemablePoints = Math.min(loyaltyProfile.points, Math.floor(basePrice / 25) * 1000);

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    if (paymentMethod === 'biometric_vault') {
      setBiometricScanning(true);
      setTimeout(() => {
        setBiometricScanning(false);
        finishCheckout();
      }, 1500);
    } else {
      setTimeout(() => {
        finishCheckout();
      }, 1200);
    }
  };

  const finishCheckout = () => {
    const booking = createBooking({
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelCity: hotel.city,
      hotelCountry: hotel.country,
      hotelImage: hotel.gallery[0] || hotel.featuredImage,
      roomId: room.id,
      roomName: room.name,
      checkInDate: search.checkIn,
      checkOutDate: search.checkOut,
      nights,
      guests: {
        adults: search.adults,
        children: search.children,
        rooms: search.rooms,
      },
      totalPrice: finalTotal,
      currency,
      pointsRedeemed: pointsToRedeem,
      discountApplied: discountFromPoints,
      guestName: `${firstName} ${lastName}`.trim() || 'Alex Thorne',
      guestEmail: email,
      guestPhone: phone,
      specialRequests,
      isBiometricAuthenticated: paymentMethod === 'biometric_vault',
      paymentMethod,
      last4CardDigits: '4092',
    });

    setIsProcessing(false);
    setCompletedBooking(booking);

    // Confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d97706', '#b45309', '#10b981', '#f59e0b'],
      });
    } catch {}
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            <h2 id="checkout-modal-title" className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
              {completedBooking ? 'Reservation Confirmed' : 'Instant Suite Reservation & Secure Pay'}
            </h2>
          </div>
          <button
            onClick={() => {
              setBookingModalRoom(null);
              setCompletedBooking(null);
            }}
            className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {completedBooking ? (
            /* Booking Confirmation View */
            <div className="text-center py-4 space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">
                  Payment & Booking Secured
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                  You are all set for {completedBooking.hotelName}!
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  A full confirmation email has been dispatched to {completedBooking.guestEmail}.
                </p>
              </div>

              {/* Digital Pass / Key Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-stone-900 text-white shadow-xl text-left border border-stone-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex justify-between items-start border-b border-stone-800 pb-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">
                      Digital Keycard & Reservation
                    </div>
                    <div className="font-serif font-bold text-base text-stone-100">
                      {completedBooking.hotelName}
                    </div>
                    <div className="text-xs text-stone-400">
                      {completedBooking.hotelCity}, {completedBooking.hotelCountry}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-stone-400">Reference</div>
                    <div className="text-xs font-mono font-bold text-amber-300">
                      {completedBooking.bookingReference}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-b border-stone-800 text-xs">
                  <div>
                    <div className="text-[10px] text-stone-400">Check-in</div>
                    <div className="font-bold">{completedBooking.checkInDate}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400">Check-out</div>
                    <div className="font-bold">{completedBooking.checkOutDate}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-400">Room PIN</div>
                    <div className="font-mono font-bold text-amber-400 text-sm">
                      {completedBooking.pinCode}
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs text-stone-400">
                  <span>Guest: {completedBooking.guestName}</span>
                  <span className="text-emerald-400 font-bold">
                    +{completedBooking.pointsEarned.toLocaleString()} Loyalty Pts
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setBookingModalRoom(null);
                    setSelectedHotel(null);
                    setActiveTab('bookings');
                  }}
                  className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
                >
                  <span>Go to My Reservations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <div className="space-y-6">
              {/* Selected Room Preview Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={hotel.gallery[0] || hotel.featuredImage}
                    alt={hotel.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100">
                      {hotel.name}
                    </h3>
                    <div className="text-xs text-stone-500">{room.name}</div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
                      <span>{search.checkIn} → {search.checkOut}</span>
                      <span>•</span>
                      <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                    {formatPrice(finalTotal, currency)}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">Free 48h cancellation</div>
                </div>
              </div>

              {/* Step 1: Guest Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  1. Guest Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Email Address (for instant confirmation & key PIN)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-hidden focus:border-amber-600"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Loyalty Rewards Points Redemption */}
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Redeem LuxeStay Club Points</span>
                  </div>
                  <span className="text-amber-800 dark:text-amber-300">
                    Balance: <strong>{loyaltyProfile.points.toLocaleString()} pts</strong>
                  </span>
                </div>

                {maxRedeemablePoints > 0 ? (
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max={maxRedeemablePoints}
                      step="1000"
                      value={pointsToRedeem}
                      onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                      className="w-full accent-amber-600"
                    />
                    <div className="flex justify-between text-[11px] text-amber-800 dark:text-amber-300">
                      <span>Redeeming: {pointsToRedeem.toLocaleString()} pts</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        -{formatPrice(discountFromPoints, currency)} Instant Discount
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500">
                    You need at least 1,000 loyalty points to redeem an instant cash discount.
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method & Biometrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    2. Payment & Verification
                  </h4>
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    256-Bit End-to-End Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('biometric_vault')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'biometric_vault'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Fingerprint className="w-5 h-5 text-amber-600" />
                    <span>Biometric FaceID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-amber-600" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Lock className="w-5 h-5 text-amber-600" />
                    <span>Digital Wallet</span>
                  </button>
                </div>

                {paymentMethod === 'biometric_vault' && (
                  <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 text-center space-y-2">
                    <Scan className="w-8 h-8 text-amber-600 mx-auto animate-pulse" />
                    <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                      Biometric Passkey Authentication
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Verify your reservation instantly using device FaceID, TouchID, or WebAuthn cryptographic key.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Price Breakdown */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>
                    {formatPrice(room.pricePerNight, currency)} x {nights} nights
                  </span>
                  <span>{formatPrice(basePrice, currency)}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Resort services & luxury hospitality taxes</span>
                  <span>{formatPrice(taxesAndFees, currency)}</span>
                </div>
                {discountFromPoints > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Loyalty Points Discount</span>
                    <span>-{formatPrice(discountFromPoints, currency)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100">
                  <span>Total Amount Due</span>
                  <span className="font-serif text-base text-amber-700 dark:text-amber-400">
                    {formatPrice(finalTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Confirm Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>{biometricScanning ? 'Verifying Biometric Scan...' : 'Encrypting & Confirming...'}</span>
                  </span>
                ) : (
                  <span>Confirm & Authorize {formatPrice(finalTotal, currency)}</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
