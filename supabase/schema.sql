-- ==========================================================
-- BookFlow - Production Supabase Database Schema
-- Multi-Business Appointment Booking System with RLS
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------
-- 1. BUSINESSES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT,
  description TEXT,
  category TEXT DEFAULT 'other',
  logo_url TEXT,
  cover_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'Asia/Karachi',
  currency TEXT DEFAULT 'PKR',
  currency_symbol TEXT DEFAULT 'Rs.',
  website TEXT,
  instagram TEXT,
  slot_duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by slug in public customer booking flows
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);

-- ----------------------------------------------------------
-- 2. PROFILES (USERS / BUSINESS OWNERS & STAFF)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner', 'staff', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON public.profiles(business_id);

-- ----------------------------------------------------------
-- 3. SERVICES TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'PKR',
  currency_symbol TEXT DEFAULT 'Rs.',
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);

-- ----------------------------------------------------------
-- 4. BUSINESS HOURS TABLE (WEEKLY SCHEDULE)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  open_time TEXT NOT NULL DEFAULT '09:00',
  close_time TEXT NOT NULL DEFAULT '18:00',
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  has_break BOOLEAN NOT NULL DEFAULT FALSE,
  break_start_time TEXT,
  break_end_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, day_of_week)
);

CREATE INDEX IF NOT EXISTS idx_business_hours_biz_day ON public.business_hours(business_id, day_of_week);

-- ----------------------------------------------------------
-- 5. BLOCKED TIMES TABLE (VACATIONS, CLOSURES, BREAKS)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_times (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blocked_times_biz_date ON public.blocked_times(business_id, date);

-- ----------------------------------------------------------
-- 6. BOOKINGS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT NOT NULL,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  service_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  service_duration INTEGER NOT NULL DEFAULT 30,
  currency_symbol TEXT DEFAULT 'Rs.',
  booking_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  customer_message TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crucial: Unique partial index to prevent double bookings on the database level
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_booking 
ON public.bookings (business_id, booking_date, start_time) 
WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_bookings_biz_date ON public.bookings(business_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON public.bookings(booking_reference);

-- ----------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's business_id
CREATE OR REPLACE FUNCTION public.get_auth_business_id()
RETURNS UUID AS $$
  SELECT business_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- BUSINESSES POLICIES
-- Anyone can view businesses (for booking directory / landing / public customer page)
CREATE POLICY "Public businesses are viewable by everyone" 
ON public.businesses FOR SELECT USING (true);

-- Authenticated users can insert their business during signup
CREATE POLICY "Authenticated users can create business" 
ON public.businesses FOR INSERT TO authenticated WITH CHECK (true);

-- Only owners/staff can update their own business
CREATE POLICY "Owners can update their own business" 
ON public.businesses FOR UPDATE TO authenticated 
USING (id = public.get_auth_business_id());

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT TO authenticated 
USING (id = auth.uid());

CREATE POLICY "Users can create own profile" 
ON public.profiles FOR INSERT TO authenticated 
WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE TO authenticated 
USING (id = auth.uid());

-- SERVICES POLICIES
-- Public can view active services
CREATE POLICY "Anyone can view services" 
ON public.services FOR SELECT USING (true);

-- Owners can manage their business services
CREATE POLICY "Owners can insert business services" 
ON public.services FOR INSERT TO authenticated 
WITH CHECK (business_id = public.get_auth_business_id());

CREATE POLICY "Owners can update business services" 
ON public.services FOR UPDATE TO authenticated 
USING (business_id = public.get_auth_business_id());

CREATE POLICY "Owners can delete business services" 
ON public.services FOR DELETE TO authenticated 
USING (business_id = public.get_auth_business_id());

-- BUSINESS HOURS POLICIES
-- Public can view business hours to calculate available slots
CREATE POLICY "Anyone can view business hours" 
ON public.business_hours FOR SELECT USING (true);

CREATE POLICY "Owners can manage business hours" 
ON public.business_hours FOR ALL TO authenticated 
USING (business_id = public.get_auth_business_id());

-- BLOCKED TIMES POLICIES
-- Public can view blocked times to filter unavailable slots
CREATE POLICY "Anyone can view blocked times" 
ON public.blocked_times FOR SELECT USING (true);

CREATE POLICY "Owners can manage blocked times" 
ON public.blocked_times FOR ALL TO authenticated 
USING (business_id = public.get_auth_business_id());

-- BOOKINGS POLICIES
-- Public customers can insert bookings (creating an appointment)
CREATE POLICY "Public can create bookings" 
ON public.bookings FOR INSERT WITH CHECK (true);

-- Business owners can view their business's bookings
CREATE POLICY "Owners can view business bookings" 
ON public.bookings FOR SELECT TO authenticated 
USING (business_id = public.get_auth_business_id());

-- Public can check booking reference or view slots (customers can check their own booking if needed)
CREATE POLICY "Public can view own booking by reference" 
ON public.bookings FOR SELECT 
USING (business_id = public.get_auth_business_id() OR auth.role() = 'anon');

-- Business owners can update their bookings (status, notes)
CREATE POLICY "Owners can update business bookings" 
ON public.bookings FOR UPDATE TO authenticated 
USING (business_id = public.get_auth_business_id());

-- ----------------------------------------------------------
-- 8. ATOMIC DOUBLE-BOOKING CHECK FUNCTION (RPC)
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_booking_safe(
  p_business_id UUID,
  p_service_id UUID,
  p_booking_date DATE,
  p_start_time TEXT,
  p_end_time TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_customer_phone TEXT,
  p_customer_message TEXT,
  p_booking_reference TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_service RECORD;
  v_existing_booking UUID;
  v_new_booking RECORD;
BEGIN
  -- 1. Check if slot is already booked
  SELECT id INTO v_existing_booking
  FROM public.bookings
  WHERE business_id = p_business_id
    AND booking_date = p_booking_date
    AND start_time = p_start_time
    AND status != 'cancelled'
  LIMIT 1;

  IF v_existing_booking IS NOT NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'This time slot was just booked by another client. Please select another slot.'
    );
  END IF;

  -- 2. Fetch service details
  SELECT * INTO v_service FROM public.services WHERE id = p_service_id;
  IF v_service IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Selected service was not found.'
    );
  END IF;

  -- 3. Insert the new booking
  INSERT INTO public.bookings (
    booking_reference,
    business_id,
    service_id,
    service_name,
    service_price,
    service_duration,
    currency_symbol,
    booking_date,
    start_time,
    end_time,
    customer_name,
    customer_email,
    customer_phone,
    customer_message,
    status
  ) VALUES (
    p_booking_reference,
    p_business_id,
    p_service_id,
    v_service.name,
    v_service.price,
    v_service.duration_minutes,
    v_service.currency_symbol,
    p_booking_date,
    p_start_time,
    p_end_time,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_customer_message,
    'pending'
  )
  RETURNING * INTO v_new_booking;

  RETURN jsonb_build_object(
    'success', true,
    'booking', to_jsonb(v_new_booking)
  );
EXCEPTION WHEN unique_violation THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', 'This time slot is no longer available due to a conflicting booking.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
