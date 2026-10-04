import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Clock, 
  Sparkles, 
  Check, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Business, Service } from '../../types';
import { ASSETS } from '../../services/storage';

interface ServicesViewProps {
  business: Business;
  services: Service[];
  onAddService: (service: Omit<Service, 'id'>) => void;
  onUpdateService: (service: Service) => void;
  onDeleteService: (id: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  business,
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(3000);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState<string>(business.coverUrl || ASSETS.hero);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice(3000);
    setDurationMinutes(45);
    setCategory('General');
    setImageUrl(business.coverUrl || ASSETS.hero);
    setIsActive(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDescription(service.description);
    setPrice(service.price);
    setDurationMinutes(service.durationMinutes);
    setCategory(service.category || 'General');
    setImageUrl(service.imageUrl || business.coverUrl);
    setIsActive(service.isActive);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a service name.');
      return;
    }

    if (price < 0) {
      setError('Price cannot be negative.');
      return;
    }

    if (durationMinutes <= 0) {
      setError('Duration must be greater than zero.');
      return;
    }

    if (editingService) {
      onUpdateService({
        ...editingService,
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        category: category.trim(),
        imageUrl,
        isActive,
      });
    } else {
      onAddService({
        businessId: business.id,
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        currency: business.currency,
        currencySymbol: business.currencySymbol,
        durationMinutes: Number(durationMinutes),
        imageUrl,
        isActive,
        category: category.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Services & Pricing
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure the menu of services customers can choose from your booking link.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center">
          <Sparkles className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-800">No services yet</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            Add your first service so customers can start scheduling appointments.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold"
          >
            Create Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                srv.isActive ? 'border-neutral-200' : 'border-neutral-200 opacity-60'
              }`}
            >
              <div>
                <div className="h-36 bg-neutral-100 relative overflow-hidden">
                  <img
                    src={srv.imageUrl || business.coverUrl}
                    alt={srv.name}
                    width={360}
                    height={144}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        srv.isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-neutral-400 text-white'
                      }`}
                    >
                      {srv.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {srv.category && (
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-semibold bg-neutral-900/80 text-white px-2 py-0.5 rounded backdrop-blur-xs">
                        {srv.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-neutral-950 text-sm line-clamp-1">
                      {srv.name}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2 min-h-[32px]">
                    {srv.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      {srv.durationMinutes} mins
                    </span>
                    <span className="font-bold text-neutral-950 font-mono text-sm tabular-nums">
                      {srv.currencySymbol} {srv.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => openEditModal(srv)}
                  className="text-neutral-700 hover:text-neutral-950 font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${srv.name}"?`)) {
                      onDeleteService(srv.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h2 className="text-base font-bold text-neutral-950">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 1-on-1 Fitness Coaching"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Category (Optional)
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Personal Training, Haircut, Consultation"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Price ({business.currencySymbol}) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 font-mono focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Duration (Minutes) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what is included in this service, preparation required, or benefits..."
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                ></textarea>
              </div>

              {/* Image Preset Chooser */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Select Visual Image
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Fitness', url: ASSETS.fitness },
                    { label: 'Barber', url: ASSETS.barber },
                    { label: 'Dental', url: ASSETS.dental },
                    { label: 'Studio', url: ASSETS.hero },
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Select preset image ${p.label}`}
                      onClick={() => setImageUrl(p.url)}
                      className={`h-16 rounded-xl overflow-hidden border-2 relative transition-all ${
                        imageUrl === p.url ? 'border-neutral-950 ring-2 ring-neutral-950/20' : 'border-neutral-200'
                      }`}
                    >
                      <img src={p.url} alt={p.label} width={80} height={64} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-neutral-950/80 text-[10px] text-white py-0.5 text-center">
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-neutral-950 border-neutral-300 focus:ring-neutral-900"
                />
                <label htmlFor="isActive" className="font-semibold text-neutral-800">
                  Active (Display on customer booking page)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl font-semibold shadow-xs"
                >
                  {editingService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
