import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  RefreshCw, 
  Download, 
  Bell, 
  MessageSquare, 
  ShieldCheck, 
  Check, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Business, Booking } from '../../types';
import { StorageService } from '../../services/storage';

interface SettingsViewProps {
  business: Business;
  bookings: Booking[];
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  business,
  bookings,
  onResetData,
}) => {
  const [leadTime, setLeadTime] = useState('1'); // hours
  const [requirePhone, setRequirePhone] = useState(true);
  const [autoWhatsAppPrompt, setAutoWhatsAppPrompt] = useState(true);
  const [savedSettings, setSavedSettings] = useState(false);

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bookings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bookflow_bookings_${business.slug}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Account & Booking Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure booking rules, automated behavior, and data options.
          </p>
        </div>

        {savedSettings && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Preferences saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Booking Rules Card */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="font-bold text-neutral-900 text-sm">Booking Window & Policy</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Minimum Notice Required (Advance Booking)
              </label>
              <select
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                <option value="0">Same-day instant (No minimum notice)</option>
                <option value="1">At least 1 hour in advance</option>
                <option value="2">At least 2 hours in advance</option>
                <option value="6">At least 6 hours in advance</option>
                <option value="24">At least 24 hours in advance (1 day)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Booking Confirmation Mode
              </label>
              <select className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900">
                <option value="manual">Manual review (Recommended for small studios)</option>
                <option value="auto">Instant auto-confirm</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="reqPhone"
                checked={requirePhone}
                onChange={(e) => setRequirePhone(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-950 border-neutral-300"
              />
              <label htmlFor="reqPhone" className="font-semibold text-neutral-800">
                Require client WhatsApp/phone number on booking
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="promptWhatsApp"
                checked={autoWhatsAppPrompt}
                onChange={(e) => setAutoWhatsAppPrompt(e.target.checked)}
                className="w-4 h-4 rounded text-neutral-950 border-neutral-300"
              />
              <label htmlFor="promptWhatsApp" className="font-semibold text-neutral-800">
                Show prominent "Contact on WhatsApp" button on booking receipt
              </label>
            </div>
          </div>
        </div>

        {/* Pro Plan Banner */}
        <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-sm">BookFlow Pro (MVP Preview)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded">
                All Features Unlocked
              </span>
            </div>
            <p className="text-neutral-400 text-xs max-w-xl">
              Unlimited services, anti-double booking sync, multiple business profiles, and direct WhatsApp customer chat are enabled on this instance.
            </p>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-neutral-900 text-sm">Supabase Cloud Database & Storage</h2>
              <p className="text-neutral-500 text-xs mt-0.5">
                Cloud persistence, multi-tenant isolation with Row Level Security, and automated anti-double booking.
              </p>
            </div>
            {StorageService.isCloudConnected() ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Connected to Supabase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 border border-neutral-200 rounded-full font-semibold text-[11px]">
                ⚡ Demo Mode (Local Cache)
              </span>
            )}
          </div>

          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2 text-neutral-700">
            <div className="font-semibold text-xs text-neutral-900">Configured Cloud Tables:</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-neutral-600">
              <div className="bg-white p-2 rounded border border-neutral-200">✓ public.businesses</div>
              <div className="bg-white p-2 rounded border border-neutral-200">✓ public.profiles</div>
              <div className="bg-white p-2 rounded border border-neutral-200">✓ public.services</div>
              <div className="bg-white p-2 rounded border border-neutral-200">✓ public.business_hours</div>
              <div className="bg-white p-2 rounded border border-neutral-200">✓ public.blocked_times</div>
              <div className="bg-white p-2 rounded border border-neutral-200">✓ public.bookings</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={async () => {
                if (!StorageService.isCloudConnected()) {
                  alert('To sync with Supabase Cloud, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables (.env / Vercel settings).');
                  return;
                }
                const res = await StorageService.migrateLocalDataToSupabase();
                alert(res.message);
              }}
              className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Local Data to Supabase</span>
            </button>

            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 font-semibold text-neutral-800 flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Export Appointments (JSON)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('This will reset all bookings and services back to initial sample state. Continue?')) {
                  onResetData();
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Demo Data</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
