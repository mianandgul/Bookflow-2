import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  Business, 
  Service, 
  Booking, 
  User, 
  BookingStatus, 
  BusinessAvailability, 
  DayOfWeek, 
  DayAvailability,
  BlockedTime 
} from '../types';

export class SupabaseService {
  // --------------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------------
  static async signUp(params: {
    email: string;
    password: string;
    fullName: string;
    businessName: string;
  }): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { user: null, error: 'Supabase is not configured yet.' };
    }

    try {
      // 1. Create auth user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.fullName,
            business_name: params.businessName,
          },
        },
      });

      if (authError || !authData.user) {
        return { user: null, error: authError?.message || 'Failed to sign up.' };
      }

      const userId = authData.user.id;
      const slug = params.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `biz-${Date.now().toString(36)}`;

      // 2. Create business record
      const { data: bizData, error: bizError } = await supabase
        .from('businesses')
        .insert({
          name: params.businessName,
          slug,
          email: params.email,
          description: `Welcome to ${params.businessName}. Book your appointments online easily.`,
          currency: 'PKR',
          currency_symbol: 'Rs.',
          slot_duration_minutes: 30,
        })
        .select()
        .single();

      if (bizError) {
        console.warn('Business creation warning:', bizError);
      }

      const businessId = bizData?.id || 'biz_apex_fitness';

      // 3. Create profile
      await supabase.from('profiles').insert({
        id: userId,
        business_id: businessId,
        full_name: params.fullName,
        email: params.email,
        role: 'owner',
      });

      // 4. Create default weekly business hours (Mon-Sat 9am-6pm)
      const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const defaultHours = days.map((day) => ({
        business_id: businessId,
        day_of_week: day,
        open_time: '09:00',
        close_time: '18:00',
        is_open: true,
        has_break: day !== 'saturday',
        break_start_time: day === 'friday' ? '12:30' : '13:00',
        break_end_time: day === 'friday' ? '14:30' : '14:00',
      }));

      await supabase.from('business_hours').upsert([
        ...defaultHours,
        {
          business_id: businessId,
          day_of_week: 'sunday',
          open_time: '10:00',
          close_time: '16:00',
          is_open: false,
        },
      ]);

      const appUser: User = {
        id: userId,
        email: params.email,
        name: params.fullName,
        businessId,
        role: 'owner',
      };

      return { user: appUser, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'An unexpected error occurred during sign up.' };
    }
  }

  static async signIn(params: {
    email: string;
    password: string;
  }): Promise<{ user: User | null; error: string | null }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { user: null, error: 'Supabase is not configured yet.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error || !data.user) {
        return { user: null, error: error?.message || 'Invalid email or password.' };
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user: User = {
        id: data.user.id,
        email: data.user.email || params.email,
        name: profile?.full_name || data.user.user_metadata?.full_name || 'Business Owner',
        businessId: profile?.business_id || 'biz_apex_fitness',
        role: (profile?.role as 'owner' | 'staff' | 'admin') || 'owner',
      };

      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Login failed.' };
    }
  }

  static async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  static async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured yet.' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  }

  static async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      return {
        id: session.user.id,
        email: session.user.email || '',
        name: profile?.full_name || session.user.user_metadata?.full_name || 'Business Owner',
        businessId: profile?.business_id || 'biz_apex_fitness',
        role: (profile?.role as 'owner' | 'staff' | 'admin') || 'owner',
      };
    } catch {
      return null;
    }
  }

  // --------------------------------------------------------
  // BUSINESSES
  // --------------------------------------------------------
  static async getBusinesses(): Promise<Business[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) {
      console.warn('Failed to load businesses from Supabase:', error);
      return [];
    }

    return data.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      tagline: b.tagline || '',
      description: b.description || '',
      category: b.category || 'other',
      logoUrl: b.logo_url || '',
      coverUrl: b.cover_url || '',
      phone: b.phone || '',
      whatsappNumber: b.whatsapp || '',
      email: b.email || '',
      address: b.address || '',
      city: b.city || '',
      country: b.country || 'Pakistan',
      timezone: b.timezone || 'Asia/Karachi',
      currency: b.currency || 'PKR',
      currencySymbol: b.currency_symbol || 'Rs.',
      website: b.website || '',
      instagram: b.instagram || '',
      slotDurationMinutes: b.slot_duration_minutes || 30,
      createdAt: b.created_at || new Date().toISOString(),
    }));
  }

  static async updateBusiness(business: Business): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;

    const { error } = await supabase
      .from('businesses')
      .update({
        name: business.name,
        tagline: business.tagline,
        description: business.description,
        phone: business.phone,
        whatsapp: business.whatsappNumber,
        email: business.email,
        address: business.address,
        city: business.city,
        country: business.country,
        currency: business.currency,
        currency_symbol: business.currencySymbol,
        timezone: business.timezone,
        slot_duration_minutes: business.slotDurationMinutes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', business.id);

    return !error;
  }

  // --------------------------------------------------------
  // SERVICES
  // --------------------------------------------------------
  static async getServices(businessId: string): Promise<Service[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];

    return data.map((s) => ({
      id: s.id,
      businessId: s.business_id,
      name: s.name,
      description: s.description || '',
      price: Number(s.price),
      currency: s.currency || 'PKR',
      currencySymbol: s.currency_symbol || 'Rs.',
      durationMinutes: s.duration_minutes,
      imageUrl: s.image_url || '',
      isActive: s.active,
      category: s.category || '',
    }));
  }

  static async createService(service: Omit<Service, 'id'>): Promise<Service | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const { data, error } = await supabase
      .from('services')
      .insert({
        business_id: service.businessId,
        name: service.name,
        description: service.description,
        price: service.price,
        currency: service.currency,
        currency_symbol: service.currencySymbol,
        duration_minutes: service.durationMinutes,
        image_url: service.imageUrl,
        active: service.isActive,
        category: service.category,
      })
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      businessId: data.business_id,
      name: data.name,
      description: data.description || '',
      price: Number(data.price),
      currency: data.currency || 'PKR',
      currencySymbol: data.currency_symbol || 'Rs.',
      durationMinutes: data.duration_minutes,
      imageUrl: data.image_url || '',
      isActive: data.active,
      category: data.category || '',
    };
  }

  static async updateService(service: Service): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;

    const { error } = await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        price: service.price,
        currency: service.currency,
        currency_symbol: service.currencySymbol,
        duration_minutes: service.durationMinutes,
        image_url: service.imageUrl,
        active: service.isActive,
        category: service.category,
        updated_at: new Date().toISOString(),
      })
      .eq('id', service.id);

    return !error;
  }

  static async deleteService(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const { error } = await supabase.from('services').delete().eq('id', id);
    return !error;
  }

  // --------------------------------------------------------
  // BUSINESS HOURS & AVAILABILITY
  // --------------------------------------------------------
  static async getBusinessAvailability(businessId: string): Promise<BusinessAvailability | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const { data: hoursData, error: hoursError } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', businessId);

    const { data: blockedData } = await supabase
      .from('blocked_times')
      .select('*')
      .eq('business_id', businessId);

    if (hoursError || !hoursData || hoursData.length === 0) return null;

    const schedule: any = {};
    for (const row of hoursData) {
      schedule[row.day_of_week] = {
        day: row.day_of_week,
        isAvailable: row.is_open,
        startTime: row.open_time,
        endTime: row.close_time,
        hasBreak: Boolean(row.has_break),
        breakStartTime: row.break_start_time || undefined,
        breakEndTime: row.break_end_time || undefined,
      };
    }

    const blockedTimes: BlockedTime[] = (blockedData || []).map((b) => ({
      id: b.id,
      businessId: b.business_id,
      date: b.date,
      startTime: b.start_time,
      endTime: b.end_time,
      reason: b.reason,
    }));

    return {
      businessId,
      schedule,
      slotIntervalMinutes: 30,
      blockedTimes,
    };
  }

  static async saveBusinessHours(availability: BusinessAvailability): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;

    const rows = Object.values(availability.schedule).map((day) => ({
      business_id: availability.businessId,
      day_of_week: day.day,
      open_time: day.startTime,
      close_time: day.endTime,
      is_open: day.isAvailable,
      has_break: day.hasBreak,
      break_start_time: day.breakStartTime || null,
      break_end_time: day.breakEndTime || null,
    }));

    const { error } = await supabase
      .from('business_hours')
      .upsert(rows, { onConflict: 'business_id,day_of_week' });

    return !error;
  }

  // --------------------------------------------------------
  // BLOCKED TIMES
  // --------------------------------------------------------
  static async getBlockedTimes(businessId: string): Promise<BlockedTime[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('blocked_times')
      .select('*')
      .eq('business_id', businessId)
      .order('date', { ascending: true });

    if (error || !data) return [];

    return data.map((b) => ({
      id: b.id,
      businessId: b.business_id,
      date: b.date,
      startTime: b.start_time,
      endTime: b.end_time,
      reason: b.reason || '',
      createdAt: b.created_at,
    }));
  }

  static async addBlockedTime(blocked: Omit<BlockedTime, 'id'>): Promise<BlockedTime | null> {
    if (!isSupabaseConfigured() || !supabase) return null;

    const { data, error } = await supabase
      .from('blocked_times')
      .insert({
        business_id: blocked.businessId,
        date: blocked.date,
        start_time: blocked.startTime,
        end_time: blocked.endTime,
        reason: blocked.reason || '',
      })
      .select()
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      businessId: data.business_id,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      reason: data.reason,
      createdAt: data.created_at,
    };
  }

  static async deleteBlockedTime(id: string): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;
    const { error } = await supabase.from('blocked_times').delete().eq('id', id);
    return !error;
  }

  // --------------------------------------------------------
  // BOOKINGS (WITH DOUBLE-BOOKING PREVENTION)
  // --------------------------------------------------------
  static async getBookings(businessId: string): Promise<Booking[]> {
    if (!isSupabaseConfigured() || !supabase) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .order('booking_date', { ascending: false });

    if (error || !data) return [];

    return data.map((b) => ({
      id: b.id,
      bookingReference: b.booking_reference,
      businessId: b.business_id,
      serviceId: b.service_id,
      serviceName: b.service_name,
      servicePrice: Number(b.service_price),
      serviceDuration: b.service_duration,
      currencySymbol: b.currency_symbol || 'Rs.',
      date: b.booking_date,
      timeSlot: b.start_time,
      endTime: b.end_time,
      customerName: b.customer_name,
      customerEmail: b.customer_email || '',
      customerPhone: b.customer_phone,
      customerMessage: b.customer_message || '',
      notes: b.notes || '',
      status: b.status as BookingStatus,
      createdAt: b.created_at,
      updatedAt: b.updated_at,
    }));
  }

  static async createBooking(data: {
    businessId: string;
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    serviceDuration: number;
    currencySymbol: string;
    date: string;
    timeSlot: string;
    endTime?: string;
    customerName: string;
    customerEmail?: string;
    customerPhone: string;
    customerMessage?: string;
    bookingReference: string;
  }): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    if (!isSupabaseConfigured() || !supabase) {
      return { success: false, error: 'Supabase is not configured.' };
    }

    try {
      // First check for conflicting active booking on database
      const { data: conflict } = await supabase
        .from('bookings')
        .select('id')
        .eq('business_id', data.businessId)
        .eq('booking_date', data.date)
        .eq('start_time', data.timeSlot)
        .neq('status', 'cancelled')
        .maybeSingle();

      if (conflict) {
        return {
          success: false,
          error: 'This time slot is no longer available. Please select another slot.',
        };
      }

      // Check for blocked times on that date
      const { data: blockedTimes } = await supabase
        .from('blocked_times')
        .select('*')
        .eq('business_id', data.businessId)
        .eq('date', data.date);

      if (blockedTimes && blockedTimes.length > 0) {
        const slotMin = timeToMinutes(data.timeSlot);
        const slotEndMin = slotMin + data.serviceDuration;
        for (const b of blockedTimes) {
          const bStart = timeToMinutes(b.start_time);
          const bEnd = timeToMinutes(b.end_time);
          if (slotMin < bEnd && slotEndMin > bStart) {
            return {
              success: false,
              error: `This date and time is blocked (${b.reason || 'Unavailable'}).`,
            };
          }
        }
      }

      // Insert new booking
      const { data: inserted, error } = await supabase
        .from('bookings')
        .insert({
          booking_reference: data.bookingReference,
          business_id: data.businessId,
          service_id: data.serviceId,
          service_name: data.serviceName,
          service_price: data.servicePrice,
          service_duration: data.serviceDuration,
          currency_symbol: data.currencySymbol,
          booking_date: data.date,
          start_time: data.timeSlot,
          end_time: data.endTime,
          customer_name: data.customerName.trim(),
          customer_email: data.customerEmail?.trim(),
          customer_phone: data.customerPhone.trim(),
          customer_message: data.customerMessage?.trim(),
          status: 'pending',
        })
        .select()
        .single();

      if (error || !inserted) {
        if (error?.code === '23505') {
          return {
            success: false,
            error: 'Double-booking prevented: another customer just booked this slot.',
          };
        }
        return { success: false, error: error?.message || 'Failed to save booking.' };
      }

      const booking: Booking = {
        id: inserted.id,
        bookingReference: inserted.booking_reference,
        businessId: inserted.business_id,
        serviceId: inserted.service_id,
        serviceName: inserted.service_name,
        servicePrice: Number(inserted.service_price),
        serviceDuration: inserted.service_duration,
        currencySymbol: inserted.currency_symbol || 'Rs.',
        date: inserted.booking_date,
        timeSlot: inserted.start_time,
        endTime: inserted.end_time,
        customerName: inserted.customer_name,
        customerEmail: inserted.customer_email || '',
        customerPhone: inserted.customer_phone,
        customerMessage: inserted.customer_message || '',
        notes: inserted.notes || '',
        status: inserted.status as BookingStatus,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at,
      };

      return { success: true, booking };
    } catch (err: any) {
      return { success: false, error: err.message || 'Booking submission error.' };
    }
  }

  static async updateBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) return false;

    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    return !error;
  }
}

function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const isPM = /pm/i.test(timeStr);
  const isAM = /am/i.test(timeStr);
  const clean = timeStr.replace(/(am|pm)/i, '').trim();
  const [hStr, mStr] = clean.split(':');
  let h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return h * 60 + m;
}
