"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";

import Modal from "../ui/Modal";
import Toggle from "../ui/Toggle";

import { useUpdateMarketSchedule } from "@/queries/marketSchedule.queries";
import type { MarketSchedule, MarketSegment } from "@/services/marketSchedule.service";

const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type DayName = (typeof DAYS)[number];
type TimeStyle = "ampm" | "24h";

const DAY_SHORT: Record<DayName, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

const isAmpmTime = (value: string) => /(?:\s|^)(am|pm)\b/i.test(value);

const detectTimeStyle = (value: string): TimeStyle =>
  isAmpmTime(value) ? "ampm" : "24h";

const parseTimeTo24 = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match12 = trimmed.match(/^(\d{1,2}):([0-5]\d)\s*([AaPp][Mm])$/);
  if (match12) {
    let hours = Number(match12[1]);
    const minutes = match12[2];
    const meridiem = match12[3].toLowerCase();

    if (!Number.isFinite(hours) || hours < 1 || hours > 12) return null;
    if (hours === 12) hours = 0;
    if (meridiem === "pm") hours += 12;

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  }

  const match24 = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (match24) {
    const hours = String(Number(match24[1])).padStart(2, "0");
    return `${hours}:${match24[2]}`;
  }

  return null;
};

const formatTimeFrom24 = (value24: string, style: TimeStyle) => {
  const match = value24.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return value24;
  if (style === "24h") return value24;

  const hours24 = Number(match[1]);
  const minutes = match[2];
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${String(hours12).padStart(2, "0")}:${minutes} ${suffix}`;
};

const uniqSort = (values: string[]) =>
  Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort();

const extractError = (err: unknown) => {
  if (typeof err !== "object" || err === null) return "";
  const record = err as Record<string, unknown>;
  if (typeof record.message === "string" && record.message.trim()) return record.message;

  const response = record.response;
  if (typeof response === "object" && response !== null) {
    const responseData = (response as Record<string, unknown>).data;
    if (typeof responseData === "object" && responseData !== null) {
      const message = (responseData as Record<string, unknown>).message;
      if (typeof message === "string" && message.trim()) return message;
    }
  }

  return "";
};

const TimeField = ({
  label,
  value,
  onChange,
  preview,
  hint,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  preview?: string;
  hint?: string;
  disabled?: boolean;
}) => {
  return (
    <div className="space-y-1">
      <label className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-[var(--input-bg)] border-[var(--input-border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--glow)] ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <Clock3 size={16} className="text-[var(--text-muted)] shrink-0" />
        <input
          type="time"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-[var(--foreground)]"
        />
        {preview ? (
          <span className="text-[10px] font-semibold text-[var(--text-muted)] tabular-nums">
            {preview}
          </span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-[var(--text-muted)]">{hint}</p> : null}
    </div>
  );
};

export default function MarketScheduleEditModal({
  segment,
  data,
  onClose,
  onSaved,
}: {
  segment: MarketSegment;
  data: MarketSchedule;
  onClose: () => void;
  onSaved: () => void;
}) {
  const updateMutation = useUpdateMarketSchedule(segment);

  const timeStyle = useMemo<TimeStyle>(() => {
    const sampleTimes = [
      data.openTime ?? "",
      data.closeTime ?? "",
      data.dayOverrides?.SATURDAY?.closeTime ?? "",
      ...Object.values(data.dateOverrides ?? {}).map((entry) => entry?.closeTime ?? ""),
    ];
    if (sampleTimes.some((value) => typeof value === "string" && isAmpmTime(value))) {
      return "ampm";
    }
    return detectTimeStyle(data.openTime ?? "");
  }, [data.closeTime, data.dateOverrides, data.dayOverrides, data.openTime]);

  const [activeTab, setActiveTab] = useState<"schedule" | "exceptions">("schedule");
  const [formError, setFormError] = useState("");

  const [openTime, setOpenTime] = useState(() => parseTimeTo24(data.openTime) ?? "");
  const [closeTime, setCloseTime] = useState(() => parseTimeTo24(data.closeTime) ?? "");
  const [timezone, setTimezone] = useState(() => data.timezone ?? "");
  const [isEnabled, setIsEnabled] = useState(() => Boolean(data.isEnabled));

  const [weeklyOff, setWeeklyOff] = useState<string[]>(() => data.weeklyOff || []);
  const [holidays, setHolidays] = useState<string[]>(() => data.holidays || []);

  const [satClose, setSatClose] = useState(
    () => parseTimeTo24(data.dayOverrides?.SATURDAY?.closeTime ?? "") ?? ""
  );

  const [dateOverrides, setDateOverrides] = useState<Record<string, { closeTime: string }>>(
    () => {
      const incoming = data.dateOverrides ?? {};
      return Object.keys(incoming).reduce(
        (acc, date) => {
          acc[date] = { closeTime: parseTimeTo24(incoming[date]?.closeTime ?? "") ?? "" };
          return acc;
        },
        {} as Record<string, { closeTime: string }>
      );
    }
  );

  const [newHoliday, setNewHoliday] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDateClose, setNewDateClose] = useState("");

  const sortedHolidays = useMemo(() => uniqSort(holidays), [holidays]);
  const sortedOverrides = useMemo(
    () =>
      Object.entries(dateOverrides)
        .filter((entry) => entry[0] && entry[1]?.closeTime)
        .sort((a, b) => a[0].localeCompare(b[0])),
    [dateOverrides]
  );

  const toggleWeeklyOff = (day: DayName) => {
    setWeeklyOff((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const addHoliday = () => {
    if (!newHoliday) return;
    setHolidays((prev) => uniqSort([...prev, newHoliday]));
    setNewHoliday("");
  };

  const removeHoliday = (value: string) => {
    setHolidays((prev) => prev.filter((date) => date !== value));
  };

  const removeOverride = (date: string) => {
    setDateOverrides((prev) => {
      const copy = { ...prev };
      delete copy[date];
      return copy;
    });
  };

  const addDateOverride = () => {
    if (!newDate || !newDateClose) return;
    setDateOverrides((prev) => ({ ...prev, [newDate]: { closeTime: newDateClose } }));
    setNewDate("");
    setNewDateClose("");
  };

  const saveChanges = async () => {
    setFormError("");

    if (!openTime || !closeTime) {
      setActiveTab("schedule");
      setFormError("Please select both open and close time.");
      return;
    }

    if (!timezone.trim()) {
      setActiveTab("schedule");
      setFormError("Timezone is required.");
      return;
    }

    const formattedOverrides = Object.entries(dateOverrides).reduce(
      (acc, [date, entry]) => {
        if (!date || !entry?.closeTime) return acc;
        acc[date] = { closeTime: formatTimeFrom24(entry.closeTime, timeStyle) };
        return acc;
      },
      {} as Record<string, { closeTime?: string }>
    );

    try {
      await updateMutation.mutateAsync({
        openTime: formatTimeFrom24(openTime, timeStyle),
        closeTime: formatTimeFrom24(closeTime, timeStyle),
        weeklyOff,
        holidays: uniqSort(holidays),
        timezone: timezone.trim(),
        isEnabled,
        dayOverrides: satClose
          ? { SATURDAY: { closeTime: formatTimeFrom24(satClose, timeStyle) } }
          : undefined,
        dateOverrides: Object.keys(formattedOverrides).length ? formattedOverrides : undefined,
      });
      onSaved();
    } catch (err: unknown) {
      setFormError(extractError(err) || "Failed to update market settings. Please try again.");
    }
  };

  return (
    <Modal
      title="Edit Market Settings"
      open
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-2 text-sm font-semibold hover:bg-[var(--hover-bg)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveChanges}
            disabled={updateMutation.isPending}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-[var(--text-muted)]">Segment</p>
            <p className="text-sm font-semibold capitalize text-[var(--foreground)]">
              {segment}
            </p>
          </div>

          <div className="inline-flex w-full sm:w-auto items-center rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "schedule"
                  ? "bg-[var(--card-bg)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("exceptions")}
              className={`flex-1 sm:flex-none rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                activeTab === "exceptions"
                  ? "bg-[var(--card-bg)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              Holidays & Overrides
            </button>
          </div>
        </div>

        {formError ? (
          <div className="rounded-xl border border-rose-300/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-700">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <p className="min-w-0">{formError}</p>
            </div>
          </div>
        ) : null}

        {activeTab === "schedule" ? (
          <>
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Trading Hours
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Set the daily open/close window. Overnight sessions are supported.
                  </p>
                </div>
                <span className="pill">{timeStyle === "ampm" ? "AM/PM" : "24H"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TimeField
                  label="Open time"
                  value={openTime}
                  onChange={setOpenTime}
                  preview={openTime ? formatTimeFrom24(openTime, timeStyle) : undefined}
                  disabled={updateMutation.isPending}
                />
                <TimeField
                  label="Close time"
                  value={closeTime}
                  onChange={setCloseTime}
                  preview={closeTime ? formatTimeFrom24(closeTime, timeStyle) : undefined}
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-[var(--text-muted)]" />
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Timezone
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-[var(--input-bg)] border-[var(--input-border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--glow)]">
                <Globe size={16} className="text-[var(--text-muted)] shrink-0" />
                <input
                  value={timezone}
                  disabled={updateMutation.isPending}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="e.g., Asia/Kolkata"
                  list="timezone-list"
                  className="w-full bg-transparent outline-none text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                />
                <datalist id="timezone-list">
                  <option value="UTC" />
                  <option value="Asia/Kolkata" />
                  <option value="Asia/Dubai" />
                  <option value="Asia/Karachi" />
                  <option value="Europe/London" />
                  <option value="America/New_York" />
                  <option value="America/Chicago" />
                  <option value="America/Los_Angeles" />
                </datalist>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Weekly off-days, holidays and overrides are evaluated in this timezone.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Weekly Off
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Markets remain closed on selected days.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeeklyOff([])}
                  disabled={updateMutation.isPending || weeklyOff.length === 0}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--foreground)] disabled:opacity-60"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const active = weeklyOff.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleWeeklyOff(day)}
                      disabled={updateMutation.isPending}
                      aria-pressed={active}
                      title={day}
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        active
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                          : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                      }`}
                    >
                      {DAY_SHORT[day]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <Toggle
                label={
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isEnabled ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                    />
                    Market Enabled
                  </span>
                }
                value={isEnabled}
                disabled={updateMutation.isPending}
                onChange={setIsEnabled}
              />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    Holidays
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Add specific dates when the market should remain closed.
                  </p>
                </div>
                {sortedHolidays.length ? <span className="pill">{sortedHolidays.length}</span> : null}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 rounded-xl border px-3 py-2 bg-[var(--input-bg)] border-[var(--input-border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--glow)]">
                  <CalendarDays size={16} className="text-[var(--text-muted)] shrink-0" />
                  <input
                    type="date"
                    value={newHoliday}
                    disabled={updateMutation.isPending}
                    onChange={(e) => setNewHoliday(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm text-[var(--foreground)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={addHoliday}
                  disabled={updateMutation.isPending || !newHoliday}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {sortedHolidays.length ? (
                <div className="flex flex-wrap gap-2">
                  {sortedHolidays.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--hover-bg)] px-3 py-1 text-xs font-semibold text-[var(--foreground)]"
                    >
                      <CalendarDays size={14} className="text-[var(--text-muted)]" />
                      <span className="tabular-nums">{h}</span>
                      <button
                        type="button"
                        onClick={() => removeHoliday(h)}
                        disabled={updateMutation.isPending}
                        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5 disabled:opacity-60"
                        aria-label="Remove holiday"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">No holidays added yet.</p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Overrides
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Set early close times for specific days or dates.
                </p>
              </div>

              <TimeField
                label="Saturday close time (optional)"
                value={satClose}
                onChange={setSatClose}
                preview={satClose ? formatTimeFrom24(satClose, timeStyle) : undefined}
                hint="Leave empty to use the default close time."
                disabled={updateMutation.isPending}
              />

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                  Date override (optional)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                  <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-[var(--input-bg)] border-[var(--input-border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--glow)]">
                    <CalendarDays size={16} className="text-[var(--text-muted)] shrink-0" />
                    <input
                      type="date"
                      value={newDate}
                      disabled={updateMutation.isPending}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-[var(--foreground)]"
                    />
                  </div>

                  <div className="flex items-center gap-2 rounded-xl border px-3 py-2 bg-[var(--input-bg)] border-[var(--input-border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--glow)]">
                    <Clock3 size={16} className="text-[var(--text-muted)] shrink-0" />
                    <input
                      type="time"
                      value={newDateClose}
                      disabled={updateMutation.isPending}
                      onChange={(e) => setNewDateClose(e.target.value)}
                      className="w-full bg-transparent outline-none text-sm text-[var(--foreground)]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addDateOverride}
                    disabled={updateMutation.isPending || !newDate || !newDateClose}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] disabled:opacity-60"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {sortedOverrides.length ? (
                  <div className="overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]">
                    {sortedOverrides.map(([date, obj], idx) => (
                      <div
                        key={date}
                        className={`flex items-center justify-between gap-3 px-4 py-3 text-sm ${
                          idx === 0 ? "" : "border-t border-[var(--card-border)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-[var(--foreground)]">
                          <CalendarDays size={14} className="text-[var(--text-muted)]" />
                          <span className="font-semibold tabular-nums">{date}</span>
                          <span className="text-[var(--text-muted)]">→</span>
                          <span className="tabular-nums">
                            {formatTimeFrom24(obj.closeTime, timeStyle)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeOverride(date)}
                          disabled={updateMutation.isPending}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-muted)] hover:bg-[var(--hover-bg)] disabled:opacity-60"
                        >
                          <Trash2 size={13} />
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-muted)]">
                    No date overrides added yet.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

