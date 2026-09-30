import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  Check, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Business, BusinessCategory } from '../../types';
import { ASSETS } from '../../services/storage';

interface BusinessProfileViewProps {
  business: Business;
  onUpdateBusiness: (updated: Business) => void;
  onNavigatePublic: () => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  onUpdateBusiness,
  onNavigatePublic,
}) => {
  const [formData, setFormData] = useState<Business>({ ...business });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: { key: BusinessCategory; label: string }[] = [
    { key: 'fitness', label: 'Fitness & Gym' },
    { key: 'beauty', label: 'Beauty, Barbershop & Salon' },
    { key: 'healthcare', label: 'Healthcare, Clinic & Dental' },
    { key: 'education', label: 'Education & Tutors' },
    { key: 'professional', label: 'Professional Services & Consulting' },
    { key: 'automotive', label: 'Automotive & Detailing' },
    { key: 'other', label: 'Other Appointment Business' },
  ];

  const currencies = [
    { code: 'PKR', symbol: 'Rs.', label: 'Pakistani Rupee (PKR - Rs.)' },
    { code: 'USD', symbol: '$', label: 'US Dollar (USD - $)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (GBP - £)' },
    { code: 'EUR', symbol: '€', label: 'Euro (EUR - €)' },
    { code: 'AED', symbol: 'AED', label: 'UAE Dirham (AED)' },
    { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal (SAR)' },
    { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CAD)' },
  ];

  const handleChange = (field: keyof Business, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCurrencyChange = (code: string) => {
    const found = currencies.find((c) => c.code === code);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        currency: found.code,
        currencySymbol: found.symbol,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Business name cannot be empty.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Public link slug is required.');
      return;
    }

    // Clean slug format
    const cleanSlug = formData.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const updated = {
      ...formData,
      slug: cleanSlug,
      whatsappNumber: formData.whatsappNumber || formData.phone,
    };

    onUpdateBusiness(updated);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Business Profile & Public Page
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Update your business details, branding, contact info, and booking URL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {success && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profile updated!</span>
            </div>
          )}

          <button
            type="button"
            onClick={onNavigatePublic}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Preview Public Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Core Identity */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="font-bold text-neutral-900 text-sm">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Business Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as BusinessCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Short Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="e.g. Master haircuts & traditional grooming"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              About / Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Tell clients about your experience, qualifications, and salon/studio ambience..."
              className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            ></textarea>
          </div>

          {/* Public URL Slug */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Public Booking URL Slug
            </label>
            <div className="flex items-center">
              <span className="bg-neutral-100 border border-r-0 border-neutral-200 px-3 py-2.5 rounded-l-xl text-neutral-500 font-mono text-xs">
                bookflow.me/
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2.5 rounded-r-xl border border-neutral-200 font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              This is the unique link you share with customers on WhatsApp or Instagram.
            </p>
          </div>
        </div>

        {/* Currency & Financial Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="font-bold text-neutral-900 text-sm">Currency & Regional Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Display Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={formData.currencySymbol}
                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Contact & WhatsApp */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="font-bold text-neutral-900 text-sm">Contact & WhatsApp Integration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g. +92 300 8472910"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                WhatsApp Number <span className="text-neutral-400 font-normal">(With country code)</span>
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  placeholder="e.g. +923008472910"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 font-mono"
                />
              </div>
              <p className="text-[10px] text-neutral-400 mt-1">
                Customers will be routed here when clicking "Contact on WhatsApp".
              </p>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="e.g. contact@apexfitness.pk"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Instagram Handle
              </label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.instagram || ''}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="@yourbusiness"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h2 className="font-bold text-neutral-900 text-sm">Physical Location</h2>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              Street Address / Suite
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. Suite 402, Block L, Gulberg III"
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g. Lahore, Karachi, Islamabad, London"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="e.g. Pakistan, United Kingdom, USA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
          >
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
