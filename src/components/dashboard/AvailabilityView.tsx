import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Check, 
  AlertCircle, 
  Calendar, 
  Coffee, 
  ShieldCheck,
  Ban,
  Plus,
  Trash2,
  CalendarOff
} from 'lucide-react';
import { Business, BusinessAvailability, DayOfWeek, DayAvailability, BlockedTime } from '../../types';
import { StorageService } from '../../services/storage';

interface AvailabilityViewProps {
  business: Business;
  onAvailabilityUpdated: () => void;
}

export const AvailabilityView: React.FC<AvailabilityViewProps> = ({
  business,
  onAvailabilityUpdated,
}) => {
  const [availability, setAvailability] = useState<BusinessAvailability>(() => 
    StorageService.getAvailability(business.id)
  );
  const [slotInterval, setSlotInterval] = useState<number>(
    availability.slotIntervalMinutes || 30
  );
  const [blockedTimes, setBlockedTimes] = useState<BlockedTime[]>(() =>
    StorageService.getBlockedTimes(business.id)
  );

  // New Blocked Time Form State
  const [blockDate, setBlockDate] = useState<string>('');
  const [blockStartTime, setBlockStartTime] = useState<string>('09:00');
  const [blockEndTime, setBlockEndTime] = useState<string>('17:00');
  const [blockReason, setBlockReason] = useState<string>('');
  const [showAddBlock, setShowAddBlock] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setAvailability(StorageService.getAvailability(business.id));
    setBlockedTimes(StorageService.getBlockedTimes(business.id));
  }, [business.id]);

  const days: { key: DayOfWeek; label: string }[] = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const handleDayChange = (
    day: DayOfWeek, 
    field: keyof DayAvailability, 
    value: any
  ) => {
    setAvailability((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: BusinessAvailability = {
      ...availability,
      slotIntervalMinutes: slotInterval,
    };
    StorageService.saveAvailability(updated);
    setSaveSuccess(true);
    onAvailabilityUpdated();
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddBlockedTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;

    const newBlocked = StorageService.addBlockedTime({
      businessId: business.id,
      date: blockDate,
      startTime: blockStartTime,
      endTime: blockEndTime,
      reason: blockReason || 'Unavailable / Closed',
    });

    setBlockedTimes((prev) => [...prev, newBlocked]);
    setBlockDate('');
    setBlockReason('');
    setShowAddBlock(false);
    onAvailabilityUpdated();
  };

  const handleDeleteBlockedTime = (id: string) => {
    StorageService.deleteBlockedTime(business.id, id);
    setBlockedTimes((prev) => prev.filter((b) => b.id !== id));
    onAvailabilityUpdated();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-950">
            Availability & Working Hours
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Set your weekly working hours, lunch breaks, and unavailable days. Customers will only be able to book during these times.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Availability saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Global Slot Interval Setting */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-neutral-900 text-xs sm:text-sm">
              Booking Slot Interval
            </div>
            <p className="text-[11px] text-neutral-500">
              The time increment between available appointment slots shown to customers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[15, 30, 45, 60].map((int) => (
              <button
                key={int}
                type="button"
                onClick={() => setSlotInterval(int)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-colors border ${
                  slotInterval === int
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {int} min
              </button>
            ))}
          </div>
        </div>

        {/* Weekly Day Schedule Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-500" />
              <h2 className="font-bold text-xs sm:text-sm text-neutral-900">
                Weekly Business Hours
              </h2>
            </div>
            <span className="text-[11px] text-neutral-400">
              Active schedule for {business.name}
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {days.map(({ key, label }) => {
              const dayConfig = availability.schedule[key] || {
                day: key,
                isAvailable: false,
                startTime: '09:00',
                endTime: '18:00',
                hasBreak: false,
              };

              return (
                <div
                  key={key}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    dayConfig.isAvailable ? 'bg-white' : 'bg-neutral-50/60'
                  }`}
                >
                  {/* Day Toggle */}
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <input
                      type="checkbox"
                      id={`day-${key}`}
                      checked={dayConfig.isAvailable}
                      onChange={(e) => handleDayChange(key, 'isAvailable', e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-950 border-neutral-300 focus:ring-neutral-900"
                    />
                    <label
                      htmlFor={`day-${key}`}
                      className={`text-xs sm:text-sm font-bold cursor-pointer select-none ${
                        dayConfig.isAvailable ? 'text-neutral-900' : 'text-neutral-400'
                      }`}
                    >
                      {label}
                    </label>
                  </div>

                  {/* Active Hours */}
                  {dayConfig.isAvailable ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500 font-medium">Open:</span>
                        <input
                          type="time"
                          value={dayConfig.startTime}
                          onChange={(e) => handleDayChange(key, 'startTime', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                        />
                        <span className="text-neutral-400">–</span>
                        <input
                          type="time"
                          value={dayConfig.endTime}
                          onChange={(e) => handleDayChange(key, 'endTime', e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                        />
                      </div>

                      {/* Break Time Toggle & Inputs */}
                      <div className="flex items-center gap-2 pl-2 lg:border-l lg:border-neutral-200">
                        <input
                          type="checkbox"
                          id={`break-${key}`}
                          checked={dayConfig.hasBreak || false}
                          onChange={(e) => handleDayChange(key, 'hasBreak', e.target.checked)}
                          className="w-3.5 h-3.5 rounded text-neutral-950 border-neutral-300"
                        />
                        <label
                          htmlFor={`break-${key}`}
                          className="text-neutral-600 font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Coffee className="w-3.5 h-3.5 text-amber-600" />
                          <span>Break Time</span>
                        </label>

                        {dayConfig.hasBreak && (
                          <div className="flex items-center gap-1.5 ml-1">
                            <input
                              type="time"
                              value={dayConfig.breakStartTime || '13:00'}
                              onChange={(e) => handleDayChange(key, 'breakStartTime', e.target.value)}
                              className="px-2 py-1 rounded-lg border border-neutral-200 text-xs font-mono"
                            />
                            <span className="text-neutral-400">–</span>
                            <input
                              type="time"
                              value={dayConfig.breakEndTime || '14:00'}
                              onChange={(e) => handleDayChange(key, 'breakEndTime', e.target.value)}
                              className="px-2 py-1 rounded-lg border border-neutral-200 text-xs font-mono"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 italic">
                      Unavailable / Closed on {label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Hours Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Save Weekly Hours
          </button>
        </div>
      </form>

      {/* BLOCKED / UNAVAILABLE TIME MANAGEMENT SECTION */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-rose-500" />
            <div>
              <h2 className="font-bold text-xs sm:text-sm text-neutral-900">
                Blocked Dates & Special Closures
              </h2>
              <p className="text-[11px] text-neutral-500">
                Block specific calendar dates or time windows (holidays, staff absence, clinic cleaning).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowAddBlock(!showAddBlock)}
            className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddBlock ? 'Cancel' : 'Block Time Slot'}</span>
          </button>
        </div>

        {/* Add Blocked Time Form */}
        {showAddBlock && (
          <form onSubmit={handleAddBlockedTime} className="p-5 border-b border-neutral-200 bg-neutral-50/40 space-y-4">
            <div className="text-xs font-bold text-neutral-900">
              New Unavailable Period
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={blockDate}
                  onChange={(e) => setBlockDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">From Time</label>
                <input
                  type="time"
                  required
                  value={blockStartTime}
                  onChange={(e) => setBlockStartTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">To Time</label>
                <input
                  type="time"
                  required
                  value={blockEndTime}
                  onChange={(e) => setBlockEndTime(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-neutral-600 font-medium mb-1">Reason / Note</label>
                <input
                  type="text"
                  placeholder="e.g. Doctor away / Holiday"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddBlock(false)}
                className="px-3 py-1.5 border border-neutral-200 rounded-xl text-xs font-medium text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
              >
                Confirm Blocked Period
              </button>
            </div>
          </form>
        )}

        {/* List of Blocked Times */}
        <div className="p-4 sm:p-5">
          {blockedTimes.length === 0 ? (
            <div className="text-center py-6 text-neutral-400 text-xs">
              <CalendarOff className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
              <p>No blocked dates or special closures configured.</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Standard weekly business hours apply uninterrupted.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {blockedTimes.map((blk) => (
                <div
                  key={blk.id}
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{blk.date}</span>
                    </div>
                    <div className="font-mono text-[11px] text-neutral-600 mt-1">
                      {blk.startTime} – {blk.endTime}
                    </div>
                    {blk.reason && (
                      <div className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded mt-1.5 inline-block font-medium">
                        {blk.reason}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlockedTime(blk.id)}
                    className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove blocked period"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
