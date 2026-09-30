import React, { useState } from 'react';
import { User, Business } from '../../types';
import { Mail, Lock, User as UserIcon, Building, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  businesses: Business[];
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  businesses,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all required fields.');
        return;
      }
      // Simulate account creation
      const newUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        email: email.trim(),
        businessId: businesses[0]?.id || 'biz_apex_fitness',
        role: 'owner',
      };
      onLoginSuccess(newUser);
      onClose();
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password.');
        return;
      }
      // Simulate login
      const matched = businesses.find((b) => b.email.toLowerCase() === email.toLowerCase());
      const loggedUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: matched ? `${matched.name} Owner` : 'Business Owner',
        email: email.trim(),
        businessId: matched?.id || businesses[0]?.id || 'biz_apex_fitness',
        role: 'owner',
      };
      onLoginSuccess(loggedUser);
      onClose();
    }
  };

  // Quick Demo Login Handler
  const handleQuickLogin = (biz: Business) => {
    const quickUser: User = {
      id: `usr_${biz.id}`,
      name: `${biz.name} (Manager)`,
      email: biz.email,
      businessId: biz.id,
      role: 'owner',
    };
    onLoginSuccess(quickUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1"
        >
          ✕
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center font-bold text-sm mx-auto mb-3">
            BF
          </div>
          <h2 className="text-xl font-bold text-neutral-950">
            {mode === 'login' ? 'Business Owner Login' : 'Create Business Account'}
          </h2>
          <p className="text-xs text-neutral-500">
            {mode === 'login'
              ? 'Access your appointment dashboard and booking settings'
              : 'Start receiving appointments from clients online today'}
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons for easy testing */}
        <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 space-y-2">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider text-center">
            ⚡ Quick Demo Sign In
          </div>
          <div className="grid grid-cols-1 gap-1.5 max-h-44 overflow-y-auto pr-1">
            {businesses.map((biz) => (
              <button
                key={biz.id}
                type="button"
                onClick={() => handleQuickLogin(biz)}
                className="w-full py-1.5 px-3 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 transition-colors flex items-center justify-between text-left"
              >
                <div className="truncate">
                  <span className="font-semibold text-neutral-900">{biz.name}</span>
                  <span className="text-[10px] text-neutral-400 block">{biz.city}</span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono shrink-0 ml-2">
                  Instant
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] text-neutral-400 font-medium">
            or continue with email
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Standard Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Coach Hamza"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Business Name
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Lahore Strength Lab"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@yourbusiness.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-semibold text-neutral-950 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-semibold text-neutral-950 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
