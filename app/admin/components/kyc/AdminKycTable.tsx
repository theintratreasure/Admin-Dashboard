"use client";

import { useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Eye,
    FileText,
    Mail,
    User,
    XCircle,
    CircleEllipsis,
} from "lucide-react";
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

    const formatDocumentType = (value: AdminKyc["documentType"]) => {
        if (typeof value !== "string") return "--";
        const trimmed = value.trim();
        if (!trimmed) return "--";
        return trimmed.replace(/_/g, " ");
    };

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
                return "bg-green-500/10 text-green-400 border border-green-500/20";
            case "REJECTED":
                return "bg-red-500/10 text-red-400 border border-red-500/20";
            case "PENDING":
            default:
                return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
        }
    };

    const statusIcon = (status: AdminKyc["status"]) => {
        switch (status) {
            case "VERIFIED":
                return CheckCircle2;
            case "REJECTED":
                return XCircle;
            case "PENDING":
            default:
                return CircleEllipsis;
        }
    };

    return (
        <div className="lg:relative lg:-mx-2 lg:overflow-x-auto">
            <div className="hidden min-w-[900px] space-y-3 px-2 lg:block">

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
                    <span className="inline-flex items-center gap-1">
                        <User size={12} /> User
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <Mail size={12} /> Email
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <FileText size={12} /> Document
                    </span>
                    <span className="inline-flex items-center gap-1">
                        <CircleEllipsis size={12} /> Status
                    </span>

                    {/* SORTABLE DATE */}
                    <button
                        onClick={toggleSort}
                        className="flex items-center gap-1 justify-start"
                    >
                        <CalendarDays size={12} /> Date
                        {sortOrder === "asc" ? (
                            <ChevronUp size={14} />
                        ) : (
                            <ChevronDown size={14} />
                        )}
                    </button>
                    <span className="inline-flex items-center gap-1">
                        <Eye size={12} /> Action
                    </span>
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
                            {formatDocumentType(u.documentType)}
                        </p>

                        {/* STATUS */}
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                                u.status
                            )}`}
                        >
                            {(() => {
                                const Icon = statusIcon(u.status);
                                return <Icon size={12} />;
                            })()}
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
                            <span className="inline-flex items-center gap-1">
                                <Eye size={12} /> View
                            </span>
                        </button>
                    </div>
                ))}
            </div>

            {/* ================= MOBILE CARDS ================= */}
            <div className="grid gap-3 lg:hidden">
                {sortedList.map((u) => (
                    <div
                        key={u._id}
                        className="
              rounded-2xl border border-[var(--card-border)]
              bg-[var(--card-bg)] p-4
            "
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold">
                                    {u.user.name}
                                </p>
                                <p className="text-[11px] text-[var(--text-muted)]">
                                    {u.user.phone}
                                </p>
                            </div>
                            <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(
                                    u.status
                                )}`}
                            >
                                {(() => {
                                    const Icon = statusIcon(u.status);
                                    return <Icon size={12} />;
                                })()}
                                {u.status}
                            </span>
                        </div>

                        <div className="mt-3 space-y-2 text-[11px] text-[var(--text-muted)]">
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1">
                                    <Mail size={12} /> Email
                                </span>
                                <span className="max-w-[60%] truncate text-right text-[var(--foreground)]">
                                    {u.user.email}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1">
                                    <FileText size={12} /> Document
                                </span>
                                <span className="text-right text-[var(--foreground)]">
                                    {formatDocumentType(u.documentType)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                                <span className="inline-flex items-center gap-1">
                                    <CalendarDays size={12} /> Date
                                </span>
                                <span className="text-right text-[var(--foreground)]">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => onView(u)}
                            className="
              mt-3 w-full rounded-xl
              bg-[var(--primary)]/10
              px-4 py-2 text-xs font-semibold
              text-[var(--primary)]
              transition-colors
              hover:bg-[var(--primary)]
              hover:text-white
            "
                        >
                            <span className="inline-flex items-center gap-1">
                                <Eye size={12} /> View
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
