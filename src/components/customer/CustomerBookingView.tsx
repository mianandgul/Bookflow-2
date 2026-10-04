import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Business, Service, Booking } from '../../types';
import { StorageService } from '../../services/storage';

interface CustomerBookingViewProps {
  businessSlug: string;
  onNavigate: (view: 'landing' | 'dashboard' | 'customer_booking', slug?: string) => void;
}

export const CustomerBookingView: React.FC<CustomerBookingViewProps> = ({
  businessSlug,
  onNavigate,
}) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Date selection state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Customer form inputs
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerMessage, setCustomerMessage] = useState<string>('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Month navigation for date picker
  const [calendarMonthOffset, setCalendarMonthOffset] = useState<number>(0);

  // Load business & services
  useEffect(() => {
    const biz = StorageService.getBusinessBySlug(businessSlug) || StorageService.getBusinesses()[0];
    if (biz) {
      setBusiness(biz);
      const allServices = StorageService.getServices(biz.id).filter((s) => s.isActive);
      setServices(allServices);
      if (allServices.length > 0) {
        if (!selectedService || selectedService.businessId !== biz.id) {
          setSelectedService(allServices[0]);
        }
      } else {
        setSelectedService(null);
      }
      setSelectedTimeSlot('');
      setBookingConfirmed(null);
      setErrorMessage(null);

      // Update document title for SEO
      document.title = `${biz.name} | Book Online - BookFlow`;
    }
  }, [businessSlug]);

  // Default to today if not set
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }
  }, []);

  // Compute available slots whenever business, date, or selected service changes
  const availableSlots = useMemo(() => {
    if (!business || !selectedDate) return [];
    return StorageService.getAvailableSlots(business.id, selectedDate, selectedService?.id);
  }, [business, selectedDate, selectedService, bookingConfirmed]);

  // Calendar dates generation
  const calendarDays = useMemo(() => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + calendarMonthOffset);

    const year = date.getFullYear();
    const month = date.getMonth();
    const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isPast: boolean; isToday: boolean }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= totalDays; d++) {
      const currentDate = new Date(year, month, d);
      currentDate.setHours(0, 0, 0, 0);
      const yyyy = year;
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      days.push({
        dateStr,
        dayNum: d,
        isPast: currentDate < today,
        isToday: currentDate.getTime() === today.getTime(),
      });
    }

    return {
      monthName,
      firstDayIndex,
      days,
    };
  }, [calendarMonthOffset]);

  if (!business) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-neutral-900">Business Not Found</h2>
          <p className="text-xs text-neutral-500 mt-2 mb-6">
            We could not find a booking page matching "{businessSlug}".
          </p>
          <button
            onClick={() => onNavigate('landing')}
            className="px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold"
          >
            Go to BookFlow Home
          </button>
        </div>
      </div>
    );
  }

  // Handle Booking Submission
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedService) {
      setErrorMessage('Please select a service.');
      return;
    }

    if (!selectedDate) {
      setErrorMessage('Please select an appointment date.');
      return;
    }

    if (!selectedTimeSlot) {
      setErrorMessage('Please select an available time slot.');
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!customerPhone.trim()) {
      setErrorMessage('Please enter your phone or WhatsApp number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await StorageService.createBooking({
        businessId: business.id,
        serviceId: selectedService.id,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        customerName,
        customerEmail,
        customerPhone,
        customerMessage,
      });

      setIsSubmitting(false);

      if (!result.success || !result.booking) {
        setErrorMessage(result.error || 'Failed to complete booking. Please try another slot.');
        return;
      }

      setBookingConfirmed(result.booking);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred while creating your appointment.');
    }
  };

  // WhatsApp Pre-filled message generator
  const getCustomerWhatsAppUrl = (booking: Booking) => {
    const rawNumber = business.whatsappNumber || business.phone;
    const text = `Hi ${business.name}, I would like to book ${booking.serviceName} on ${booking.date} at ${booking.timeSlot}. My booking reference is #${booking.bookingReference}. (Customer: ${booking.customerName})`;
    return StorageService.getWhatsAppLink(rawNumber, text);
  };

  const getDirectChatUrl = () => {
    const rawNumber = business.whatsappNumber || business.phone;
    const text = `Hi ${business.name}, I found your booking page on BookFlow and have an inquiry.`;
    return StorageService.getWhatsAppLink(rawNumber, text);
  };

  // CONFIRMATION SCREEN
  if (bookingConfirmed) {
    const confirmWaUrl = getCustomerWhatsAppUrl(bookingConfirmed);
    return (
      <main id="main-content" className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 sm:p-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Booking Request Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
              Your appointment is requested!
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500">
              We have forwarded your booking details directly to <span className="font-semibold text-neutral-800">{business.name}</span>.
            </p>
          </div>

          {/* Booking Summary Card */}
          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-6 space-y-4 mb-8">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500 font-medium">Reference Code</span>
              <span className="font-mono font-bold text-neutral-900 text-sm">
                #{bookingConfirmed.bookingReference}
              </span>
            </div>

            <div className="flex justify-between items-start pb-3 border-b border-neutral-200">
              <div>
                <span className="text-xs text-neutral-500 block">Service</span>
                <span className="font-bold text-neutral-900 text-sm">{bookingConfirmed.serviceName}</span>
                <span className="text-xs text-neutral-500 block mt-0.5">{bookingConfirmed.serviceDuration} mins</span>
              </div>
              <span className="font-mono font-bold text-neutral-900 text-sm tabular-nums">
                {bookingConfirmed.currencySymbol} {bookingConfirmed.servicePrice.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-neutral-200 text-xs">
              <div>
                <span className="text-neutral-500 block">Date</span>
                <span className="font-bold text-neutral-900">{bookingConfirmed.date}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Time Slot</span>
                <span className="font-bold text-neutral-900 font-mono">{bookingConfirmed.timeSlot}</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <div className="flex justify-between text-neutral-600">
                <span>Customer:</span>
                <span className="font-medium text-neutral-900">{bookingConfirmed.customerName}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Phone / WhatsApp:</span>
                <span className="font-medium text-neutral-900">{bookingConfirmed.customerPhone}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Location:</span>
                <span className="font-medium text-neutral-900">{business.address}, {business.city}</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3">
            {confirmWaUrl ? (
              <a
                href={confirmWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact on WhatsApp with Booking Details"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact on WhatsApp with Booking Details</span>
              </a>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setBookingConfirmed(null);
                setSelectedTimeSlot('');
              }}
              className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors"
            >
              Back to Booking Page
            </button>
          </div>

          <p className="text-[11px] text-neutral-400 text-center mt-6">
            The business owner will confirm your appointment. You can contact them anytime via WhatsApp.
          </p>
        </div>
      </main>
    );
  }

  const directChatUrl = getDirectChatUrl();

  return (
    <main id="main-content" className="min-h-screen bg-neutral-50 pb-20">
      {/* Business Public Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={business.coverUrl || business.logoUrl}
                alt={`${business.name} logo`}
                width={80}
                height={80}
                fetchPriority="high"
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-neutral-200 shadow-xs shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
                    {business.name}
                  </h1>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified business"></span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl">
                  {business.tagline || business.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs text-neutral-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{business.address}, {business.city}</span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{business.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Contact Button */}
            {directChatUrl ? (
              <div className="shrink-0 flex items-center gap-2">
                <a
                  href={directChatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Chat with ${business.name} on WhatsApp`}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main Booking Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: 1. Service & 2. Date & Time Selection */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* STEP 1: SELECT SERVICE */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">Select a Service</h2>
                </div>
                <span className="text-xs text-neutral-500">{services.length} options</span>
              </div>

              {services.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  No active services currently listed for this business.
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((srv) => {
                    const isSelected = selectedService?.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-4 ${
                          isSelected
                            ? 'border-neutral-950 bg-neutral-50/70 ring-1 ring-neutral-950'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-neutral-950 text-sm truncate">
                              {srv.name}
                            </h3>
                            {srv.category && (
                              <span className="text-[11px] font-medium text-neutral-500">
                                · {srv.category}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                            {srv.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600">
                            <span className="flex items-center gap-1 text-[11px]">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              {srv.durationMinutes} mins
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold text-neutral-950 font-mono tabular-nums">
                            {srv.currencySymbol} {srv.price.toLocaleString()}
                          </div>
                          <div className="mt-2">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                isSelected
                                  ? 'bg-neutral-950 text-white'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 2: SELECT DATE */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">Select Date</h2>
                </div>
                
                {/* Month navigation buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Previous month"
                    disabled={calendarMonthOffset <= 0}
                    onClick={() => setCalendarMonthOffset((prev) => Math.max(0, prev - 1))}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none text-neutral-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-neutral-800 px-2 min-w-[120px] text-center">
                    {calendarDays.monthName}
                  </span>
                  <button
                    type="button"
                    aria-label="Next month"
                    disabled={calendarMonthOffset >= 2}
                    onClick={() => setCalendarMonthOffset((prev) => prev + 1)}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none text-neutral-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day Headers (Mon - Sun) */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-neutral-400 mb-2">
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
                <span>Su</span>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {/* Empty cells for leading days */}
                {Array.from({ length: calendarDays.firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10"></div>
                ))}

                {/* Actual day cells */}
                {calendarDays.days.map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <button
                      type="button"
                      key={day.dateStr}
                      aria-label={`Select date ${day.dateStr}`}
                      disabled={day.isPast}
                      onClick={() => {
                        setSelectedDate(day.dateStr);
                        setSelectedTimeSlot(''); // reset slot when date changes
                      }}
                      className={`h-10 rounded-xl text-xs font-mono font-medium transition-all flex flex-col items-center justify-center relative ${
                        day.isPast
                          ? 'text-neutral-300 line-through cursor-not-allowed bg-neutral-50/50'
                          : isSelected
                          ? 'bg-neutral-950 text-white font-bold shadow-xs'
                          : day.isToday
                          ? 'border border-neutral-900 text-neutral-900 hover:bg-neutral-100'
                          : 'hover:bg-neutral-100 text-neutral-800 border border-transparent'
                      }`}
                    >
                      <span>{day.dayNum}</span>
                      {day.isToday && !isSelected && (
                        <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-1"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                <span>Selected: <strong className="text-neutral-800 font-mono">{selectedDate}</strong></span>
                <span className="text-emerald-700">Real-time availability synced</span>
              </div>
            </div>

            {/* STEP 3: SELECT TIME SLOT */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-base font-bold text-neutral-900">Select Time Slot</h2>
                </div>
                <span className="text-xs text-neutral-500">
                  {availableSlots.length} slots open
                </span>
              </div>

              {availableSlots.length === 0 ? (
                <div className="p-6 bg-neutral-50 rounded-xl text-center border border-neutral-200">
                  <Clock className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-neutral-700">
                    No available time slots for {selectedDate}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    The business may be closed, fully booked, or outside operating hours on this day. Please select another date.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        aria-label={`Select time slot ${slot}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all text-center border ${
                          isSelected
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: 4. Customer Information & Confirmation */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs sticky top-28">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <h2 className="text-base font-bold text-neutral-900">Your Contact Details</h2>
              </div>

              {errorMessage && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="cust-full-name" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cust-full-name"
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label htmlFor="cust-phone-number" className="block text-xs font-semibold text-neutral-700 mb-1">
                    WhatsApp or Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="cust-phone-number"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Used for instant WhatsApp booking confirmations.
                  </p>
                </div>

                <div>
                  <label htmlFor="cust-email-address" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="cust-email-address"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. tariq@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label htmlFor="cust-notes-request" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Notes or Specific Requests <span className="text-neutral-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="cust-notes-request"
                    rows={2}
                    value={customerMessage}
                    onChange={(e) => setCustomerMessage(e.target.value)}
                    placeholder="Any health notes, questions, or preferences..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  ></textarea>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="mt-6 pt-6 border-t border-neutral-100 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Service:</span>
                  <span className="font-semibold text-neutral-900 truncate max-w-[190px]">
                    {selectedService?.name || 'None selected'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Schedule:</span>
                  <span className="font-semibold text-neutral-900 font-mono">
                    {selectedDate} {selectedTimeSlot ? `at ${selectedTimeSlot}` : '(Pick a time)'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-900 font-bold pt-2 border-t border-neutral-100 text-sm">
                  <span>Total Due at Visit:</span>
                  <span className="font-mono tabular-nums">
                    {selectedService?.currencySymbol || business.currencySymbol}{' '}
                    {selectedService?.price.toLocaleString() || '0'}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedTimeSlot}
                  className="w-full py-3.5 px-4 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>No upfront payment or credit card required</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
};
