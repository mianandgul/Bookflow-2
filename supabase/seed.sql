-- ==========================================================
-- BookFlow - Seed Data for Supabase
-- Populates the 5 Initial Benchmark Pakistani Businesses
-- ==========================================================

-- 1. Apex Performance Studio (Lahore)
INSERT INTO public.businesses (
  id, name, slug, tagline, description, category,
  logo_url, cover_url, phone, whatsapp, email, address, city, country,
  timezone, currency, currency_symbol, slot_duration_minutes
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Apex Performance Studio',
  'apex-fitness',
  'Elite 1-on-1 Fitness, Strength & Conditioning',
  'Boutique personal training studio in Gulberg III, Lahore, offering private coaching, athletic hypertrophy, and online customized nutrition programs.',
  'fitness',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop&q=80',
  '+92 300 8472910',
  '+923008472910',
  'contact@apexperformance.pk',
  'Suite 402, Block L, Gulberg III',
  'Lahore',
  'Pakistan',
  'Asia/Karachi',
  'PKR',
  'Rs.',
  60
) ON CONFLICT (slug) DO NOTHING;

-- Apex Services
INSERT INTO public.services (business_id, name, description, price, currency, currency_symbol, duration_minutes, active, category)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Private 1-on-1 Personal Training Session', 'Comprehensive 60-minute tailored workout focusing on strength, biomechanics, and form with certified coach.', 3500, 'PKR', 'Rs.', 60, true, 'Training'),
('11111111-1111-1111-1111-111111111111', 'Body Composition & Fitness Assessment', 'Full InBody scan, posture screening, mobility test, and goal roadmap session.', 2500, 'PKR', 'Rs.', 45, true, 'Assessment'),
('11111111-1111-1111-1111-111111111111', 'Online Video Nutrition & Workout Consultation', 'Detailed 45-minute video call to analyze diet, macro targets, and structured home/gym workout schedule.', 4000, 'PKR', 'Rs.', 45, true, 'Online Coaching')
ON CONFLICT DO NOTHING;

-- 2. Kashmir Heritage Barbershop (Lahore)
INSERT INTO public.businesses (
  id, name, slug, tagline, description, category,
  logo_url, cover_url, phone, whatsapp, email, address, city, country,
  timezone, currency, currency_symbol, slot_duration_minutes
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Kashmir Heritage Barbershop',
  'kashmir-barbers',
  'Master Haircuts & Traditional Hot Towel Grooming',
  'Precision artisan barbering and luxury executive grooming. Walk in for mastery, walk out renewed. Appointments prioritized.',
  'beauty',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&h=600&fit=crop&q=80',
  '+92 321 4455667',
  '+923214455667',
  'info@kashmirbarbers.com',
  'Shop 12, Commercial Market, Phase 5 DHA',
  'Lahore',
  'Pakistan',
  'Asia/Karachi',
  'PKR',
  'Rs.',
  45
) ON CONFLICT (slug) DO NOTHING;

-- Kashmir Services
INSERT INTO public.services (business_id, name, description, price, currency, currency_symbol, duration_minutes, active, category)
VALUES 
('22222222-2222-2222-2222-222222222222', 'Executive Precision Haircut & Styling', 'Custom scissors and clippers cut tailored to face shape, scalp rinse, neck shave, and artisan matte clay finish.', 1800, 'PKR', 'Rs.', 45, true, 'Haircut'),
('22222222-2222-2222-2222-222222222222', 'Royal Beard Sculpting & Hot Towel Treatment', 'Hot essential oil steam, sharp razor blade outline, soothing cold towel compress, and organic beard balm.', 1200, 'PKR', 'Rs.', 30, true, 'Grooming')
ON CONFLICT DO NOTHING;

-- 3. Dr. Noor Aesthetic & Dental Clinic (Islamabad)
INSERT INTO public.businesses (
  id, name, slug, tagline, description, category,
  logo_url, cover_url, phone, whatsapp, email, address, city, country,
  timezone, currency, currency_symbol, slot_duration_minutes
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Dr. Noor Aesthetic & Dental Clinic',
  'dr-noor-dental',
  'Modern painless dentistry & smile transformations',
  'Premier dental practice led by Dr. Noor Fatima (BDS, RDS). Specializing in cosmetic restorations, painless cleanings, and clear aligner consultations.',
  'healthcare',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop&q=80',
  '+92 333 5566778',
  '+923335566778',
  'appointments@drnoordental.com',
  'Executive Med Center, Blue Area',
  'Islamabad',
  'Pakistan',
  'Asia/Karachi',
  'PKR',
  'Rs.',
  30
) ON CONFLICT (slug) DO NOTHING;

-- Dr. Noor Services
INSERT INTO public.services (business_id, name, description, price, currency, currency_symbol, duration_minutes, active, category)
VALUES 
('33333333-3333-3333-3333-333333333333', 'Comprehensive Dental Consultation & Digital X-Ray', 'Thorough examination of teeth, gums, oral cavity, plus digital radiographic assessment and treatment plan.', 2000, 'PKR', 'Rs.', 30, true, 'Diagnostic'),
('33333333-3333-3333-3333-333333333333', 'Ultrasonic Teeth Scaling & Stain Polishing', 'Deep hygienic plaque and tartar removal using high-frequency ultrasound, finished with gentle fluoride polishing.', 6000, 'PKR', 'Rs.', 45, true, 'Preventative')
ON CONFLICT DO NOTHING;

-- 4. LearnHub Tutors (Peshawar)
INSERT INTO public.businesses (
  id, name, slug, tagline, description, category,
  logo_url, cover_url, phone, whatsapp, email, address, city, country,
  timezone, currency, currency_symbol, slot_duration_minutes
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'LearnHub Tutors (Peshawar)',
  'learnhub-tutors',
  'Expert 1-on-1 Academic Tutoring & Test Prep',
  'Specialized private tutoring academy in University Town, Peshawar. Offering personalized O/A Levels mathematics tuition, STEM subjects, and certified IELTS academic test preparation.',
  'education',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&h=600&fit=crop&q=80',
  '+92 313 9081234',
  '+923139081234',
  'contact@learnhubpeshawar.pk',
  'Plot 18-B, Park Avenue, University Town',
  'Peshawar',
  'Pakistan',
  'Asia/Karachi',
  'PKR',
  'Rs.',
  60
) ON CONFLICT (slug) DO NOTHING;

-- LearnHub Services
INSERT INTO public.services (business_id, name, description, price, currency, currency_symbol, duration_minutes, active, category)
VALUES 
('44444444-4444-4444-4444-444444444444', '1-on-1 Math Tuition', 'Focused 60-minute one-on-one mathematics tuition covering algebra, calculus, and past paper problem-solving for O/A Levels and Matric/FSc.', 1000, 'PKR', 'Rs.', 60, true, 'Tuition'),
('44444444-4444-4444-4444-444444444444', 'IELTS Mock Test', 'Comprehensive 90-minute real-condition IELTS mock exam covering speaking interview, writing review, and customized band scoring feedback.', 1500, 'PKR', 'Rs.', 90, true, 'Test Prep')
ON CONFLICT DO NOTHING;

-- 5. Peshawar Legal Consultants (Peshawar)
INSERT INTO public.businesses (
  id, name, slug, tagline, description, category,
  logo_url, cover_url, phone, whatsapp, email, address, city, country,
  timezone, currency, currency_symbol, slot_duration_minutes
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Peshawar Legal Consultants',
  'peshawar-legal',
  'Corporate Advisory, Civil Law & Property Documentation',
  'Trusted legal advisory firm in Saddar, Peshawar. Providing expert legal consultation, contract drafting, property title verification, and corporate compliance services.',
  'professional',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&h=200&fit=crop&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=600&fit=crop&q=80',
  '+92 345 8877665',
  '+923458877665',
  'advisory@peshawarlegal.com',
  'Chambers 4-5, High Court Road, Saddar',
  'Peshawar',
  'Pakistan',
  'Asia/Karachi',
  'PKR',
  'Rs.',
  45
) ON CONFLICT (slug) DO NOTHING;

-- Peshawar Legal Services
INSERT INTO public.services (business_id, name, description, price, currency, currency_symbol, duration_minutes, active, category)
VALUES 
('55555555-5555-5555-5555-555555555555', 'Legal Consultation', 'Professional 45-minute confidential advisory session on civil litigation, commercial disputes, corporate structuring, or real estate.', 3000, 'PKR', 'Rs.', 45, true, 'Advisory'),
('55555555-5555-5555-5555-555555555555', 'Document Review', 'Thorough 30-minute legal scrutiny and vetting of contracts, sale deeds, lease terms, partnership deeds, and power of attorney documents.', 2000, 'PKR', 'Rs.', 30, true, 'Documentation')
ON CONFLICT DO NOTHING;

-- Populate default Monday-Saturday 9am-6pm business hours for all seeded businesses
DO $$
DECLARE
  b_id UUID;
  days TEXT[] := ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  d TEXT;
BEGIN
  FOR b_id IN SELECT id FROM public.businesses LOOP
    FOREACH d IN ARRAY days LOOP
      INSERT INTO public.business_hours (business_id, day_of_week, open_time, close_time, is_open, has_break, break_start_time, break_end_time)
      VALUES (b_id, d, '09:00', '18:00', true, (d != 'saturday'), CASE WHEN d = 'friday' THEN '12:30' ELSE '13:00' END, CASE WHEN d = 'friday' THEN '14:30' ELSE '14:00' END)
      ON CONFLICT (business_id, day_of_week) DO NOTHING;
    END LOOP;
    -- Sunday closed
    INSERT INTO public.business_hours (business_id, day_of_week, open_time, close_time, is_open)
    VALUES (b_id, 'sunday', '10:00', '16:00', false)
    ON CONFLICT (business_id, day_of_week) DO NOTHING;
  END LOOP;
END $$;
