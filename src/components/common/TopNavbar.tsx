import React from 'react';
import { Calendar } from 'lucide-react';
import { AppView, User } from '../../types';

interface TopNavbarProps {
  onNavigate: (view: AppView, slug?: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-7 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-neutral-800 transition-colors">
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-950 font-sans">
            BookFlow
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <a href="#problem" className="hover:text-neutral-950 transition-colors">
            The Problem
          </a>
          <a href="#solution" className="hover:text-neutral-950 transition-colors">
            Solution
          </a>
          <a href="#how-it-works" className="hover:text-neutral-950 transition-colors">
            How It Works
          </a>
          <a href="#features" className="hover:text-neutral-950 transition-colors">
            Features
          </a>
          <a href="#pricing" className="hover:text-neutral-950 transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-neutral-950 transition-colors">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors whitespace-nowrap"
              >
                Owner Dashboard
              </button>
              <button
                onClick={onLogout}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-800 transition-colors px-2 py-1"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 transition-colors whitespace-nowrap"
              >
                Log In
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
              >
                Create Your Booking Page
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
