import React from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  ArrowUpRight, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Business, Booking, Service, BookingStatus, DashboardTab } from '../../types';
import { StorageService } from '../../services/storage';

interface OverviewViewProps {
  business: Business;
  bookings: Booking[];
  services: Service[];
  onTabChange: (tab: DashboardTab) => void;
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
  onNavigatePublic: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  business,
  bookings,
  services,
  onTabChange,
  onUpdateStatus,
  onNavigatePublic,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Today's Bookings
  const todayBookings = bookings.filter((b) => b.date === todayStr);

  // Upcoming Bookings (after today, non-cancelled)
  const upcomingBookings = bookings.filter(
    (b) => b.date > todayStr && b.status !== 'cancelled'
  );

  // Total unique customers
  const customers = StorageService.getCustomers(business.id);

  // Active services
  const activeServices = services.filter((s) => s.isActive);

  // Recent 5 bookings
  const recentBookings = [...bookings].slice(0, 5);

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>Confirmed</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            <AlertCircle className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            <span>Completed</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 line-through">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
    }
  };

  const getWhatsAppMessageUrl = (booking: Booking) => {
    const rawNumber = booking.customerPhone;
    const cleanNumber = rawNumber.replace(/[^\d]/g, '');
    let text = `Hi ${booking.customerName}, regarding your booking #${booking.bookingReference} for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot} at ${business.name}: `;
    if (booking.status === 'confirmed') {
      text += `Your appointment is confirmed! We look forward to seeing you.`;
    } else {
      text += `We have received your booking and are confirming details.`;
    }
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Overview
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Welcome back. Here is what is happening with your bookings today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigatePublic}
            className="px-3 py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>View Public Booking Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </button>
          <button
            onClick={() => onTabChange('services')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 rounded-xl transition-colors shadow-xs"
          >
            + Add Service
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Today's Bookings</span>
            <Calendar className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-950 font-mono tabular-nums">
            {todayBookings.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {todayBookings.filter((b) => b.status === 'confirmed').length} confirmed
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Upcoming Bookings</span>
            <Clock className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-950 font-mono tabular-nums">
            {upcomingBookings.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Scheduled across next 14 days
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Total Customers</span>
            <Users className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-950 font-mono tabular-nums">
            {customers.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            In your customer directory
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-2">
            <span className="text-xs font-medium">Active Services</span>
            <Sparkles className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-extrabold text-neutral-950 font-mono tabular-nums">
            {activeServices.length}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            Live on your booking link
          </div>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-950">Recent Appointments</h2>
            <p className="text-xs text-neutral-500">Latest incoming requests and confirmed bookings</p>
          </div>
          <button
            onClick={() => onTabChange('bookings')}
            className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            No bookings yet. Share your booking link to receive appointments!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-950">{b.customerName}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{b.customerPhone}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900 truncate max-w-[200px]">
                        {b.serviceName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono tabular-nums">
                        {b.currencySymbol} {b.servicePrice.toLocaleString()} · {b.serviceDuration}m
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-900">{b.date}</div>
                      <div className="text-[11px] text-neutral-500 font-mono">{b.timeSlot}</div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <a
                        href={getWhatsAppMessageUrl(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                        title="Chat with customer on WhatsApp"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'confirmed')}
                            className="px-2.5 py-1 bg-neutral-950 hover:bg-neutral-800 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'completed')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-medium transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'cancelled')}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px] font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
