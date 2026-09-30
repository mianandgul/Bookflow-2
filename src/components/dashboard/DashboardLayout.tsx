import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Sparkles, 
  Clock, 
  Users, 
  Building, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Share2,
  Check
} from 'lucide-react';
import { Business, DashboardTab, User, AppView } from '../../types';

interface DashboardLayoutProps {
  business: Business;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (view: AppView, slug?: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  business,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  onNavigate,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const navItems: { tab: DashboardTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { tab: 'services', label: 'Services', icon: Sparkles },
    { tab: 'availability', label: 'Availability', icon: Clock },
    { tab: 'customers', label: 'Customers', icon: Users },
    { tab: 'profile', label: 'Business Profile', icon: Building },
    { tab: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleCopyLink = () => {
    const url = `${window.location.origin}/business/${business.slug}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-7 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center font-bold text-xs">
            BF
          </div>
          <div>
            <div className="font-bold text-neutral-900 text-xs truncate max-w-[140px]">
              {business.name}
            </div>
            <div className="text-[10px] text-neutral-500">Business Dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('customer_booking', business.slug)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            title="View Public Booking Page"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  onTabChange(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <button
              onClick={handleCopyLink}
              className="text-xs text-neutral-600 flex items-center gap-1.5 py-1 px-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Copy Booking Link'}</span>
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-red-600 flex items-center gap-1 py-1 px-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (260px) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200 shrink-0 sticky top-7 h-[calc(100vh-28px)] justify-between p-4">
        <div className="space-y-6">
          {/* Business Brand Card */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200">
            <div className="flex items-center gap-3">
              <img
                src={business.coverUrl || business.logoUrl}
                alt={business.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-neutral-950 text-xs truncate">
                  {business.name}
                </div>
                <div className="text-[11px] text-neutral-500 truncate capitalize">
                  {business.city}, {business.country}
                </div>
              </div>
            </div>

            {/* Quick Share Link */}
            <div className="mt-3 pt-3 border-t border-neutral-200 flex items-center justify-between gap-1">
              <button
                onClick={() => onNavigate('customer_booking', business.slug)}
                className="text-[11px] font-semibold text-neutral-800 hover:text-neutral-950 flex items-center gap-1 truncate"
                title="Open Public Booking Page"
              >
                <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                <span className="truncate">/{business.slug}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 flex items-center gap-1 shrink-0"
                title="Copy public link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-2.5 h-2.5 text-neutral-500" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => onTabChange(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="truncate">
            <div className="font-semibold text-neutral-900 truncate">
              {currentUser?.name || 'Business Owner'}
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              {currentUser?.email || business.email}
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-neutral-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Viewport Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
