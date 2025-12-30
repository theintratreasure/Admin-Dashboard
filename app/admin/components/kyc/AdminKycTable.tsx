"use client";

import { AdminKyc } from "@/services/kyc/kyc.types";

export default function AdminKycTable({
  list,
  onView,
}: {
  list: AdminKyc[];
  onView: (k: AdminKyc) => void;
}) {
  return (
    <div className="space-y-3">
      {/* TABLE HEADER */}
      <div className="mb-3 grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_auto] px-5 text-[11px] uppercase tracking-wider text-[var(--text-muted)]">
        <span>User</span>
        <span>Email</span>
        <span>Document</span>
        <span>Status</span>
        <span>Date</span>
        <span />
      </div>

      {list.map((u) => (
        <div
          key={u._id}
          className="
            grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_auto]
            items-center gap-4 rounded-2xl
            border border-[var(--card-border)]
            bg-[var(--card-bg)] px-5 py-4
            hover:shadow-[0_12px_35px_rgba(0,0,0,0.18)]
          "
        >
          <div>
            <p className="text-sm font-semibold">{u.user.name}</p>
            <p className="text-xs text-[var(--text-muted)]">
              {u.user.phone}
            </p>
          </div>

          <p className="truncate text-sm">{u.user.email}</p>

          <p className="text-sm font-medium">
            {u.documentType.replace("_", " ")}
          </p>

          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
            {u.status}
          </span>

          <p className="text-xs text-[var(--text-muted)]">
            {new Date(u.createdAt).toLocaleDateString()}
          </p>

          {/* ✅ SINGLE BUTTON ONLY */}
          <button
            onClick={() => onView(u)}
            className="
              rounded-full bg-[var(--primary)]/10
              px-4 py-2 text-xs font-medium
              text-[var(--primary)]
              hover:bg-[var(--primary)] hover:text-white
            "
          >
            View
          </button>
        </div>
      ))}
    </div>
  );
}
