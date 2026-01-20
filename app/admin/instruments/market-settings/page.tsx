"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

import { useMarketSchedule } from "@/queries/marketSchedule.queries";
import { MarketSegment } from "@/services/marketSchedule.service";

import GlobalLoader from "../../components/ui/GlobalLoader";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Toast } from "../../components/ui/Toast";
import Toggle from "../../components/ui/Toggle";
import MarketScheduleEditModal from "../../components/market-setting/MarketScheduleEditModal";


const SEGMENTS: MarketSegment[] = ["forex", "metal", "crypto", "indexes"];

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
        <h1 className="text-3xl font-bold">Market Schedule</h1>
        <p className="text-[var(--text-muted)]">Segment wise market configuration</p>
      </div>

      {/* SEGMENTS */}
      <div className="flex gap-2">
        {SEGMENTS.map(s => (
          <button
            key={s}
            onClick={() => setSegment(s)}
            className={`btn ${segment === s ? "btn-primary" : "btn-ghost"} capitalize`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* SUMMARY CARD */}
      <div className="card-elevated space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Current Configuration</h3>

          <button
            onClick={() => setEditOpen(true)}
            className="btn btn-primary"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>

        {/* TABLE VIEW */}
        <table className="table">
          <tbody>
            <tr>
              <th>Open Time</th>
              <td>{data.openTime}</td>
            </tr>
            <tr>
              <th>Close Time</th>
              <td>{data.closeTime}</td>
            </tr>
            <tr>
              <th>Timezone</th>
              <td>{data.timezone}</td>
            </tr>
            <tr>
              <th>Weekly Off</th>
              <td>{data.weeklyOff.join(", ") || "-"}</td>
            </tr>
            <tr>
              <th>Holidays</th>
              <td>{data.holidays.join(", ") || "-"}</td>
            </tr>
            <tr>
              <th>Saturday Close</th>
              <td>{data.dayOverrides?.SATURDAY?.closeTime || "-"}</td>
            </tr>
            <tr>
              <th>Date Overrides</th>
              <td>{data.dateOverrides ? JSON.stringify(data.dateOverrides) : "-"}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>
                <span className={`pill ${data.isEnabled ? "pill-success" : "pill-danger"}`}>
                  {data.isEnabled ? "Enabled" : "Disabled"}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
