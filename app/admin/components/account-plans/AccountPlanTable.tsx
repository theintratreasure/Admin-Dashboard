"use client";

import {
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AccountPlan } from "@/types/accountPlan";

interface Props {
  data: AccountPlan[];
  onEdit: (plan: AccountPlan) => void;
  onDelete: (id: string) => void;
}

export default function AccountPlanTable({ data, onEdit, onDelete }: Props) {
  return (
    <div className="card-elevated border border-[var(--border-subtle)] rounded-2xl bg-[var(--surface)] shadow-sm max-w-7xl">
      {/* Header + count */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Account Plans
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Configure trading conditions, commission & leverage for each plan.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-[var(--chip-bg)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
          Total plans: {data.length}
        </span>
      </div>

      {/* Desktop table wrapper */}
      <div className="hidden lg:block">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[var(--table-header-bg)] text-[var(--text-muted)] text-xs uppercase sticky top-0 z-10">
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

                  {/* LEVERAGE */}
                  <td className="px-3 py-3 whitespace-nowrap">
                    {p.max_leverage ? `1:${p.max_leverage}` : "Unlimited"}
                  </td>

                  {/* DEMO */}
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
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
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
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
                  <td className="px-3 py-3">
                    {p.isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                        <CheckCircle size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--danger)]">
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
                    colSpan={13}
                    className="px-4 py-10 text-center text-sm text-[var(--text-muted)]"
                  >
                    No account plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-5 py-3 text-xs text-[var(--text-muted)]">
          <span>Showing {data.length} plans</span>
          <span>Scroll inside table to view all columns</span>
        </div>
      </div>

      {/* Mobile / tablet: card layout */}
      <div className="block lg:hidden px-3 py-3 space-y-3 max-h-[520px] overflow-auto">
        {data.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--border-subtle)] px-4 py-6 text-center text-sm text-[var(--text-muted)]">
            No account plans found.
          </div>
        )}

        {data.map((p) => (
          <div
            key={p._id}
            className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Min Deposit: ${p.minDeposit.toLocaleString("en-IN")} · Min Lot:{" "}
                  {p.minLotSize}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
                  p.isActive
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-[var(--danger-soft)] text-[var(--danger)]"
                }`}
              >
                {p.isActive ? (
                  <>
                    <CheckCircle size={12} /> Active
                  </>
                ) : (
                  <>
                    <XCircle size={12} /> Inactive
                  </>
                )}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[var(--text-muted)]">
              <div>
                <span className="block text-[10px] uppercase tracking-wide">
                  Spread
                </span>
                <span className="text-xs font-medium">
                  {p.spreadPips} ({p.spread_type})
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wide">
                  Commission
                </span>
                <span className="text-xs font-medium">
                  {p.commission} / {p.commission_per_lot} per lot
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wide">
                  Leverage
                </span>
                <span className="text-xs font-medium">
                  {p.max_leverage ? `1:${p.max_leverage}` : "Unlimited"}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wide">
                  Demo / Swap
                </span>
                <span className="text-xs font-medium">
                  {p.is_demo_allowed ? "Demo allowed" : "Demo off"} ·{" "}
                  {p.swap_enabled ? "Swap on" : "Swap off"}
                </span>
              </div>
            </div>

            {p.guidance && (
              <p className="mt-3 text-xs text-[var(--text-muted)] line-clamp-2">
                {p.guidance}
              </p>
            )}

            <div className="mt-3 flex items-center justify-end gap-1.5">
              <button
                className="inline-flex items-center gap-1 rounded-full bg-[var(--chip-bg)] px-3 py-1.5 text-[11px] font-medium text-[var(--text)]"
                onClick={() => onEdit(p)}
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                className="inline-flex items-center gap-1 rounded-full bg-[var(--danger-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--danger)]"
                onClick={() => onDelete(p._id)}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
