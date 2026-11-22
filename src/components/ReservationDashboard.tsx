import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import { formatPrice } from '../utils/i18n';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  QrCode,
  Key,
  Download,
  Share2,
  Mail,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  FileText,
  ExternalLink,
  Printer,
  X,
  Compass,
  Sparkles,
} from 'lucide-react';

export const ReservationDashboard: React.FC = () => {
  const {
    bookings,
    cancelBooking,
    toggleOfflineSave,
    offlineSavedIds,
    currency,
    setActiveTab,
  } = useApp();

  const [selectedBookingForEmail, setSelectedBookingForEmail] = useState<Booking | null>(null);
  const [selectedBookingForItinerary, setSelectedBookingForItinerary] = useState<Booking | null>(null);
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

  // Generate .ics calendar download
  const handleDownloadICS = (b: Booking) => {
    const startDate = b.checkInDate.replace(/-/g, '');
    const endDate = b.checkOutDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LuxeStay Luxury Booking Platform//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:luxestay-${b.id}@luxestay.com`,
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:Stay at ${b.hotelName} (${b.roomName})`,
      `DESCRIPTION:Luxury Reservation Reference: ${b.bookingReference}\\nRoom PIN: ${b.pinCode}\\nGuest: ${b.guestName}\\nSpecial Requests: ${b.specialRequests || 'None'}`,
      `LOCATION:${b.hotelName}, ${b.hotelCity}, ${b.hotelCountry}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `LuxeStay-${b.bookingReference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (b: Booking) => {
    const start = b.checkInDate.replace(/-/g, '');
    const end = b.checkOutDate.replace(/-/g, '');
    const title = encodeURIComponent(`Stay at ${b.hotelName}`);
    const details = encodeURIComponent(
      `LuxeStay Booking Ref: ${b.bookingReference}\nRoom: ${b.roomName}\nRoom PIN: ${b.pinCode}\nTotal: $${b.totalPrice}`
    );
    const location = encodeURIComponent(`${b.hotelName}, ${b.hotelCity}, ${b.hotelCountry}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const copyBookingRef = (ref: string) => {
    navigator.clipboard?.writeText(ref);
    setCopiedRef(ref);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleResendEmail = () => {
    setEmailSentAlert(true);
    setTimeout(() => setEmailSentAlert(false), 3000);
  };

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Guest Concierge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 dark:text-stone-100">
            Reservation Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Access digital keycards, synchronized calendars, and offline travel documents.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-bold shadow-xs transition-colors"
        >
          Book Another Stay
        </button>
      </div>

      {/* Active & Upcoming Stays */}
      <div className="space-y-6">
        <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <span>Active & Upcoming Itineraries</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold">
            {confirmedBookings.length}
          </span>
        </h2>

        {confirmedBookings.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40">
            <Calendar className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
              No upcoming reservations
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              Explore our hand-picked sanctuaries and lock in instant room confirmation.
            </p>
            <button
              onClick={() => setActiveTab('explore')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
            >
              Explore Stays
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {confirmedBookings.map((b) => {
              const isSavedOffline = offlineSavedIds.includes(b.id) || b.offlineSaved;
              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-md overflow-hidden flex flex-col justify-between"
                >
                  {/* Card Header Media */}
                  <div className="relative aspect-21/9 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <img
                      src={b.hotelImage}
                      alt={b.hotelName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-white">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-[11px] font-bold shadow-xs">
                        Confirmed & Paid
                      </span>
                      <button
                        onClick={() => copyBookingRef(b.bookingReference)}
                        className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold hover:bg-black/80 transition-colors"
                      >
                        {copiedRef === b.bookingReference ? 'Copied!' : `#${b.bookingReference}`}
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="font-serif text-lg font-bold truncate">{b.hotelName}</h3>
                      <div className="text-xs text-stone-300 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{b.hotelCity}, {b.hotelCountry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-5">
                    {/* Stay Time & Room */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 text-xs">
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-bold">Check-in</div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                          {b.checkInDate}
                        </div>
                        <div className="text-[10px] text-stone-500">From 15:00</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-stone-400 uppercase font-bold">Check-out</div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                          {b.checkOutDate}
                        </div>
                        <div className="text-[10px] text-stone-500">Until 12:00</div>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-stone-400 uppercase font-bold">Duration</div>
                        <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                          {b.nights} {b.nights === 1 ? 'Night' : 'Nights'}
                        </div>
                        <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">
                          {b.guests.adults} Guests
                        </div>
                      </div>
                    </div>

                    {/* Room PIN & Contactless QR Access */}
                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
                          <Key className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400">
                            Digital Key PIN
                          </div>
                          <div className="font-mono text-base font-bold text-amber-900 dark:text-amber-200">
                            {b.pinCode}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-stone-500 dark:text-stone-400">
                          Fast Contactless Pass
                        </div>
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                          <QrCode className="w-4 h-4" />
                          <span>QR Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Integration & Action Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                      {/* Download ICS */}
                      <button
                        onClick={() => handleDownloadICS(b)}
                        title="Download .ics Calendar Event"
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>.ICS File</span>
                      </button>

                      {/* Google Calendar */}
                      <a
                        href={getGoogleCalendarUrl(b)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        <span>Google Cal</span>
                      </a>

                      {/* Itinerary */}
                      <button
                        onClick={() => setSelectedBookingForItinerary(b)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Itinerary</span>
                      </button>

                      {/* Email Confirmation */}
                      <button
                        onClick={() => setSelectedBookingForEmail(b)}
                        className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-purple-600" />
                        <span>Receipt</span>
                      </button>
                    </div>

                    {/* Offline Save & Cancellation Bar */}
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        onClick={() => toggleOfflineSave(b.id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                          isSavedOffline
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isSavedOffline ? 'Saved for Offline Access' : 'Save Offline'}</span>
                      </button>

                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        Cancel stay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past / Cancelled History */}
      {pastBookings.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-stone-200 dark:border-stone-800">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Past Voyages & Cancelled Stays
          </h2>
          <div className="space-y-2">
            {pastBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-stone-800 dark:text-stone-200">{b.hotelName}</div>
                  <div className="text-stone-500">
                    {b.checkInDate} - {b.checkOutDate} • Ref: {b.bookingReference}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="capitalize px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
                    {b.status}
                  </span>
                  <span className="font-bold text-stone-700 dark:text-stone-300">
                    {formatPrice(b.totalPrice, currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Full Personalized Travel Itinerary */}
      {selectedBookingForItinerary && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                  Personalized Travel Itinerary
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForItinerary(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                <div className="font-bold text-sm text-stone-900 dark:text-stone-100">
                  {selectedBookingForItinerary.hotelName}
                </div>
                <div className="text-stone-500">
                  {selectedBookingForItinerary.hotelCity}, {selectedBookingForItinerary.hotelCountry}
                </div>
                <div className="mt-2 text-stone-700 dark:text-stone-300">
                  Guest: <strong>{selectedBookingForItinerary.guestName}</strong> • Reference:{' '}
                  <strong className="font-mono">{selectedBookingForItinerary.bookingReference}</strong>
                </div>
              </div>

              {/* Day by Day Plan */}
              <div className="space-y-3">
                <div className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
                  Curated Day-by-Day Schedule
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Day 1: Arrival & Unwinding</span>
                  <p className="mt-1 text-stone-600 dark:text-stone-400">
                    VIP Chauffeur transfer to sanctuary lobby. Private check-in ceremony, welcome champagne, and signature holistic onsen treatment.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Day 2: Cultural Exploration</span>
                  <p className="mt-1 text-stone-600 dark:text-stone-400">
                    Private guided excursion with English-speaking local historian. Evening Michelin dining reserved under your room booking.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Day 3: Wellness & Leisure</span>
                  <p className="mt-1 text-stone-600 dark:text-stone-400">
                    Morning cliffside yoga, afternoon private yacht or catamaran charter, sunset cocktail pairing.
                  </p>
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                  24/7 Local Concierge & Emergency Access:
                </div>
                <div className="text-amber-800 dark:text-amber-300 space-y-0.5">
                  <div>Hotel Front Desk: +81 3 5555 0192 (PIN: {selectedBookingForItinerary.pinCode})</div>
                  <div>LuxeStay Global Butler: +1 (800) 589-3782</div>
                  <div>Local Medical Emergency: 119 / 112 (English Speaking)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Itinerary</span>
              </button>
              <button
                onClick={() => setSelectedBookingForItinerary(null)}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Email Confirmation Preview & Resend */}
      {selectedBookingForEmail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Email Receipt & Confirmation
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForEmail(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Canvas Preview */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 font-sans text-xs space-y-4">
              <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-3">
                <span className="font-serif font-black text-lg text-amber-700 dark:text-amber-400">
                  LuxeStay Bookings
                </span>
                <span className="font-mono text-[11px] text-stone-500">
                  Ref: {selectedBookingForEmail.bookingReference}
                </span>
              </div>

              <div>
                <p className="text-stone-700 dark:text-stone-300">
                  Dear {selectedBookingForEmail.guestName},
                </p>
                <p className="text-stone-600 dark:text-stone-400 mt-1">
                  Thank you for booking with LuxeStay. Your reservation at{' '}
                  <strong>{selectedBookingForEmail.hotelName}</strong> is fully verified and pre-registered.
                </p>
              </div>

              <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Dates:</span>
                  <span className="font-bold">
                    {selectedBookingForEmail.checkInDate} to {selectedBookingForEmail.checkOutDate} (
                    {selectedBookingForEmail.nights} nights)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Suite:</span>
                  <span className="font-bold">{selectedBookingForEmail.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Room Access PIN:</span>
                  <span className="font-mono font-bold text-amber-600">
                    {selectedBookingForEmail.pinCode}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-stone-500 font-bold">Total Paid:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    {formatPrice(selectedBookingForEmail.totalPrice, currency)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-stone-400">
                Payment verified via 256-bit encrypted gateway. Free cancellation up to 48 hours before check-in.
              </p>
            </div>

            {/* Email Actions */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-500">
                Recipient: <strong>{selectedBookingForEmail.guestEmail}</strong>
              </span>
              <button
                onClick={handleResendEmail}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Resend Email Confirmation</span>
              </button>
            </div>

            {emailSentAlert && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-in zoom-in-95">
                Confirmation email successfully sent to {selectedBookingForEmail.guestEmail}!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
