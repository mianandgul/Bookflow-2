/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { 
  Business, 
  Service, 
  Booking, 
  User, 
  AppView, 
  DashboardTab, 
  BookingStatus 
} from './types';
import { StorageService } from './services/storage';
import { SupabaseService } from './services/supabaseService';
import { isSupabaseConfigured } from './lib/supabase';

// Common Components
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';
import { TopNavbar } from './components/common/TopNavbar';

// Landing Page (eagerly loaded for instant mobile LCP/FCP)
import { LandingPage } from './components/landing/LandingPage';

// Lazy-loaded routes & dashboard views
const AuthModal = lazy(() => import('./components/auth/AuthModal').then((m) => ({ default: m.AuthModal })));
const CustomerBookingView = lazy(() => import('./components/customer/CustomerBookingView').then((m) => ({ default: m.CustomerBookingView })));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout').then((m) => ({ default: m.DashboardLayout })));
const OverviewView = lazy(() => import('./components/dashboard/OverviewView').then((m) => ({ default: m.OverviewView })));
const BookingsView = lazy(() => import('./components/dashboard/BookingsView').then((m) => ({ default: m.BookingsView })));
const ServicesView = lazy(() => import('./components/dashboard/ServicesView').then((m) => ({ default: m.ServicesView })));
const AvailabilityView = lazy(() => import('./components/dashboard/AvailabilityView').then((m) => ({ default: m.AvailabilityView })));
const CustomersView = lazy(() => import('./components/dashboard/CustomersView').then((m) => ({ default: m.CustomersView })));
const BusinessProfileView = lazy(() => import('./components/dashboard/BusinessProfileView').then((m) => ({ default: m.BusinessProfileView })));
const SettingsView = lazy(() => import('./components/dashboard/SettingsView').then((m) => ({ default: m.SettingsView })));

const SuspenseFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center p-8 text-neutral-400 text-xs">
    <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin mr-2"></div>
    <span>Loading view...</span>
  </div>
);

export default function App() {
  // Application View State
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [customerSlug, setCustomerSlug] = useState<string>('apex-fitness');
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('overview');

  // Business and Data State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Load initial data
  const loadData = () => {
    const bizList = StorageService.getBusinesses();
    setBusinesses(bizList);

    const activeId = StorageService.getActiveBusinessId();
    const currentBiz = bizList.find((b) => b.id === activeId) || bizList[0];
    setActiveBusiness(currentBiz);
    setCustomerSlug(currentBiz.slug);

    if (currentBiz) {
      setServices(StorageService.getServices(currentBiz.id));
      setBookings(StorageService.getBookings(currentBiz.id));
    }

    setCurrentUser(StorageService.getCurrentUser());
  };

  useEffect(() => {
    loadData();

    if (isSupabaseConfigured()) {
      SupabaseService.getCurrentUser().then((cloudUser) => {
        if (cloudUser) {
          setCurrentUser(cloudUser);
          StorageService.setCurrentUser(cloudUser);
          if (cloudUser.businessId) {
            handleSelectBusiness(cloudUser.businessId);
          }
        }
      });
      StorageService.syncWithSupabase().then(() => {
        loadData();
      });
    }

    // Check URL pathname for deep linking and handle popstate
    const handleUrlChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/business/')) {
        const slug = path.replace('/business/', '').replace(/\/$/, '');
        if (slug) {
          setCustomerSlug(slug);
          setCurrentView('customer_booking');
          const allBiz = StorageService.getBusinesses();
          const matched = allBiz.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
          if (matched) {
            handleSelectBusiness(matched.id);
          }
        }
      } else if (path === '/dashboard') {
        setCurrentView('dashboard');
      } else {
        setCurrentView('landing');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Update business-specific data when active business changes
  const handleSelectBusiness = (bizId: string) => {
    StorageService.setActiveBusinessId(bizId);
    const allBiz = businesses.length > 0 ? businesses : StorageService.getBusinesses();
    const biz = allBiz.find((b) => b.id === bizId);
    if (biz) {
      setActiveBusiness(biz);
      setCustomerSlug(biz.slug);
      setServices(StorageService.getServices(biz.id));
      setBookings(StorageService.getBookings(biz.id));

      // Also adjust simulated user to match this business
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          businessId: biz.id,
          name: `${biz.name} (Manager)`,
        };
        setCurrentUser(updatedUser);
        StorageService.setCurrentUser(updatedUser);
      }
    }
  };

  // Navigation Router
  const handleNavigate = (view: AppView, slug?: string) => {
    setCurrentView(view);
    if (view === 'customer_booking' && slug) {
      setCustomerSlug(slug);
      const allBiz = businesses.length > 0 ? businesses : StorageService.getBusinesses();
      const matched = allBiz.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
      if (matched && matched.id !== activeBusiness?.id) {
        handleSelectBusiness(matched.id);
      }
      try {
        window.history.pushState({ view, slug }, '', `/business/${slug}`);
      } catch {}
    } else if (view === 'landing') {
      try {
        window.history.pushState({ view }, '', '/');
      } catch {}
    } else if (view === 'dashboard') {
      if (!currentUser) {
        setAuthMode('login');
        setAuthModalOpen(true);
        return;
      }
      try {
        window.history.pushState({ view }, '', '/dashboard');
      } catch {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Booking Status Management
  const handleUpdateBookingStatus = (bookingId: string, status: BookingStatus) => {
    StorageService.updateBookingStatus(bookingId, status);
    if (activeBusiness) {
      setBookings(StorageService.getBookings(activeBusiness.id));
    }
  };

  // Services Management Handlers
  const handleAddService = (newServiceData: Omit<Service, 'id'>) => {
    StorageService.addService(newServiceData);
    if (activeBusiness) {
      setServices(StorageService.getServices(activeBusiness.id));
    }
  };

  const handleUpdateService = (updatedService: Service) => {
    StorageService.updateService(updatedService);
    if (activeBusiness) {
      setServices(StorageService.getServices(activeBusiness.id));
    }
  };

  const handleDeleteService = (serviceId: string) => {
    StorageService.deleteService(serviceId);
    if (activeBusiness) {
      setServices(StorageService.getServices(activeBusiness.id));
    }
  };

  // Business Profile Update Handler
  const handleUpdateBusiness = (updatedBiz: Business) => {
    StorageService.saveBusiness(updatedBiz);
    setBusinesses(StorageService.getBusinesses());
    setActiveBusiness(updatedBiz);
    setCustomerSlug(updatedBiz.slug);
  };

  // Reset Sample Data
  const handleResetData = () => {
    StorageService.resetToDefaults();
    loadData();
    alert('Sample demo data has been successfully restored to initial state.');
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    StorageService.setCurrentUser(user);
    if (user.businessId) {
      handleSelectBusiness(user.businessId);
    }
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await SupabaseService.signOut();
    }
    setCurrentUser(null);
    StorageService.setCurrentUser(null);
    setCurrentView('landing');
  };

  if (!activeBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-xs text-neutral-500">
        Loading BookFlow...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
      {/* Top Demo Switcher Utility Bar (Instant evaluation of all views and businesses) */}
      <DemoSwitcherBar
        currentView={currentView}
        onNavigate={handleNavigate}
        businesses={businesses}
        activeBusiness={activeBusiness}
        onSelectBusiness={handleSelectBusiness}
        onResetData={handleResetData}
      />

      {/* Main Viewport Content */}
      {currentView === 'landing' && (
        <>
          <TopNavbar
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onOpenAuth={(mode) => {
              setAuthMode(mode);
              setAuthModalOpen(true);
            }}
            onLogout={handleLogout}
          />
          <LandingPage
            onNavigate={handleNavigate}
            businesses={businesses}
            onSelectBusiness={handleSelectBusiness}
          />
        </>
      )}

      {currentView === 'customer_booking' && (
        <Suspense fallback={<SuspenseFallback />}>
          <CustomerBookingView
            businessSlug={customerSlug}
            onNavigate={handleNavigate}
          />
        </Suspense>
      )}

      {currentView === 'dashboard' && (
        <Suspense fallback={<SuspenseFallback />}>
          <DashboardLayout
            business={activeBusiness}
            activeTab={dashboardTab}
            onTabChange={setDashboardTab}
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          >
            {dashboardTab === 'overview' && (
              <OverviewView
                business={activeBusiness}
                bookings={bookings}
                services={services}
                onTabChange={setDashboardTab}
                onUpdateStatus={handleUpdateBookingStatus}
                onNavigatePublic={() => handleNavigate('customer_booking', activeBusiness.slug)}
              />
            )}

            {dashboardTab === 'bookings' && (
              <BookingsView
                business={activeBusiness}
                bookings={bookings}
                onUpdateStatus={handleUpdateBookingStatus}
              />
            )}

            {dashboardTab === 'services' && (
              <ServicesView
                business={activeBusiness}
                services={services}
                onAddService={handleAddService}
                onUpdateService={handleUpdateService}
                onDeleteService={handleDeleteService}
              />
            )}

            {dashboardTab === 'availability' && (
              <AvailabilityView
                business={activeBusiness}
                onAvailabilityUpdated={() => {
                  // Re-sync bookings or slots if needed
                }}
              />
            )}

            {dashboardTab === 'customers' && (
              <CustomersView business={activeBusiness} />
            )}

            {dashboardTab === 'profile' && (
              <BusinessProfileView
                business={activeBusiness}
                onUpdateBusiness={handleUpdateBusiness}
                onNavigatePublic={() => handleNavigate('customer_booking', activeBusiness.slug)}
              />
            )}

            {dashboardTab === 'settings' && (
              <SettingsView
                business={activeBusiness}
                bookings={bookings}
                onResetData={handleResetData}
              />
            )}
          </DashboardLayout>
        </Suspense>
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            initialMode={authMode}
            businesses={businesses}
            onLoginSuccess={handleLoginSuccess}
          />
        </Suspense>
      )}
    </div>
  );
}
