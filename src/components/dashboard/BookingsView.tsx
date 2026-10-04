import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Mail, 
  Phone,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Business, Booking, BookingStatus } from '../../types';
import { StorageService } from '../../services/storage';

interface BookingsViewProps {
  business: Business;
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  business,
  bookings,
  onUpdateStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBookingForNotes, setSelectedBookingForNotes] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchesSearch = 
        b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.customerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchTerm]);

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
    let text = `Hi ${booking.customerName}, this is ${business.name}. Regarding your appointment for ${booking.serviceName} on ${booking.date} at ${booking.timeSlot} (Ref #${booking.bookingReference}): `;
    if (booking.status === 'confirmed') {
      text += `Your appointment is confirmed! Please let us know if you need directions to our location at ${business.address}.`;
    } else {
      text += `We have noted your booking request. We look forward to seeing you.`;
    }
    return StorageService.getWhatsAppLink(rawNumber, text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Bookings & Appointments
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your schedule, confirm incoming requests, and contact clients via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 font-mono">
            {filteredBookings.length} bookings found
          </span>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, phone, service, or ref..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-950"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 rounded-xl">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-white text-neutral-950 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-800">No bookings match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Try adjusting your search terms or status filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Ref & Customer</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-right">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-neutral-400 font-semibold">
                          #{b.bookingReference}
                        </span>
                      </div>
                      <div className="font-bold text-neutral-950 text-sm mt-0.5">
                        {b.customerName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        {b.customerPhone}
                      </div>
                      {b.customerMessage && (
                        <button
                          onClick={() => setSelectedBookingForNotes(b)}
                          className="mt-1 text-[11px] text-neutral-600 hover:text-neutral-900 inline-flex items-center gap-1 underline"
                        >
                          <FileText className="w-3 h-3 text-neutral-400" />
                          <span>View note</span>
                        </button>
                      )}
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 truncate max-w-[200px]">
                        {b.serviceName}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono tabular-nums mt-0.5">
                        {b.currencySymbol} {b.servicePrice.toLocaleString()} · {b.serviceDuration}m
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-neutral-950 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{b.date}</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 font-mono mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{b.timeSlot}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(b.status)}
                    </td>

                    {/* Contact & WhatsApp */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getWhatsAppMessageUrl(b) ? (
                          <a
                            href={getWhatsAppMessageUrl(b)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Chat with ${b.customerName} on WhatsApp`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-neutral-400">No WhatsApp</span>
                        )}
                        {b.customerEmail && (
                          <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                            {b.customerEmail}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Management Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {b.status !== 'confirmed' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'confirmed')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold transition-colors"
                            title="Confirm appointment"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status !== 'completed' && b.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'completed')}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] font-semibold transition-colors"
                            title="Mark appointment completed"
                          >
                            Complete
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'cancelled')}
                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded-lg text-[11px] font-semibold transition-colors"
                            title="Cancel and release slot"
                          >
                            Cancel
                          </button>
                        )}
                        {b.status === 'cancelled' && (
                          <button
                            onClick={() => onUpdateStatus(b.id, 'pending')}
                            className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 rounded-lg text-[11px] font-medium transition-colors"
                            title="Restore to pending"
                          >
                            Restore
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

      {/* Note Modal */}
      {selectedBookingForNotes && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-neutral-900 text-base">Customer Note</h3>
                <p className="text-xs text-neutral-500">
                  {selectedBookingForNotes.customerName} (#{selectedBookingForNotes.bookingReference})
                </p>
              </div>
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-neutral-50 rounded-xl text-xs text-neutral-700 leading-relaxed border border-neutral-200">
              "{selectedBookingForNotes.customerMessage}"
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedBookingForNotes(null)}
                className="px-4 py-2 bg-neutral-950 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
