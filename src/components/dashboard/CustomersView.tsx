import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Calendar, 
  Clock, 
  Phone, 
  Mail,
  UserCheck
} from 'lucide-react';
import { Business } from '../../types';
import { StorageService } from '../../services/storage';

interface CustomersViewProps {
  business: Business;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ business }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const customers = useMemo(() => {
    const list = StorageService.getCustomers(business.id);
    if (!searchTerm.trim()) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [business.id, searchTerm]);

  const getWhatsAppMessageUrl = (phone: string, name: string) => {
    const cleanNumber = phone.replace(/[^\d]/g, '');
    const text = `Hi ${name}, this is ${business.name}. We hope you are doing well!`;
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Customer Directory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            View repeat clients, track total booking histories, and reach out directly.
          </p>
        </div>

        <div className="text-xs text-neutral-500 font-mono">
          {customers.length} unique clients
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-800">No customers found</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Customers will automatically appear here once they complete a booking request.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Total Bookings</th>
                  <th className="py-3 px-4">Total Value</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Quick Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-neutral-950 text-sm flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{c.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-neutral-800">{c.phone}</div>
                      {c.email && (
                        <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
                          {c.email}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-neutral-900">
                      {c.totalBookings} {c.totalBookings === 1 ? 'booking' : 'bookings'}
                    </td>

                    <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-neutral-950">
                      {c.currencySymbol} {c.totalSpent.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600 font-mono">
                      {c.lastBookingDate}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <a
                        href={getWhatsAppMessageUrl(c.phone, c.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
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
