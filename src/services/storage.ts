import { 
  Business, 
  Service, 
  BusinessAvailability, 
  DayOfWeek, 
  DayAvailability,
  Booking, 
  Customer, 
  BookingStatus,
  User 
} from '../types';

import heroImage from '../assets/images/booking_platform_hero_1790610722458.jpg';
import fitnessImage from '../assets/images/service_fitness_coach_1790610738386.jpg';
import barberImage from '../assets/images/service_barber_salon_1790610749677.jpg';
import dentalImage from '../assets/images/service_dental_clinic_1790610765963.jpg';
import tutorImage from '../assets/images/service_tutor_education_1790692253523.jpg';
import legalImage from '../assets/images/service_legal_office_1790692264349.jpg';

// Asset references
export const ASSETS = {
  hero: heroImage,
  fitness: fitnessImage,
  barber: barberImage,
  dental: dentalImage,
  tutor: tutorImage,
  legal: legalImage,
};

export function resolveAssetUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('service_fitness_coach')) return ASSETS.fitness;
  if (url.includes('service_barber_salon')) return ASSETS.barber;
  if (url.includes('service_dental_clinic')) return ASSETS.dental;
  if (url.includes('service_tutor_education')) return ASSETS.tutor;
  if (url.includes('service_legal_office')) return ASSETS.legal;
  if (url.includes('booking_platform_hero')) return ASSETS.hero;
  return url;
}

const STORAGE_KEYS = {
  BUSINESSES: 'bookflow_businesses_v1',
  SERVICES: 'bookflow_services_v1',
  AVAILABILITY: 'bookflow_availability_v1',
  BOOKINGS: 'bookflow_bookings_v1',
  CURRENT_USER: 'bookflow_user_v1',
  ACTIVE_BUSINESS_ID: 'bookflow_active_business_id_v1',
};

const defaultSchedule: Record<DayOfWeek, DayAvailability> = {
  monday: { day: 'monday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  tuesday: { day: 'tuesday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  wednesday: { day: 'wednesday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  thursday: { day: 'thursday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStartTime: '13:00', breakEndTime: '14:00' },
  friday: { day: 'friday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: true, breakStartTime: '12:30', breakEndTime: '14:30' },
  saturday: { day: 'saturday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: false },
  sunday: { day: 'sunday', isAvailable: false, startTime: '10:00', endTime: '16:00', hasBreak: false },
};

export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz_apex_fitness',
    slug: 'apex-fitness',
    name: 'Apex Performance Studio',
    tagline: 'Elite 1-on-1 Fitness, Strength & Conditioning',
    description: 'Boutique personal training studio in Gulberg III, Lahore, offering private coaching, athletic hypertrophy, and online customized nutrition programs.',
    category: 'fitness',
    logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&q=80',
    coverUrl: ASSETS.fitness,
    phone: '+92 300 8472910',
    whatsappNumber: '+923008472910',
    email: 'contact@apexperformance.pk',
    address: 'Suite 402, Block L, Gulberg III',
    city: 'Lahore',
    country: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    website: 'https://apexperformance.pk',
    instagram: '@apexfitness_pk',
    slotDurationMinutes: 60,
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'biz_kashmir_barbers',
    slug: 'kashmir-barbers',
    name: 'Kashmir Heritage Barbershop',
    tagline: 'Master Haircuts & Traditional Hot Towel Grooming',
    description: 'Precision artisan barbering and luxury executive grooming. Walk in for mastery, walk out renewed. Appointments prioritized.',
    category: 'beauty',
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&h=200&fit=crop&q=80',
    coverUrl: ASSETS.barber,
    phone: '+92 321 4455667',
    whatsappNumber: '+923214455667',
    email: 'info@kashmirbarbers.com',
    address: 'Shop 12, Commercial Market, Phase 5 DHA',
    city: 'Lahore',
    country: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    website: 'https://kashmirbarbers.com',
    instagram: '@kashmir_barbershop',
    slotDurationMinutes: 45,
    createdAt: '2026-02-01T12:00:00Z',
  },
  {
    id: 'biz_dr_noor_dental',
    slug: 'dr-noor-dental',
    name: 'Dr. Noor Aesthetic & Dental Clinic',
    tagline: 'Modern painless dentistry & smile transformations',
    description: 'Premier dental practice led by Dr. Noor Fatima (BDS, RDS). Specializing in cosmetic restorations, painless cleanings, and clear aligner consultations.',
    category: 'healthcare',
    logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=200&h=200&fit=crop&q=80',
    coverUrl: ASSETS.dental,
    phone: '+92 333 5566778',
    whatsappNumber: '+923335566778',
    email: 'appointments@drnoordental.com',
    address: 'Executive Med Center, Blue Area',
    city: 'Islamabad',
    country: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    website: 'https://drnoordental.com',
    instagram: '@drnoordental',
    slotDurationMinutes: 30,
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'biz_learnhub_tutors',
    slug: 'learnhub-tutors',
    name: 'LearnHub Tutors (Peshawar)',
    tagline: 'Expert 1-on-1 Academic Tutoring & Test Prep',
    description: 'Specialized private tutoring academy in University Town, Peshawar. Offering personalized O/A Levels mathematics tuition, STEM subjects, and certified IELTS academic test preparation.',
    category: 'education',
    logoUrl: ASSETS.tutor,
    coverUrl: ASSETS.tutor,
    phone: '+92 313 9081234',
    whatsappNumber: '+923139081234',
    email: 'contact@learnhubpeshawar.pk',
    address: 'Plot 18-B, Park Avenue, University Town',
    city: 'Peshawar',
    country: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    website: 'https://learnhub.pk',
    instagram: '@learnhub_peshawar',
    slotDurationMinutes: 60,
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'biz_peshawar_legal',
    slug: 'peshawar-legal',
    name: 'Peshawar Legal Consultants',
    tagline: 'Corporate Advisory, Civil Law & Property Documentation',
    description: 'Trusted legal advisory firm in Saddar, Peshawar. Providing expert legal consultation, contract drafting, property title verification, and corporate compliance services.',
    category: 'professional',
    logoUrl: ASSETS.legal,
    coverUrl: ASSETS.legal,
    phone: '+92 345 8877665',
    whatsappNumber: '+923458877665',
    email: 'advisory@peshawarlegal.com',
    address: 'Chambers 4-5, High Court Road, Saddar',
    city: 'Peshawar',
    country: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    website: 'https://peshawarlegal.com',
    instagram: '@peshawar_legal',
    slotDurationMinutes: 45,
    createdAt: '2026-02-20T10:00:00Z',
  }
];

export const INITIAL_SERVICES: Service[] = [
  // Apex Fitness
  {
    id: 'srv_fit_1',
    businessId: 'biz_apex_fitness',
    name: 'Private 1-on-1 Personal Training Session',
    description: 'Comprehensive 60-minute tailored workout focusing on strength, biomechanics, and form with certified coach.',
    price: 3500,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 60,
    imageUrl: ASSETS.fitness,
    isActive: true,
    category: 'Training',
  },
  {
    id: 'srv_fit_2',
    businessId: 'biz_apex_fitness',
    name: 'Body Composition & Fitness Assessment',
    description: 'Full InBody scan, posture screening, mobility test, and goal roadmap session.',
    price: 2500,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 45,
    imageUrl: ASSETS.fitness,
    isActive: true,
    category: 'Assessment',
  },
  {
    id: 'srv_fit_3',
    businessId: 'biz_apex_fitness',
    name: 'Online Video Nutrition & Workout Consultation',
    description: 'Detailed 45-minute video call to analyze diet, macro targets, and structured home/gym workout schedule.',
    price: 4000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 45,
    imageUrl: ASSETS.hero,
    isActive: true,
    category: 'Online Coaching',
  },

  // Kashmir Barbers
  {
    id: 'srv_barb_1',
    businessId: 'biz_kashmir_barbers',
    name: 'Executive Precision Haircut & Styling',
    description: 'Custom scissors and clippers cut tailored to face shape, scalp rinse, neck shave, and artisan matte clay finish.',
    price: 1800,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 45,
    imageUrl: ASSETS.barber,
    isActive: true,
    category: 'Haircut',
  },
  {
    id: 'srv_barb_2',
    businessId: 'biz_kashmir_barbers',
    name: 'Royal Beard Sculpting & Hot Towel Treatment',
    description: 'Hot essential oil steam, sharp razor blade outline, soothing cold towel compress, and organic beard balm.',
    price: 1200,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 30,
    imageUrl: ASSETS.barber,
    isActive: true,
    category: 'Grooming',
  },
  {
    id: 'srv_barb_3',
    businessId: 'biz_kashmir_barbers',
    name: 'Full Master Grooming Combo (Cut + Beard + Wash)',
    description: 'The ultimate royal package. Scissor haircut, luxury beard sculpture, deep botanical shampoo, and scalp massage.',
    price: 2800,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 60,
    imageUrl: ASSETS.barber,
    isActive: true,
    category: 'Combo',
  },

  // Dr. Noor Dental
  {
    id: 'srv_dent_1',
    businessId: 'biz_dr_noor_dental',
    name: 'Comprehensive Dental Consultation & Digital X-Ray',
    description: 'Thorough examination of teeth, gums, oral cavity, plus digital radiographic assessment and treatment plan.',
    price: 2000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 30,
    imageUrl: ASSETS.dental,
    isActive: true,
    category: 'Diagnostic',
  },
  {
    id: 'srv_dent_2',
    businessId: 'biz_dr_noor_dental',
    name: 'Ultrasonic Teeth Scaling & Stain Polishing',
    description: 'Deep hygienic plaque and tartar removal using high-frequency ultrasound, finished with gentle fluoride polishing.',
    price: 6000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 45,
    imageUrl: ASSETS.dental,
    isActive: true,
    category: 'Preventative',
  },
  {
    id: 'srv_dent_3',
    businessId: 'biz_dr_noor_dental',
    name: 'Cosmetic Teeth Whitening Assessment',
    description: 'Smile shade analysis and customized in-clinic laser teeth whitening consult with Dr. Noor.',
    price: 3000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 30,
    imageUrl: ASSETS.dental,
    isActive: true,
    category: 'Cosmetic',
  },

  // LearnHub Tutors (Peshawar)
  {
    id: 'srv_tutor_1',
    businessId: 'biz_learnhub_tutors',
    name: '1-on-1 Math Tuition',
    description: 'Focused 60-minute one-on-one mathematics tuition covering algebra, calculus, and past paper problem-solving for O/A Levels and Matric/FSc.',
    price: 1000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 60,
    imageUrl: ASSETS.tutor,
    isActive: true,
    category: 'Tuition',
  },
  {
    id: 'srv_tutor_2',
    businessId: 'biz_learnhub_tutors',
    name: 'IELTS Mock Test',
    description: 'Comprehensive 90-minute real-condition IELTS mock exam covering speaking interview, writing review, and customized band scoring feedback.',
    price: 1500,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 90,
    imageUrl: ASSETS.tutor,
    isActive: true,
    category: 'Test Prep',
  },

  // Peshawar Legal Consultants
  {
    id: 'srv_legal_1',
    businessId: 'biz_peshawar_legal',
    name: 'Legal Consultation',
    description: 'Professional 45-minute confidential advisory session on civil litigation, commercial disputes, corporate structuring, or real estate.',
    price: 3000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 45,
    imageUrl: ASSETS.legal,
    isActive: true,
    category: 'Advisory',
  },
  {
    id: 'srv_legal_2',
    businessId: 'biz_peshawar_legal',
    name: 'Document Review',
    description: 'Thorough 30-minute legal scrutiny and vetting of contracts, sale deeds, lease terms, partnership deeds, and power of attorney documents.',
    price: 2000,
    currency: 'PKR',
    currencySymbol: 'Rs.',
    durationMinutes: 30,
    imageUrl: ASSETS.legal,
    isActive: true,
    category: 'Documentation',
  },
];

// Helper to get formatted dates: Today, Tomorrow, Day after
function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk_1',
    bookingReference: 'BF-8921',
    businessId: 'biz_apex_fitness',
    serviceId: 'srv_fit_1',
    serviceName: 'Private 1-on-1 Personal Training Session',
    servicePrice: 3500,
    serviceDuration: 60,
    currencySymbol: 'Rs.',
    date: getDateOffset(0), // Today
    timeSlot: '10:00 AM',
    customerName: 'Hamza Tariq',
    customerEmail: 'hamza.tariq@gmail.com',
    customerPhone: '+92 321 8899123',
    customerMessage: 'Looking to focus on bench press and shoulder mobility.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'bk_2',
    bookingReference: 'BF-8922',
    businessId: 'biz_apex_fitness',
    serviceId: 'srv_fit_2',
    serviceName: 'Body Composition & Fitness Assessment',
    servicePrice: 2500,
    serviceDuration: 45,
    currencySymbol: 'Rs.',
    date: getDateOffset(0), // Today
    timeSlot: '03:00 PM',
    customerName: 'Ayesha Khan',
    customerEmail: 'ayesha.k@outlook.com',
    customerPhone: '+92 300 4455881',
    customerMessage: 'First time joining a gym, need complete assessment.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'bk_3',
    bookingReference: 'BF-8923',
    businessId: 'biz_apex_fitness',
    serviceId: 'srv_fit_1',
    serviceName: 'Private 1-on-1 Personal Training Session',
    servicePrice: 3500,
    serviceDuration: 60,
    currencySymbol: 'Rs.',
    date: getDateOffset(1), // Tomorrow
    timeSlot: '11:00 AM',
    customerName: 'Bilal Ahmed',
    customerEmail: 'bilal.ahmed@live.com',
    customerPhone: '+92 334 1122334',
    customerMessage: 'Leg workout session please.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'bk_4',
    bookingReference: 'BF-8924',
    businessId: 'biz_apex_fitness',
    serviceId: 'srv_fit_3',
    serviceName: 'Online Video Nutrition & Workout Consultation',
    servicePrice: 4000,
    serviceDuration: 45,
    currencySymbol: 'Rs.',
    date: getDateOffset(2),
    timeSlot: '04:00 PM',
    customerName: 'Zainab Malik',
    customerEmail: 'zainab.m@gmail.com',
    customerPhone: '+92 312 9988776',
    customerMessage: 'Looking for a clean diet plan for PCOS weight loss.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'bk_5',
    bookingReference: 'BF-8925',
    businessId: 'biz_apex_fitness',
    serviceId: 'srv_fit_1',
    serviceName: 'Private 1-on-1 Personal Training Session',
    servicePrice: 3500,
    serviceDuration: 60,
    currencySymbol: 'Rs.',
    date: getDateOffset(-1), // Yesterday
    timeSlot: '09:00 AM',
    customerName: 'Usman Ghani',
    customerEmail: 'usman.g@gmail.com',
    customerPhone: '+92 322 7766554',
    customerMessage: 'Morning conditioning workout.',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'bk_tutor_1',
    bookingReference: 'BF-3101',
    businessId: 'biz_learnhub_tutors',
    serviceId: 'srv_tutor_1',
    serviceName: '1-on-1 Math Tuition',
    servicePrice: 1000,
    serviceDuration: 60,
    currencySymbol: 'Rs.',
    date: getDateOffset(0), // Today
    timeSlot: '11:00 AM',
    customerName: 'Sarmad Khan',
    customerEmail: 'sarmad.k@gmail.com',
    customerPhone: '+92 332 5544332',
    customerMessage: 'Need preparation for O-Level trigonometry and algebra test.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'bk_tutor_2',
    bookingReference: 'BF-3102',
    businessId: 'biz_learnhub_tutors',
    serviceId: 'srv_tutor_2',
    serviceName: 'IELTS Mock Test',
    servicePrice: 1500,
    serviceDuration: 90,
    currencySymbol: 'Rs.',
    date: getDateOffset(1), // Tomorrow
    timeSlot: '02:00 PM',
    customerName: 'Fatima Bibi',
    customerEmail: 'fatima.bibi@yahoo.com',
    customerPhone: '+92 315 9988112',
    customerMessage: 'Aiming for 7.5 band score in academic module.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'bk_legal_1',
    bookingReference: 'BF-4201',
    businessId: 'biz_peshawar_legal',
    serviceId: 'srv_legal_1',
    serviceName: 'Legal Consultation',
    servicePrice: 3000,
    serviceDuration: 45,
    currencySymbol: 'Rs.',
    date: getDateOffset(0), // Today
    timeSlot: '10:00 AM',
    customerName: 'Shahid Afridi',
    customerEmail: 'shahid.afridi@live.com',
    customerPhone: '+92 301 7766554',
    customerMessage: 'Consultation regarding commercial shop lease contract in Saddar.',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
  },
  {
    id: 'bk_legal_2',
    bookingReference: 'BF-4202',
    businessId: 'biz_peshawar_legal',
    serviceId: 'srv_legal_2',
    serviceName: 'Document Review',
    servicePrice: 2000,
    serviceDuration: 30,
    currencySymbol: 'Rs.',
    date: getDateOffset(1), // Tomorrow
    timeSlot: '03:00 PM',
    customerName: 'Arif Nizami',
    customerEmail: 'arif.nizami@outlook.com',
    customerPhone: '+92 333 4455112',
    customerMessage: 'Reviewing partnership deed and property title verification documents.',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export class StorageService {
  private static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  // Business Operations
  static getBusinesses(): Business[] {
    let list = this.load<Business[]>(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
    if (!list || list.length === 0) {
      this.save(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
      return INITIAL_BUSINESSES;
    }
    // Auto-merge any missing initial businesses and sanitize asset paths
    let updated = false;
    list = list.map((b) => {
      const resolvedCover = resolveAssetUrl(b.coverUrl);
      const resolvedLogo = resolveAssetUrl(b.logoUrl);
      if (resolvedCover !== b.coverUrl || resolvedLogo !== b.logoUrl) {
        updated = true;
        return { ...b, coverUrl: resolvedCover, logoUrl: resolvedLogo };
      }
      return b;
    });
    for (const initBiz of INITIAL_BUSINESSES) {
      if (!list.some((b) => b.id === initBiz.id || b.slug === initBiz.slug)) {
        list.push(initBiz);
        updated = true;
      }
    }
    if (updated) {
      this.save(STORAGE_KEYS.BUSINESSES, list);
    }
    return list;
  }

  static getBusinessBySlug(slug: string): Business | undefined {
    return this.getBusinesses().find((b) => b.slug.toLowerCase() === slug.toLowerCase());
  }

  static getBusinessById(id: string): Business | undefined {
    return this.getBusinesses().find((b) => b.id === id);
  }

  static getActiveBusinessId(): string {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID);
    if (stored && this.getBusinessById(stored)) {
      return stored;
    }
    return INITIAL_BUSINESSES[0].id;
  }

  static setActiveBusinessId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID, id);
  }

  static saveBusiness(business: Business): void {
    const businesses = this.getBusinesses();
    const index = businesses.findIndex((b) => b.id === business.id);
    if (index >= 0) {
      businesses[index] = business;
    } else {
      businesses.push(business);
    }
    this.save(STORAGE_KEYS.BUSINESSES, businesses);
  }

  // Services Operations
  static getServices(businessId?: string): Service[] {
    let all = this.load<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (!all || all.length === 0) {
      this.save(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
      all = INITIAL_SERVICES;
    } else {
      let updated = false;
      all = all.map((s) => {
        const resolvedImage = resolveAssetUrl(s.imageUrl);
        if (resolvedImage !== s.imageUrl) {
          updated = true;
          return { ...s, imageUrl: resolvedImage };
        }
        return s;
      });
      // Auto-merge missing services from INITIAL_SERVICES
      for (const initSrv of INITIAL_SERVICES) {
        if (!all.some((s) => s.id === initSrv.id)) {
          all.push(initSrv);
          updated = true;
        }
      }
      if (updated) {
        this.save(STORAGE_KEYS.SERVICES, all);
      }
    }
    return businessId ? all.filter((s) => s.businessId === businessId) : all;
  }

  static addService(service: Omit<Service, 'id'>): Service {
    const all = this.getServices();
    const newService: Service = {
      ...service,
      id: 'srv_' + Math.random().toString(36).substring(2, 9),
    };
    all.push(newService);
    this.save(STORAGE_KEYS.SERVICES, all);
    return newService;
  }

  static updateService(service: Service): void {
    const all = this.getServices();
    const index = all.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      all[index] = service;
      this.save(STORAGE_KEYS.SERVICES, all);
    }
  }

  static deleteService(id: string): void {
    const all = this.getServices();
    const filtered = all.filter((s) => s.id !== id);
    this.save(STORAGE_KEYS.SERVICES, filtered);
  }

  // Availability Operations
  static getAvailability(businessId: string): BusinessAvailability {
    const all = this.load<Record<string, BusinessAvailability>>(STORAGE_KEYS.AVAILABILITY, {});
    if (all[businessId]) {
      const existing = all[businessId];
      // Ensure Monday-Saturday availability is ensured for new businesses
      if (businessId === 'biz_learnhub_tutors' || businessId === 'biz_peshawar_legal') {
        if (!existing.schedule?.saturday?.isAvailable || existing.schedule?.saturday?.startTime !== '09:00') {
          existing.schedule = { ...defaultSchedule, ...existing.schedule };
          existing.schedule.saturday = { day: 'saturday', isAvailable: true, startTime: '09:00', endTime: '18:00', hasBreak: false };
          all[businessId] = existing;
          this.save(STORAGE_KEYS.AVAILABILITY, all);
        }
      }
      return existing;
    }
    const created: BusinessAvailability = {
      businessId,
      schedule: defaultSchedule,
      slotIntervalMinutes: 30,
    };
    all[businessId] = created;
    this.save(STORAGE_KEYS.AVAILABILITY, all);
    return created;
  }

  static saveAvailability(availability: BusinessAvailability): void {
    const all = this.load<Record<string, BusinessAvailability>>(STORAGE_KEYS.AVAILABILITY, {});
    all[availability.businessId] = availability;
    this.save(STORAGE_KEYS.AVAILABILITY, all);
  }

  // Bookings Operations
  static getBookings(businessId?: string): Booking[] {
    let all = this.load<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    if (!all || all.length === 0) {
      this.save(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
      all = INITIAL_BOOKINGS;
    } else {
      let updated = false;
      for (const initB of INITIAL_BOOKINGS) {
        if (!all.some((b) => b.id === initB.id)) {
          all.push(initB);
          updated = true;
        }
      }
      if (updated) {
        this.save(STORAGE_KEYS.BOOKINGS, all);
      }
    }
    return businessId ? all.filter((b) => b.businessId === businessId) : all;
  }

  static createBooking(data: {
    businessId: string;
    serviceId: string;
    date: string;
    timeSlot: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerMessage?: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    // Check if slot is still available (Anti-double booking rule)
    const availableSlots = this.getAvailableSlots(data.businessId, data.date, data.serviceId);
    if (!availableSlots.includes(data.timeSlot)) {
      return { success: false, error: 'This time slot is no longer available. Please select another time.' };
    }

    const business = this.getBusinessById(data.businessId);
    const service = this.getServices().find((s) => s.id === data.serviceId);
    if (!business || !service) {
      return { success: false, error: 'Business or service not found.' };
    }

    const all = this.getBookings();
    const referenceNumber = Math.floor(1000 + Math.random() * 9000);
    const newBooking: Booking = {
      id: 'bk_' + Math.random().toString(36).substring(2, 9),
      bookingReference: `BF-${referenceNumber}`,
      businessId: data.businessId,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDuration: service.durationMinutes,
      currencySymbol: service.currencySymbol || business.currencySymbol,
      date: data.date,
      timeSlot: data.timeSlot,
      customerName: data.customerName.trim(),
      customerEmail: data.customerEmail.trim(),
      customerPhone: data.customerPhone.trim(),
      customerMessage: data.customerMessage?.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    all.unshift(newBooking);
    this.save(STORAGE_KEYS.BOOKINGS, all);
    return { success: true, booking: newBooking };
  }

  static updateBookingStatus(bookingId: string, status: BookingStatus): void {
    const all = this.getBookings();
    const target = all.find((b) => b.id === bookingId);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      this.save(STORAGE_KEYS.BOOKINGS, all);
    }
  }

  // Customer Aggregation
  static getCustomers(businessId: string): Customer[] {
    const bookings = this.getBookings(businessId);
    const business = this.getBusinessById(businessId);
    const currencySymbol = business?.currencySymbol || 'Rs.';

    const customerMap = new Map<string, Customer>();

    bookings.forEach((b) => {
      const key = (b.customerEmail || b.customerPhone).toLowerCase();
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: 'cust_' + Math.random().toString(36).substring(2, 8),
          businessId,
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          totalBookings: 0,
          lastBookingDate: b.date,
          totalSpent: 0,
          currencySymbol,
        });
      }
      const existing = customerMap.get(key)!;
      existing.totalBookings += 1;
      if (b.status === 'completed' || b.status === 'confirmed') {
        existing.totalSpent += b.servicePrice;
      }
      if (new Date(b.date) > new Date(existing.lastBookingDate)) {
        existing.lastBookingDate = b.date;
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalBookings - a.totalBookings);
  }

  // Available Slots Logic with Anti-Double Booking
  static getAvailableSlots(businessId: string, dateString: string, _serviceId?: string): string[] {
    if (!dateString) return [];
    
    // Check if date is in the past
    const selectedDate = new Date(dateString + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return []; // No booking in the past
    }

    // Determine Day of week
    const dayNames: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[selectedDate.getDay()];

    const availability = this.getAvailability(businessId);
    const dayConfig = availability.schedule[dayName];

    if (!dayConfig || !dayConfig.isAvailable) {
      return [];
    }

    const startMinutes = timeToMinutes(dayConfig.startTime);
    const endMinutes = timeToMinutes(dayConfig.endTime);
    const interval = availability.slotIntervalMinutes || 30;

    let breakStart = -1;
    let breakEnd = -1;
    if (dayConfig.hasBreak && dayConfig.breakStartTime && dayConfig.breakEndTime) {
      breakStart = timeToMinutes(dayConfig.breakStartTime);
      breakEnd = timeToMinutes(dayConfig.breakEndTime);
    }

    // Existing active bookings for this date and business
    // Both 'pending' and 'confirmed' hold the slot. 'cancelled' releases it!
    const existingBookings = this.getBookings(businessId).filter(
      (b) => b.date === dateString && (b.status === 'pending' || b.status === 'confirmed')
    );
    const bookedTimeSlots = new Set(existingBookings.map((b) => b.timeSlot));

    const slots: string[] = [];

    // If booking for today, also prevent booking past times
    const isToday = selectedDate.getTime() === today.getTime();
    const currentNowMinutes = isToday ? new Date().getHours() * 60 + new Date().getMinutes() : -1;

    for (let m = startMinutes; m + interval <= endMinutes; m += interval) {
      // Check if overlaps with break
      if (breakStart !== -1 && breakEnd !== -1) {
        if (m < breakEnd && m + interval > breakStart) {
          continue; // during break
        }
      }

      // Check if in the past today
      if (isToday && m <= currentNowMinutes + 30) {
        continue;
      }

      const formattedSlot = minutesToTimeSlot(m);

      // Check anti-double booking
      if (!bookedTimeSlots.has(formattedSlot)) {
        slots.push(formattedSlot);
      }
    }

    return slots;
  }

  // WhatsApp Link Helper
  static getWhatsAppLink(rawPhone: string, message: string): string {
    const cleanNumber = rawPhone.replace(/[^\d]/g, '');
    const encodedText = encodeURIComponent(message);
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  }

  // Auth & Session
  static getCurrentUser(): User | null {
    const user = this.load<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (!user) {
      // Default to owner of the first business for instant demo testing
      const defaultUser: User = {
        id: 'usr_demo_owner',
        name: 'Coach Hamza (Owner)',
        email: 'owner@apexperformance.pk',
        businessId: 'biz_apex_fitness',
        role: 'owner',
      };
      this.save(STORAGE_KEYS.CURRENT_USER, defaultUser);
      return defaultUser;
    }
    return user;
  }

  static setCurrentUser(user: User | null): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
    if (user && user.businessId) {
      this.setActiveBusinessId(user.businessId);
    }
  }

  static resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.AVAILABILITY);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_BUSINESS_ID);
  }
}

// Helpers for time calculation
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function minutesToTimeSlot(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m.toString().padStart(2, '0');
  return `${displayH.toString().padStart(2, '0')}:${displayM} ${period}`;
}
