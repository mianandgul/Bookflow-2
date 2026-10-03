export type BusinessCategory = 
  | 'fitness' 
  | 'beauty' 
  | 'healthcare' 
  | 'education' 
  | 'professional' 
  | 'automotive'
  | 'other';

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: BusinessCategory;
  logoUrl: string;
  coverUrl: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  country: string;
  timezone?: string;
  currency: string; // e.g. 'PKR', 'USD', 'GBP', 'EUR'
  currencySymbol: string; // e.g. 'Rs.', '$', '£', '€'
  website?: string;
  instagram?: string;
  slotDurationMinutes: number; // default 30 or 60
  createdAt: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  currencySymbol: string;
  durationMinutes: number;
  imageUrl: string;
  isActive: boolean;
  category?: string;
}

export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export interface DayAvailability {
  day: DayOfWeek;
  isAvailable: boolean;
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  hasBreak: boolean;
  breakStartTime?: string; // "13:00"
  breakEndTime?: string;   // "14:00"
}

export interface BlockedTime {
  id: string;
  businessId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "09:00" or "09:00 AM"
  endTime: string;   // "17:00" or "05:00 PM"
  reason?: string;
  createdAt?: string;
}

export interface BusinessAvailability {
  businessId: string;
  schedule: Record<DayOfWeek, DayAvailability>;
  slotIntervalMinutes: number;
  blockedTimes?: BlockedTime[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  bookingReference: string; // e.g. "BF-7482"
  businessId: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  currencySymbol: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "10:00 AM"
  endTime?: string; // "11:00 AM"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerMessage?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastBookingDate: string;
  totalSpent: number;
  currencySymbol: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessId: string;
  role: 'owner' | 'staff' | 'admin';
}

export interface Profile {
  id: string;
  businessId: string;
  fullName: string;
  email: string;
  role: 'owner' | 'staff' | 'admin';
  createdAt?: string;
}

export type AppView = 
  | 'landing' 
  | 'dashboard' 
  | 'customer_booking' 
  | 'login' 
  | 'signup';

export type DashboardTab = 
  | 'overview' 
  | 'bookings' 
  | 'services' 
  | 'availability' 
  | 'customers' 
  | 'profile' 
  | 'settings';
