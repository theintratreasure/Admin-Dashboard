"use client";

import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { AccountPlan } from "@/types/accountPlan";
import { useEffect, useRef, useState, type ReactNode } from "react";
import DragScroll from "@/app/admin/components/ui/DragScroll";

interface Props {
  data: AccountPlan[];
  onEdit: (plan: AccountPlan) => void;
  onDelete: (id: string) => void;
}

export default function AccountPlanTable({ data, onEdit, onDelete }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mobileTrackRef.current) {
      mobileTrackRef.current.scrollLeft = 0;
    }
  }, [data.length]);

  const FieldRow = ({
    label,
    value,
    valueClassName = "font-medium",
  }: {
    label: string;
    value: ReactNode;
    valueClassName?: string;
  }) => (
    <div className="flex items-center gap-2 py-2">
      <span className="text-[var(--text-muted)] whitespace-nowrap">{label}</span>
      <span className="flex-1 h-[3px] bg-[radial-gradient(circle,_var(--card-border)_1.4px,_transparent_1.6px)] bg-[length:10px_3px] opacity-50" />
      <span className={`text-right whitespace-nowrap text-[var(--text-main)] ${valueClassName}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] max-w-7xl p-2 sm:p-3">
      {/* Desktop table wrapper */}
      <div className="hidden lg:block">
        <DragScroll className="max-h-[520px] overflow-auto rounded-lg bg-[var(--surface)]">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[var(--table-header-bg)] text-[var(--text-muted)] text-xs uppercase sticky top-0 z-10 border-b border-[var(--border-subtle)]">
              <tr>
                <th className="bg-[var(--table-header-bg)] px-4 py-3 text-left font-semibold">
                  Name
                </th>
                <th className="px-3 py-3 text-left font-semibold">Min Deposit</th>
                <th className="px-3 py-3 text-left font-semibold">Min Lot</th>
                <th className="px-3 py-3 text-left font-semibold">Spread</th>
                <th className="px-3 py-3 text-left font-semibold">Spread Type</th>
                <th className="px-3 py-3 text-left font-semibold">Commission</th>
                <th className="px-3 py-3 text-left font-semibold">
                  Comm / Lot
                </th>
                <th className="px-3 py-3 text-left font-semibold">
                  Referral Reward
                </th>
                <th className="px-3 py-3 text-left font-semibold">Leverage</th>
                <th className="px-3 py-3 text-left font-semibold">Demo</th>
                <th className="px-3 py-3 text-left font-semibold">Swap</th>
                <th className="px-3 py-3 text-left font-semibold">Status</th>
                <th className="px-3 py-3 text-left font-semibold">Guidance</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {data.map((p, idx) => (
                <tr
                  key={p._id}
                  className={`transition-colors ${
                    idx % 2 === 0
                      ? "bg-[var(--table-row-bg)]"
                      : "bg-[var(--table-row-alt-bg)]"
                  } hover:bg-[var(--hover-bg)]`}
                >
                  {/* NAME (sticky first column) */}
                  <td className="bg-inherit px-4 py-3 font-medium whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{p.name}</span>
                      <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                        ID: {p._id.slice(0, 8)}...
                      </span>
                    </div>
                  </td>

                  {/* MIN DEPOSIT */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="font-medium">
                      $ {p.minDeposit.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* LOT */}
                  <td className="px-3 py-3">{p.minLotSize}</td>

                  {/* SPREAD */}
                  <td className="px-3 py-3">{p.spreadPips}</td>

                  {/* SPREAD TYPE */}
                  <td className="px-3 py-3">
                    <span className="inline-flex rounded-full bg-[var(--chip-bg)] px-2.5 py-1 text-[11px] font-medium">
                      {p.spread_type}
                    </span>
                  </td>

                  {/* COMMISSION */}
                  <td className="px-3 py-3">{p.commission}</td>

                  {/* COMMISSION PER LOT */}
                  <td className="px-3 py-3">{p.commission_per_lot}</td>

                  {/* REFERRAL REWARD */}
                  <td className="px-3 py-3">
                    {typeof p.referral_reward_amount === "number"
                      ? `$ ${p.referral_reward_amount.toLocaleString("en-IN")}`
                      : "--"}
                  </td>

                  {/* LEVERAGE */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {p.max_leverage ? `1:${p.max_leverage}` : "Unlimited"}
                  </td>

                  {/* DEMO */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
                        p.is_demo_allowed
                          ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-500"
                          : "border-[var(--border-subtle)] bg-[var(--chip-bg)] text-[var(--text-muted)]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.is_demo_allowed ? "bg-emerald-500" : "bg-[var(--border-subtle)]"
                        }`}
                      />
                      {p.is_demo_allowed ? "Allowed" : "Not allowed"}
                    </span>
                  </td>

                  {/* SWAP */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap ${
                        p.swap_enabled
                          ? "border-amber-500/40 bg-amber-500/5 text-amber-500"
                          : "border-[var(--border-subtle)] bg-[var(--chip-bg)] text-[var(--text-muted)]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.swap_enabled ? "bg-amber-500" : "bg-[var(--border-subtle)]"
                        }`}
                      />
                      {p.swap_enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {p.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 whitespace-nowrap">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--danger)] whitespace-nowrap">
                        <XCircle size={14} /> Inactive
                      </span>
                    )}
                  </td>

                  {/* GUIDANCE */}
                  <td className="px-3 py-3 max-w-[260px]">
                    <p className="truncate text-xs text-[var(--text-muted)]">
                      {p.guidance || "No internal notes added"}
                    </p>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--chip-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text)] transition-colors"
                        onClick={() => onEdit(p)}
                        aria-label="Edit plan"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-[var(--danger-soft-hover)] transition-colors"
                        onClick={() => onDelete(p._id)}
                        aria-label="Delete plan"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={14}
                    className="px-4 py-10 text-center text-sm text-[var(--text-muted)]"
                  >
                    No account plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DragScroll>

        {/* Footer bar */}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-5 py-3 text-xs text-[var(--text-muted)]">
          <span>Showing {data.length} plans</span>
          <span>Scroll inside table to view all columns</span>
        </div>
      </div>

            {/* Mobile / tablet: card layout */}
      <div className="block lg:hidden p-2 text-[14px] text-[var(--text-main)] space-y-3">
        {data.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border-subtle)] px-4 py-6 text-center text-sm text-[var(--text-muted)]">
            No account plans found.
          </div>
        )}

        <div
          ref={mobileTrackRef}
          onScroll={() => {
            const el = mobileTrackRef.current;
            if (!el) return;
            const index = Math.round(el.scrollLeft / el.clientWidth);
            setActiveIndex(Math.min(data.length - 1, Math.max(0, index)));
          }}
          className="flex overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.map((p) => (
            <div
              key={p._id}
              className="w-full shrink-0 snap-start rounded-lg border border-[var(--card-border)]/70 bg-[var(--surface-elevated)] p-3 my-2 mx-2 text-[var(--text-main)]"
            >
              <div className="flex items-center justify-between gap-2 pb-2 relative border-b border-[var(--card-border)]/70 -mx-3 px-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[13px] font-medium ${
                      p.is_demo_allowed
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-[var(--chip-bg)] text-[var(--text-muted)]"
                    }`}
                  >
                    {p.is_demo_allowed ? "Demo" : "Live"}
                  </span>
                  <span className="text-[15px] font-semibold break-words min-w-0">
                    {p.name}
                  </span>
                </div>
                <div className="relative">
                  <button
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-[var(--chip-bg)] text-[var(--text-muted)]"
                    aria-label="Plan options"
                    onClick={() =>
                      setOpenMenuId((prev) => (prev === p._id ? null : p._id))
                    }
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openMenuId === p._id && (
                    <div className="absolute right-0 top-10 w-32 rounded-lg border border-[var(--border-subtle)] bg-[var(--card-bg)] shadow-lg z-30">
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[var(--hover-bg)]"
                        onClick={() => {
                          onEdit(p);
                          setOpenMenuId(null);
                        }}
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--danger)] hover:bg-[var(--danger-soft)]"
                        onClick={() => {
                          onDelete(p._id);
                          setOpenMenuId(null);
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2 text-[13px]">
                <FieldRow
                  label="Min Deposit"
                  value={`$${p.minDeposit.toLocaleString("en-IN")}`}
                />
                <FieldRow label="Min Lot" value={p.minLotSize} />
                <FieldRow label="Spread" value={`${p.spreadPips} (${p.spread_type})`} />
                <FieldRow
                  label="Commission"
                  value={`${p.commission} / ${p.commission_per_lot}`}
                />
                <FieldRow label="Commission / Lot" value={p.commission_per_lot} />
                <FieldRow
                  label="Referral Reward"
                  value={
                    typeof p.referral_reward_amount === "number"
                      ? `$${p.referral_reward_amount.toLocaleString("en-IN")}`
                      : "--"
                  }
                />
                <FieldRow
                  label="Leverage"
                  value={p.max_leverage ? `1:${p.max_leverage}` : "Unlimited"}
                />
                <FieldRow
                  label="Demo"
                  value={p.is_demo_allowed ? "Allowed" : "Off"}
                />
                <FieldRow
                  label="Swap"
                  value={p.swap_enabled ? "On" : "Off"}
                />
                <FieldRow
                  label="Status"
                  value={p.isActive ? "Active" : "Inactive"}
                  valueClassName={`font-medium ${p.isActive ? "text-emerald-600" : "text-[var(--danger)]"}`}
                />
              </div>

              {/* actions handled in the 3-dot menu */}
            </div>
          ))}
        </div>

        {data.length > 1 && (
          <div className="flex items-center justify-center pt-2 text-[11px] text-[var(--text-muted)]">
            {activeIndex + 1} / {data.length}
          </div>
        )}
      </div>
    </div>
  );
}



