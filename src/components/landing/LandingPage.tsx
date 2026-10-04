import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  MapPin, 
  ExternalLink,
  XCircle,
  HelpCircle,
  Globe2,
  TrendingUp,
  Scissors,
  Dumbbell,
  Stethoscope,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { AppView, Business } from '../../types';
import { ASSETS, ASSETS_THUMB, ASSETS_SHOWCASE } from '../../services/storage';

interface LandingPageProps {
  onNavigate: (view: AppView, slug?: string) => void;
  businesses: Business[];
  onSelectBusiness: (bizId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  businesses,
  onSelectBusiness,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeIndustry, setActiveIndustry] = useState<string>('fitness');

  const faqs = [
    {
      q: 'Do customers need an account?',
      a: 'No. Customers never need to register, download an app, or remember a password. They simply open your booking link, pick a service, select an available date and time, enter their name and phone number, and confirm.',
    },
    {
      q: 'Can I use this for my business?',
      a: 'Yes! BookFlow is built universally for appointment-based service providers worldwide—from personal trainers in Lahore and London to barbers, dental clinics, tutors, photographers, auto mechanics, and beauty professionals.',
    },
    {
      q: 'Can I receive bookings and chat through WhatsApp?',
      a: 'Yes. Every booking includes instant one-click WhatsApp confirmation links for both you and your client with pre-filled appointment details. You can configure your own business WhatsApp number.',
    },
    {
      q: 'Does it work on mobile?',
      a: 'Yes, 100%. The public customer booking page and the business owner dashboard are designed mobile-first and work flawlessly on smartphones, tablets, laptops, and desktop computers.',
    },
    {
      q: 'Can I configure local currencies like PKR (Pakistani Rupees)?',
      a: 'Yes. You can specify any currency code (PKR, USD, GBP, EUR, AED, etc.) and currency symbol (Rs., $, £, €) directly inside your business profile.',
    },
    {
      q: 'How does BookFlow prevent double-booking?',
      a: 'Our smart scheduling engine continuously syncs your working hours, breaks, and booked slots. Once a customer books a slot, that time is instantly blocked. If you cancel a booking, the slot is automatically released back to the schedule.',
    },
  ];

  const industryProfiles = [
    {
      id: 'fitness',
      name: 'Fitness & Gyms',
      icon: Dumbbell,
      title: 'Apex Performance Studio (Lahore)',
      city: 'Gulberg III, Lahore',
      description: 'Let gym members and private clients book 1-on-1 personal training, body scans, and fitness consultations without repetitive WhatsApp chats.',
      bizId: 'biz_apex_fitness',
      slug: 'apex-fitness',
      sampleService: '1-on-1 Personal Training · 60 mins (Rs. 3,500)',
      secondaryService: 'Body Composition & Assessment · 45 mins (Rs. 2,500)',
      image: ASSETS_SHOWCASE.fitness,
    },
    {
      id: 'beauty',
      name: 'Beauty & Barbers',
      icon: Scissors,
      title: 'Kashmir Heritage Barbershop (Lahore)',
      city: 'Phase 5 DHA, Lahore',
      description: 'Eliminate chaotic salon queues. Clients select specific haircuts, beard styling, or facial grooming and pick guaranteed appointment times.',
      bizId: 'biz_kashmir_barbers',
      slug: 'kashmir-barbers',
      sampleService: 'Executive Haircut & Styling · 45 mins (Rs. 1,800)',
      secondaryService: 'Royal Beard Sculpting · 30 mins (Rs. 1,200)',
      image: ASSETS_SHOWCASE.barber,
    },
    {
      id: 'healthcare',
      name: 'Healthcare & Dental',
      icon: Stethoscope,
      title: 'Dr. Noor Aesthetic & Dental Clinic (Islamabad)',
      city: 'Blue Area, Islamabad',
      description: 'Streamline patient visits. Display clear medical consult fees, clinic availability, and digital reminders with zero administrative chaos.',
      bizId: 'biz_dr_noor_dental',
      slug: 'dr-noor-dental',
      sampleService: 'Comprehensive Dental Consult · 30 mins (Rs. 2,000)',
      secondaryService: 'Ultrasonic Scaling & Polishing · 45 mins (Rs. 6,000)',
      image: ASSETS_SHOWCASE.dental,
    },
    {
      id: 'education',
      name: 'Education & Tutors',
      icon: GraduationCap,
      title: 'LearnHub Tutors (Peshawar)',
      city: 'University Town, Peshawar',
      description: 'Specialized private tutoring academy in University Town, Peshawar. Students and parents can schedule 1-on-1 mathematics tuition, STEM coaching, and IELTS mock exams directly online.',
      bizId: 'biz_learnhub_tutors',
      slug: 'learnhub-tutors',
      sampleService: '1-on-1 Math Tuition · 60 mins (Rs. 1,000)',
      secondaryService: 'IELTS Mock Test · 90 mins (Rs. 1,500)',
      image: ASSETS_SHOWCASE.tutor,
    },
    {
      id: 'professional',
      name: 'Professional Services',
      icon: Briefcase,
      title: 'Peshawar Legal Consultants',
      city: 'Saddar, Peshawar',
      description: 'Trusted legal advisory firm in Saddar, Peshawar. Clients can schedule confidential legal consultations, document and contract reviews, and property title verifications online.',
      bizId: 'biz_peshawar_legal',
      slug: 'peshawar-legal',
      sampleService: 'Legal Consultation · 45 mins (Rs. 3,000)',
      secondaryService: 'Document Review · 30 mins (Rs. 2,000)',
      image: ASSETS_SHOWCASE.legal,
    },
  ];

  const currentIndustry = industryProfiles.find((i) => i.id === industryIndustryMatch(activeIndustry)) || industryProfiles[0];

  function industryIndustryMatch(id: string) {
    return industryProfiles.some(i => i.id === id) ? id : 'fitness';
  }

  const handleTestBusiness = (bizId: string, slug: string) => {
    onSelectBusiness(bizId);
    onNavigate('customer_booking', slug);
  };

  return (
    <main id="main-content" className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Global & Local Booking for Small Businesses</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 leading-[1.1] text-balance">
                Let customers book your services online.
              </h1>

              <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl leading-relaxed">
                Create your professional booking page, manage appointments, and make it easier for customers to schedule your services. Say goodbye to messy WhatsApp and Instagram DMs.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Create Your Booking Page</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 text-sm font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex items-center justify-center text-center"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-neutral-100 grid grid-cols-3 gap-4 text-xs text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No customer login needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant WhatsApp notifications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero double-bookings</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Preview of a Business Booking Page */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background ambient glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-100/50 to-neutral-200/50 rounded-3xl blur-xl -z-10"></div>
                
                {/* Interactive Simulated Booking Page Mockup */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
                  {/* Mock browser header */}
                  <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300"></div>
                    </div>
                    <div className="bg-white px-3 py-1 rounded text-neutral-600 font-mono text-[11px] border border-neutral-200 flex items-center gap-1.5 truncate max-w-[210px]">
                      <span className="text-emerald-600">🔒</span>
                      <span>bookflow.me/apex-fitness</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono">LIVE PREVIEW</span>
                  </div>

                  {/* Business Banner & Info */}
                  <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-start gap-3.5">
                      <img 
                        src="/hero-thumb.webp" 
                        alt="Apex Fitness Studio logo" 
                        width={56}
                        height={56}
                        fetchPriority="high"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover border border-neutral-200 shadow-xs shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-neutral-900 text-base truncate">Apex Performance Studio</p>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-1">Personal Training & Conditioning</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-neutral-400" /> Gulberg III, Lahore</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-medium">Open Today</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Card Sample */}
                  <div className="p-5 space-y-4">
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      Select Service
                    </div>

                    <div className="border border-neutral-200 hover:border-neutral-900 rounded-xl p-3.5 transition-all bg-white relative">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-semibold text-neutral-900 text-sm">
                          1-on-1 Personal Training Session
                        </span>
                        <span className="font-bold text-neutral-950 font-mono text-sm tabular-nums">
                          Rs. 3,500
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-2">
                        60-minute tailored strength workout with certified biomechanics coach.
                      </p>
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" /> 60 minutes
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Selected
                        </span>
                      </div>
                    </div>

                    {/* Time Slot Picker Sample */}
                    <div className="pt-2">
                      <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Available Times (Today)
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="py-1.5 text-center text-xs font-mono rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-400 line-through">
                          09:00 AM
                        </div>
                        <div className="py-1.5 text-center text-xs font-mono font-medium rounded-lg border-2 border-neutral-900 bg-neutral-900 text-white shadow-xs">
                          10:00 AM
                        </div>
                        <div className="py-1.5 text-center text-xs font-mono font-medium rounded-lg border border-neutral-200 hover:border-neutral-400 text-neutral-800">
                          11:00 AM
                        </div>
                      </div>
                    </div>

                    {/* Live Test Button */}
                    <button
                      onClick={() => handleTestBusiness('biz_apex_fitness', 'apex-fitness')}
                      className="w-full mt-2 py-2.5 px-4 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open Complete Live Customer Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 1: THE PROBLEM */}
      <section id="problem" className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
              The Reality
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              Manual booking wastes hours every single week.
            </h2>
            <p className="text-neutral-600 mt-4 text-base sm:text-lg">
              Most independent businesses still rely on fragmented messaging channels. It costs you customers, causes double-bookings, and interrupts your actual work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">WhatsApp Chaos</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Customers ask "Are you free today at 4?", while you are in a session. By the time you reply 2 hours later, they have booked someone else.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">Instagram DM Back-and-Forth</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                6 separate messages just to agree on a price, a service type, and a time slot. Important details get buried under random notifications.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">Phone Call Disruptions</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Answering calls while cutting hair, examining patients, or training clients looks unprofessional and interrupts paid service time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-2">Double-Bookings & No-Shows</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Paper registers and memory inevitably lead to overlapping clients, embarrassing delays, and lost business reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE SOLUTION */}
      <section id="solution" className="py-16 sm:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              The Better Way
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              One link that does all the heavy lifting.
            </h2>
            <p className="text-neutral-600 mt-4 text-base sm:text-lg">
              BookFlow gives you a branded online home where customers browse services, view accurate prices, pick open slots, and confirm appointments 24/7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl border border-neutral-100 bg-neutral-50/50">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-lg font-bold text-neutral-950">Online Service Menu & Pricing</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Display clear service descriptions, transparent pricing in your local currency, and expected durations. No more answering "How much for a haircut?".
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl border border-neutral-100 bg-neutral-50/50">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-lg font-bold text-neutral-950">Live Real-Time Availability</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Set your working hours and breaks. Our smart calendar calculates valid slots and automatically blocks booked times to prevent double-booking.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl border border-neutral-100 bg-neutral-50/50">
              <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-lg font-bold text-neutral-950">Actionable Business Dashboard</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Track pending and confirmed appointments, monitor customer histories, manage schedules, and trigger pre-filled WhatsApp reminders in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              From zero to accepting bookings in 3 minutes.
            </h2>
            <p className="text-neutral-600 mt-3 text-base">
              No technical expertise or coding required. Get started immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 relative">
              <div className="text-4xl font-extrabold text-neutral-200 font-mono mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-neutral-950 mb-2">Create Business Profile</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Enter your business name, WhatsApp number, address, city, and upload your logo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 relative">
              <div className="text-4xl font-extrabold text-neutral-200 font-mono mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-neutral-950 mb-2">Add Services & Schedule</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                List what you offer, assign prices and durations, and define your weekly available hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 relative">
              <div className="text-4xl font-extrabold text-neutral-200 font-mono mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-neutral-950 mb-2">Share Your Booking Link</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Put your unique link in your Instagram bio, WhatsApp business status, or business card.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 relative">
              <div className="text-4xl font-extrabold text-neutral-200 font-mono mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-neutral-950 mb-2">Customers Book Online</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Clients select their slot, enter their contact info, and you receive the booking on your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES BENTO GRID */}
      <section id="features" className="py-16 sm:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              Engineered for busy independent operators.
            </h2>
            <p className="text-neutral-600 mt-3 text-base">
              Everything you need to run your client appointments smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
              <Smartphone className="w-6 h-6 text-neutral-900 mb-4" />
              <h3 className="text-base font-bold text-neutral-950 mb-2">Professional Booking Page</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fast, responsive public page optimized for mobile phones. Looks clean and trustworthy to every client.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
              <Sparkles className="w-6 h-6 text-neutral-900 mb-4" />
              <h3 className="text-base font-bold text-neutral-950 mb-2">Service Management</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Add, edit, or temporarily pause services. Set individual pricing, custom descriptions, and durations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
              <Clock className="w-6 h-6 text-neutral-900 mb-4" />
              <h3 className="text-base font-bold text-neutral-950 mb-2">Availability & Break Controls</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Configure day-by-day opening and closing hours, lunch breaks, and mark days off with one click.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
              <TrendingUp className="w-6 h-6 text-neutral-900 mb-4" />
              <h3 className="text-base font-bold text-neutral-950 mb-2">Appointment Dashboard</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Filter by Today, Upcoming, and Past. Change booking statuses between Pending, Confirmed, Completed, and Cancelled.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
              <MessageSquare className="w-6 h-6 text-neutral-900 mb-4" />
              <h3 className="text-base font-bold text-neutral-950 mb-2">One-Click WhatsApp Integration</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pre-formatted WhatsApp messages for booking confirmations, location sharing, and follow-ups.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50">
              <ShieldCheck className="w-6 h-6 text-neutral-900 mb-4" />
              <h3 className="text-base font-bold text-neutral-950 mb-2">Anti-Double Booking Engine</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Prevents two customers from claiming the same time slot. Releasing a cancellation makes the slot available again immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOR DIFFERENT BUSINESSES (Interactive Showcase) */}
      <section className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Versatile & Adaptable
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              Designed for every appointment-based business.
            </h2>
            <p className="text-neutral-600 mt-3 text-base">
              Explore how BookFlow configures for different service industries.
            </p>
          </div>

          {/* Industry Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {industryProfiles.map((ind) => {
              const Icon = ind.icon;
              const isActive = activeIndustry === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setActiveIndustry(ind.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:text-neutral-950 border border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{ind.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active Industry Showcase Card */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              <div className="md:col-span-5 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {currentIndustry.name}
                    </span>
                    <span className="text-[11px] text-neutral-500 font-medium">
                      📍 {currentIndustry.city}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-950 mt-3 mb-2">
                    {currentIndustry.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-5">
                    {currentIndustry.description}
                  </p>

                  <div className="border-t border-neutral-100 pt-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-neutral-400 uppercase tracking-wider">
                        Available Services
                      </span>
                      <span className="text-emerald-700 font-medium">
                        Mon–Sat (9am–6pm)
                      </span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 text-xs font-medium text-neutral-800 flex items-center justify-between">
                        <span>{currentIndustry.sampleService}</span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                      </div>
                      {currentIndustry.secondaryService && (
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 text-xs font-medium text-neutral-800 flex items-center justify-between">
                          <span>{currentIndustry.secondaryService}</span>
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleTestBusiness(currentIndustry.bizId, currentIndustry.slug)}
                    className="w-full py-3 px-4 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-between group"
                  >
                    <span className="font-medium">Test This Business Booking Flow</span>
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                      <span>/business/{currentIndustry.slug}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>

              <div className="md:col-span-7 bg-neutral-100 relative min-h-[280px]">
                <img
                  src={currentIndustry.image}
                  alt={currentIndustry.title}
                  width={800}
                  height={500}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: PRICING (MVP Placeholder) */}
      <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Transparent Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              Start free. Upgrade as you scale.
            </h2>
            <p className="text-neutral-600 mt-3 text-base">
              Simple plans for solo practitioners and expanding studios.
            </p>
          </div>

          {/* MVP Disclaimer Notice */}
          <div className="max-w-md mx-auto mb-12 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-center">
            <p className="text-xs text-amber-900 font-medium">
              Note: Pricing is a representative MVP placeholder. All features are currently free and fully accessible for testing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-neutral-950">Free Starter</h3>
                  <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                    MVP Active
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-neutral-950 font-mono">$0</span>
                  <span className="text-xs text-neutral-500 font-medium">/month</span>
                </div>
                <p className="text-xs text-neutral-600 mb-6">
                  Essential tools for solo service providers getting their first clients online.
                </p>

                <div className="space-y-3 border-t border-neutral-100 pt-6 text-xs text-neutral-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Branded public booking page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Up to 3 active services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Standard weekly availability schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Basic appointment management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Manual WhatsApp client contact</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-3 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded-xl transition-colors"
                >
                  Get Started for Free
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl border-2 border-neutral-950 bg-neutral-950 text-white shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-neutral-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">Business Pro</h3>
                  <span className="text-xs font-medium text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                    Full Power
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold text-white font-mono">$9</span>
                  <span className="text-xs text-neutral-400 font-medium">/month</span>
                </div>
                <p className="text-xs text-neutral-400 mb-6">
                  For growing studios and clinics managing high-volume bookings and client records.
                </p>

                <div className="space-y-3 border-t border-neutral-800 pt-6 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited services & categories</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Advanced availability & custom break times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Pre-filled WhatsApp confirmation & alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Customer directory & booking spending history</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Custom currencies (PKR, USD, GBP, etc.)</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs rounded-xl transition-colors shadow-sm"
                >
                  Create Your Booking Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ */}
      <section id="faq" className="py-16 sm:py-24 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Answers & Clarifications
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 mt-2 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-600 mt-2 text-sm">
              Everything you need to know about setting up and running your online booking.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full py-4 px-6 text-left flex justify-between items-center gap-4 focus:outline-hidden"
                >
                  <span className="text-sm font-bold text-neutral-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div 
                    id={`faq-answer-${idx}`}
                    className="px-6 pb-4 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50"
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 sm:py-20 bg-neutral-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade from manual DM bookings?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Set up your services and share your professional booking link today. It takes less than 3 minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 rounded-xl font-semibold text-sm transition-colors shadow-md inline-flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="bg-white py-12 border-t border-neutral-200 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-950 text-sm">BookFlow</span>
            <span className="text-neutral-300">·</span>
            <span>Simple online booking for your business.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-neutral-900 transition-colors">FAQ</a>
            <span className="text-neutral-300">·</span>
            <span>© 2026 BookFlow. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
};
