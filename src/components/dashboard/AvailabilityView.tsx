import React, { useState } from 'react';
import { 
  Clock, 
  Check, 
  AlertCircle, 
  Calendar, 
  Coffee, 
  ShieldCheck 
} from 'lucide-react';
import { Business, BusinessAvailability, DayOfWeek, DayAvailability } from '../../types';
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
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-neutral-200 bg-neutral-50/50">
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Weekly Operating Schedule
            </span>
          </div>

          <div className="divide-y divide-neutral-100">
            {days.map(({ key, label }) => {
              const dayConfig = availability.schedule[key] || {
                day: key,
                isAvailable: true,
                startTime: '09:00',
                endTime: '18:00',
                hasBreak: false,
              };

              return (
                <div
                  key={key}
                  className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                    !dayConfig.isAvailable ? 'bg-neutral-50/50 opacity-60' : 'bg-white'
                  }`}
                >
                  {/* Day Label & Availability Toggle */}
                  <div className="flex items-center gap-3 w-40 shrink-0">
                    <input
                      type="checkbox"
                      id={`avail-${key}`}
                      checked={dayConfig.isAvailable}
                      onChange={(e) => handleDayChange(key, 'isAvailable', e.target.checked)}
                      className="w-4 h-4 rounded text-neutral-950 border-neutral-300 focus:ring-neutral-900"
                    />
                    <label
                      htmlFor={`avail-${key}`}
                      className="font-bold text-neutral-900 text-xs sm:text-sm cursor-pointer"
                    >
                      {label}
                    </label>
                  </div>

                  {dayConfig.isAvailable ? (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      {/* Operating Hours */}
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-neutral-500 font-medium">Hours:</span>
                        <input
                          type="time"
                          value={dayConfig.startTime}
                          onChange={(e) => handleDayChange(key, 'startTime', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-neutral-200 text-xs font-mono"
                        />
                        <span className="text-neutral-400">to</span>
                        <input
                          type="time"
                          value={dayConfig.endTime}
                          onChange={(e) => handleDayChange(key, 'endTime', e.target.value)}
                          className="px-2 py-1 rounded-lg border border-neutral-200 text-xs font-mono"
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

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Save Availability Settings
          </button>
        </div>
      </form>
    </div>
  );
};
