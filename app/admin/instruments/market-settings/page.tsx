"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bitcoin,
  CalendarDays,
  CandlestickChart,
  Clock3,
  Globe,
  Landmark,
  Layers,
  Pencil,
  RefreshCcw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useMarketSchedule, useUpdateMarketSchedule } from "@/queries/marketSchedule.queries";
import type { MarketSchedule, MarketSegment } from "@/services/marketSchedule.service";

import GlobalLoader from "../../components/ui/GlobalLoader";
import { Toast } from "../../components/ui/Toast";
import Toggle from "../../components/ui/Toggle";
import MarketScheduleEditModal from "../../components/market-setting/MarketScheduleEditModal";

const SEGMENTS: MarketSegment[] = ["forex", "metal", "crypto", "indexes"];

const SEGMENT_META: Record<
  MarketSegment,
  { label: string; description: string; color: string; Icon: LucideIcon }
> = {
  forex: {
    label: "Forex",
    description: "Currency market schedule and weekly off settings",
    color: "text-blue-600",
    Icon: Landmark,
  },
  metal: {
    label: "Metal",
    description: "Precious metal trading hours and holiday rules",
    color: "text-emerald-600",
    Icon: Layers,
  },
  crypto: {
    label: "Crypto",
    description: "Crypto market hours and exception dates",
    color: "text-amber-600",
    Icon: Bitcoin,
  },
  indexes: {
    label: "Indices",
    description: "Index sessions, overrides and early close",
    color: "text-purple-600",
    Icon: CandlestickChart,
  },
};

const formatUpdatedAt = (timestamp: number) => {
  if (!timestamp) return "--";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatZonedNow = (date: Date, timezone?: string) => {
  try {
    if (!timezone) return date.toLocaleString("en-GB");
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  } catch {
    return date.toLocaleString("en-GB");
  }
};

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

const buildPreview = (items: string[], limit = 3) => {
  const filtered = items.filter(Boolean);
  if (!filtered.length) return "--";
  const slice = filtered.slice(0, limit);
  const suffix = filtered.length > limit ? ` +${filtered.length - limit}` : "";
  return slice.join(", ") + suffix;
};

const resolveOverridesCount = (data: MarketSchedule | undefined) =>
  data?.dateOverrides ? Object.keys(data.dateOverrides).length : 0;

export default function MarketSchedulePage() {
  const [segment, setSegment] = useState<MarketSegment>("forex");
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [now, setNow] = useState(() => new Date());

  const scheduleQuery = useMarketSchedule(segment);
  const updateMutation = useUpdateMarketSchedule(segment);
  const data = scheduleQuery.data;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const segmentMeta = SEGMENT_META[segment];
  const SegmentIcon = segmentMeta.Icon;

  const marketNow = useMemo(
    () => formatZonedNow(now, data?.timezone),
    [data?.timezone, now]
  );

  const weeklyOffPreview = useMemo(
    () => buildPreview((data?.weeklyOff ?? []).map((d) => toDayShort(d)), 4),
    [data?.weeklyOff]
  );

  const holidayPreview = useMemo(
    () => buildPreview(data?.holidays ?? [], 3),
    [data?.holidays]
  );

  const overridesCount = resolveOverridesCount(data);
  const saturdayClose = data?.dayOverrides?.SATURDAY?.closeTime ?? "--";

  const handleEnabledChange = async (next: boolean) => {
    if (!data) return;
    try {
      await updateMutation.mutateAsync({ isEnabled: next });
      setToast(next ? "Market enabled." : "Market disabled.");
    } catch (err: unknown) {
      setToast(extractError(err) || "Failed to update status.");
    }
  };

  if (scheduleQuery.isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <GlobalLoader />
      </div>
    );
  }

  if (scheduleQuery.isError) {
    const message = extractError(scheduleQuery.error) || "Failed to load market settings.";
    return (
      <div className="container-pad max-w-6xl mx-auto">
        <div className="card-elevated border border-rose-300/40 bg-rose-500/5">
          <p className="text-sm font-semibold text-rose-700">Something went wrong</p>
          <p className="text-sm text-rose-600 mt-1">{message}</p>
          <button
            type="button"
            onClick={() => scheduleQuery.refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-rose-300 bg-white px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-10 text-center text-[var(--danger)]">No schedule found</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-pad max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Market Settings
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
            Manage trading hours, timezone, weekly off-days, holidays and early close overrides.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full lg:w-auto">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <Clock3 size={14} />
              Live clock
            </p>
            <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--foreground)]">
              {marketNow}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1 break-all">
              {data.timezone || "--"}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-2">
              Last sync: {formatUpdatedAt(scheduleQuery.dataUpdatedAt)}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
                Segment
              </p>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${
                  data.isEnabled
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    data.isEnabled ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {data.isEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-xl border border-[var(--card-border)] bg-[var(--hover-bg)] p-2 ${segmentMeta.color}`}>
                <SegmentIcon size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-base font-semibold text-[var(--foreground)]">
                  {segmentMeta.label}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  {segmentMeta.description}
                </p>
              </div>
            </div>

            <Toggle
              label="Market enabled"
              value={Boolean(data.isEnabled)}
              disabled={updateMutation.isPending}
              onChange={handleEnabledChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SEGMENTS.map((s) => {
          const meta = SEGMENT_META[s];
          const Icon = meta.Icon;
          const active = segment === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSegment(s)}
              className={`rounded-2xl border p-3 text-left transition ${
                active
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} className={meta.color} />
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {meta.label}
                </p>
              </div>
              <p className="mt-1 text-[11px] text-[var(--text-muted)] line-clamp-2">
                {meta.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="card-elevated shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Current Configuration
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Configure trading hours, holiday calendar and special close rules.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => scheduleQuery.refetch()}
              disabled={scheduleQuery.isFetching}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-sm font-semibold hover:bg-[var(--hover-bg)] disabled:opacity-60"
            >
              <RefreshCcw size={16} className={scheduleQuery.isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            >
              <Pencil size={16} />
              Edit
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <Clock3 size={14} />
              Trading window
            </p>
            <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--foreground)]">
              {data.openTime} → {data.closeTime}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Daily session</p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <Globe size={14} />
              Timezone
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)] break-all">
              {data.timezone || "--"}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Used for holidays & overrides</p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <CalendarDays size={14} />
              Weekly off-days
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
              {data.weeklyOff?.length ? `${data.weeklyOff.length} day(s)` : "None"}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{weeklyOffPreview}</p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <CalendarDays size={14} />
              Holidays
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
              {data.holidays?.length ? `${data.holidays.length} date(s)` : "None"}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{holidayPreview}</p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <Clock3 size={14} />
              Saturday close
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)] tabular-nums">
              {saturdayClose}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Optional early close override</p>
          </div>

          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)] inline-flex items-center gap-2">
              <CalendarDays size={14} />
              Date overrides
            </p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
              {overridesCount ? `${overridesCount} override(s)` : "None"}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {overridesCount
                ? "Use Holidays & Overrides to manage early close."
                : "No special date rules added."}
            </p>
          </div>
        </div>
      </div>

      {editOpen && (
        <MarketScheduleEditModal
          segment={segment}
          data={data}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            setToast("Market settings updated.");
          }}
        />
      )}

      {toast && <Toast message={toast} />}
    </motion.div>
  );
}

function toDayShort(value: string) {
  const normalized = value.trim().toUpperCase();
  if (!normalized) return "--";
  return normalized.slice(0, 3);
}
