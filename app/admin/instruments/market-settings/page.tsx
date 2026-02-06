"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Bitcoin, Landmark, Layers, CandlestickChart } from "lucide-react";

import { useMarketSchedule } from "@/queries/marketSchedule.queries";
import { MarketSegment } from "@/services/marketSchedule.service";

import GlobalLoader from "../../components/ui/GlobalLoader";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Toast } from "../../components/ui/Toast";
import Toggle from "../../components/ui/Toggle";
import MarketScheduleEditModal from "../../components/market-setting/MarketScheduleEditModal";


const SEGMENTS: MarketSegment[] = ["forex", "metal", "crypto", "indexes"];

const SEGMENT_META: Record<MarketSegment, { label: string; color: string; Icon: any }> = {
  forex: { label: "Forex", color: "text-blue-600", Icon: Landmark },
  metal: { label: "Metal", color: "text-emerald-600", Icon: Layers },
  crypto: { label: "Crypto", color: "text-amber-600", Icon: Bitcoin },
  indexes: { label: "Indices", color: "text-purple-600", Icon: CandlestickChart },
};

export default function MarketSchedulePage() {
  const [segment, setSegment] = useState<MarketSegment>("forex");
  const [editOpen, setEditOpen] = useState(false);
  const [toast, setToast] = useState("");

  const scheduleQuery = useMarketSchedule(segment);
  const data = scheduleQuery.data;

  if (scheduleQuery.isLoading) {
    return <div className="py-20 flex justify-center"><GlobalLoader /></div>;
  }

  if (!data) {
    return <div className="py-10 text-center text-[var(--danger)]">No schedule found</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container-pad max-w-6xl mx-auto space-y-6"
    >
      {/* HEADER */}
      <div>
        <h1 className="text-[15px] sm:text-3xl font-bold">Market Schedule</h1>
        <p className="text-[11px] sm:text-base text-[var(--text-muted)]">
          Segment wise market configuration
        </p>
      </div>

      {/* SEGMENTS */}
      <div className="flex flex-wrap items-center">
        {SEGMENTS.map((s, idx) => {
          const meta = SEGMENT_META[s];
          return (
            <button
              key={s}
              onClick={() => setSegment(s)}
              className={`px-3 py-1.5 border text-xs sm:text-sm inline-flex items-center gap-1.5 rounded-none ${
                idx > 0 ? "-ml-px" : ""
              } ${
              segment === s
                  ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--hover-bg)]"
                  : "border-[var(--card-border)] text-[var(--text-muted)]"
            }`}
            >
              <meta.Icon size={12} className={meta.color} />
              {meta.label}
            </button>
          );
        })}
      </div>

      {/* SUMMARY CARD */}
      <div className="card-elevated space-y-4 shadow-none">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm sm:text-lg">Current Configuration</h3>

          <button
            onClick={() => setEditOpen(true)}
            className="btn btn-primary"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between border-b border-[var(--card-border)] py-2">
            <span className="text-[var(--text-muted)]">Open Time</span>
            <span className="font-medium">{data.openTime}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--card-border)] py-2">
            <span className="text-[var(--text-muted)]">Close Time</span>
            <span className="font-medium">{data.closeTime}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--card-border)] py-2">
            <span className="text-[var(--text-muted)]">Timezone</span>
            <span className="font-medium">{data.timezone}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--card-border)] py-2">
            <span className="text-[var(--text-muted)]">Weekly Off</span>
            <span className="font-medium">{data.weeklyOff.join(", ") || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--card-border)] py-2">
            <span className="text-[var(--text-muted)]">Holidays</span>
            <span className="font-medium">{data.holidays.join(", ") || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--card-border)] py-2">
            <span className="text-[var(--text-muted)]">Saturday Close</span>
            <span className="font-medium">{data.dayOverrides?.SATURDAY?.closeTime || "-"}</span>
          </div>
          <div className="flex justify-between border-b border-[var(--card-border)] py-2 md:col-span-2">
            <span className="text-[var(--text-muted)]">Date Overrides</span>
            <span className="font-medium">
              {data.dateOverrides ? JSON.stringify(data.dateOverrides) : "-"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--text-muted)]">Status</span>
            <span className={data.isEnabled ? "text-green-700" : "text-red-700"}>
              {data.isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editOpen && (
        <MarketScheduleEditModal
          segment={segment}
          data={data}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false);
            setToast("Market schedule updated");
          }}
        />
      )}

      {toast && <Toast message={toast} />}
    </motion.div>
  );
}
