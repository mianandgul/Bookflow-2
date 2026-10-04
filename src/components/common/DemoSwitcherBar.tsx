import React from 'react';
import { Business, AppView } from '../../types';
import { Building2, ExternalLink, RefreshCw, LayoutDashboard, Compass } from 'lucide-react';

interface DemoSwitcherBarProps {
  currentView: AppView;
  onNavigate: (view: AppView, slug?: string) => void;
  businesses: Business[];
  activeBusiness: Business;
  onSelectBusiness: (bizId: string) => void;
  onResetData: () => void;
}

export const DemoSwitcherBar: React.FC<DemoSwitcherBarProps> = ({
  currentView,
  onNavigate,
  businesses,
  activeBusiness,
  onSelectBusiness,
  onResetData,
}) => {
  return (
    <div className="bg-neutral-900 text-neutral-200 border-b border-neutral-800 text-xs py-1.5 px-4 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold tracking-wide">BOOKFLOW MVP</span>
          </div>

          <span className="text-neutral-500 hidden sm:inline">|</span>

          {/* Quick View Switches */}
          <div className="flex items-center gap-1 bg-neutral-800/80 p-0.5 rounded-md">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentView === 'landing'
                  ? 'bg-white text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Landing Page
              </span>
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-white text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Business Dashboard
              </span>
            </button>
            <button
              onClick={() => onNavigate('customer_booking', activeBusiness.slug)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                currentView === 'customer_booking'
                  ? 'bg-white text-neutral-950 font-semibold shadow-xs'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                Customer Booking Page
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Business Selector */}
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
            <label htmlFor="active-business-select" className="text-neutral-400 hidden md:inline">Business:</label>
            <select
              id="active-business-select"
              aria-label="Select active business"
              value={activeBusiness.id}
              onChange={(e) => onSelectBusiness(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white rounded px-2 py-0.5 text-xs focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {businesses.map((biz) => (
                <option key={biz.id} value={biz.id}>
                  {biz.name} ({biz.city})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={onResetData}
            title="Reset sample bookings and services to initial state"
            aria-label="Reset sample bookings and services to initial state"
            className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded hover:bg-neutral-800 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
