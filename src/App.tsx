/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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

// Common Components
import { DemoSwitcherBar } from './components/common/DemoSwitcherBar';
import { TopNavbar } from './components/common/TopNavbar';
import { AuthModal } from './components/auth/AuthModal';

// Landing Page
import { LandingPage } from './components/landing/LandingPage';

// Customer Public Booking Page
import { CustomerBookingView } from './components/customer/CustomerBookingView';

// Dashboard Components
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { BookingsView } from './components/dashboard/BookingsView';
import { ServicesView } from './components/dashboard/ServicesView';
import { AvailabilityView } from './components/dashboard/AvailabilityView';
import { CustomersView } from './components/dashboard/CustomersView';
import { BusinessProfileView } from './components/dashboard/BusinessProfileView';
import { SettingsView } from './components/dashboard/SettingsView';

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

  const handleLogout = () => {
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
        <CustomerBookingView
          businessSlug={customerSlug}
          onNavigate={handleNavigate}
        />
      )}

      {currentView === 'dashboard' && (
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
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        businesses={businesses}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
