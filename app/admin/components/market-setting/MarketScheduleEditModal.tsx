"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

import PremiumInput from "../ui/PremiumInput";
import Toggle from "../ui/Toggle";

import { useUpdateMarketSchedule } from "@/queries/marketSchedule.queries";
import { MarketSegment } from "@/services/marketSchedule.service";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function MarketScheduleEditModal({
  segment,
  data,
  onClose,
  onSaved,
}: {
  segment: MarketSegment;
  data: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const updateMutation = useUpdateMarketSchedule(segment);

  /* ===== STATES (ALL PUT FIELDS) ===== */
  const [openTime, setOpenTime] = useState(data.openTime);
  const [closeTime, setCloseTime] = useState(data.closeTime);
  const [timezone, setTimezone] = useState(data.timezone);
  const [isEnabled, setIsEnabled] = useState(data.isEnabled);

  const [weeklyOff, setWeeklyOff] = useState<string[]>(data.weeklyOff || []);
  const [holidays, setHolidays] = useState<string[]>(data.holidays || []);

  const [satClose, setSatClose] = useState(
    data.dayOverrides?.SATURDAY?.closeTime || ""
  );

  const [dateOverrides, setDateOverrides] = useState<
    Record<string, { closeTime: string }>
  >(data.dateOverrides || {});

  const [newHoliday, setNewHoliday] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDateClose, setNewDateClose] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[95%] max-w-2xl rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)]">
          <h2 className="text-lg font-semibold">Edit Market Schedule</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 space-y-6">

          {/* TIME */}
          <div className="grid md:grid-cols-2 gap-4">
            <PremiumInput label="Open Time" value={openTime} onChange={setOpenTime} />
            <PremiumInput label="Close Time" value={closeTime} onChange={setCloseTime} />
          </div>

          {/* TIMEZONE */}
          <PremiumInput
            label="Timezone"
            value={timezone}
            onChange={setTimezone}
          />

          {/* WEEKLY OFF */}
          <div>
            <p className="text-sm mb-2 text-[var(--text-muted)]">Weekly Off</p>
            <div className="flex flex-wrap gap-3">
              {DAYS.map((day) => (
                <label key={day} className="flex gap-2 items-center text-sm">
                  <input
                    type="checkbox"
                    checked={weeklyOff.includes(day)}
                    onChange={() =>
                      setWeeklyOff((prev) =>
                        prev.includes(day)
                          ? prev.filter((d) => d !== day)
                          : [...prev, day]
                      )
                    }
                  />
                  {day}
                </label>
              ))}
            </div>
          </div>

          {/* HOLIDAYS */}
          <div>
            <p className="text-sm mb-2 text-[var(--text-muted)]">Holidays</p>
            <div className="flex gap-2">
              <input
                type="date"
                value={newHoliday}
                onChange={(e) => setNewHoliday(e.target.value)}
                className="input"
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!newHoliday) return;
                  setHolidays([...holidays, newHoliday]);
                  setNewHoliday("");
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {holidays.map((h) => (
                <div key={h} className="flex items-center justify-between pill">
                  {h}
                  <button onClick={() => setHolidays(holidays.filter(x => x !== h))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SATURDAY OVERRIDE */}
          <PremiumInput
            label="Saturday Close Time"
            value={satClose}
            onChange={setSatClose}
          />

          {/* DATE OVERRIDES */}
          <div>
            <p className="text-sm mb-2 text-[var(--text-muted)]">Date Overrides</p>

            <div className="grid md:grid-cols-3 gap-2">
              <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="input" />
              <input type="time" value={newDateClose} onChange={e => setNewDateClose(e.target.value)} className="input" />
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!newDate || !newDateClose) return;
                  setDateOverrides({
                    ...dateOverrides,
                    [newDate]: { closeTime: newDateClose },
                  });
                  setNewDate("");
                  setNewDateClose("");
                }}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="mt-2 space-y-1">
              {Object.entries(dateOverrides).map(([date, obj]) => (
                <div key={date} className="flex items-center justify-between pill">
                  {date} → {obj.closeTime}
                  <button
                    onClick={() => {
                      const copy = { ...dateOverrides };
                      delete copy[date];
                      setDateOverrides(copy);
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ENABLE */}
          <Toggle
            label="Market Enabled"
            value={isEnabled}
            onChange={setIsEnabled}
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--card-border)]">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>

          <button
            disabled={updateMutation.isPending}
            onClick={async () => {
              await updateMutation.mutateAsync({
                openTime,
                closeTime,
                weeklyOff,
                holidays,
                timezone,
                isEnabled,
                dayOverrides: satClose
                  ? { SATURDAY: { closeTime: satClose } }
                  : undefined,
                dateOverrides:
                  Object.keys(dateOverrides).length > 0
                    ? dateOverrides
                    : undefined,
              });
              onSaved();
            }}
            className="btn btn-primary"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
