"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { AdminKyc } from "@/services/kyc/kyc.types";

type SortOrder = "asc" | "desc";

export default function AdminKycTable({
    list,
    onView,
}: {
    list: AdminKyc[];
    onView: (k: AdminKyc) => void;
}) {
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const sortedList = [...list].sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? da - db : db - da;
    });

    const toggleSort = () =>
        setSortOrder((p) => (p === "asc" ? "desc" : "asc"));

    const statusStyle = (status: AdminKyc["status"]) => {
        switch (status) {
            case "VERIFIED":
                return "bg-green-500/10 text-green-400";
            case "REJECTED":
                return "bg-red-500/10 text-red-400";
            case "PENDING":
            default:
                return "bg-amber-500/10 text-amber-400";
        }
    };

    return (
        <div className="relative -mx-2 overflow-x-auto">
            <div className="min-w-[900px] space-y-3 px-2">

                {/* ================= HEADER ================= */}
                <div
                    className="
          grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_auto]
          rounded-xl
          bg-[var(--hover-bg)]
          px-5 py-3
          text-[11px] font-semibold uppercase tracking-wider
          text-[var(--foreground)]
        "
                >
                    <span>User</span>
                    <span>Email</span>
                    <span>Document</span>
                    <span>Status</span>

                    {/* SORTABLE DATE */}
                    <button
                        onClick={toggleSort}
                        className="flex items-center gap-1 justify-start"
                    >
                        Date
                        {sortOrder === "asc" ? (
                            <ChevronUp size={14} />
                        ) : (
                            <ChevronDown size={14} />
                        )}
                    </button>
                    <span>
                        Action
                    </span>
                    <span />
                </div>

                {/* ================= ROWS ================= */}
                {sortedList.map((u) => (
                    <div
                        key={u._id}
                        className="
            grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr_auto]
            items-center gap-4
            rounded-2xl
            border border-[var(--card-border)]
            bg-[var(--card-bg)]
            px-5 py-4
            hover:bg-[var(--hover-bg)]
          "
                    >
                        {/* USER */}
                        <div>
                            <p className="text-sm font-semibold">{u.user.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">
                                {u.user.phone}
                            </p>
                        </div>

                        {/* EMAIL */}
                        <p className="truncate text-sm">{u.user.email}</p>

                        {/* DOCUMENT */}
                        <p className="text-sm font-medium">
                            {u.documentType.replace("_", " ")}
                        </p>

                        {/* STATUS */}
                        <span
                            className={`rounded-full px-3 py-1 text-xs mx-auto font-semibold ${statusStyle(
                                u.status
                            )}`}
                        >
                            {u.status}
                        </span>

                        {/* DATE */}
                        <p className="text-xs text-[var(--text-muted)]">
                            {new Date(u.createdAt).toLocaleDateString()}
                        </p>

                        {/* ACTION */}
                        <button
                            onClick={() => onView(u)}
                            className="
              rounded-full
              bg-[var(--primary)]/10
              px-4 py-2
              text-xs font-medium
              text-[var(--primary)]
              transition-colors
              hover:bg-[var(--primary)]
              hover:text-white
            "
                        >
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
