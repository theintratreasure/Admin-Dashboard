"use client";

import { useMemo, useState } from "react";
import {
  BadgeIndianRupee,
  Bitcoin,
  CreditCard,
  Globe2,
  Plus,
  QrCode,
  Search,
  Sparkles,
} from "lucide-react";
import { usePaymentMethods } from "@/hooks/payment-method/usePaymentMethods";
import PaymentMethodCard from "./PaymentMethodCard";
import AddPaymentModal from "./AddPaymentModal";
import GlobalLoader from "../ui/GlobalLoader";
import EditPaymentModal from "./EditPaymentModal";
import type { PaymentType } from "@/services/payment-method/payment-method.service";

type PaymentMethod = {
  _id: string;
  type: PaymentType;
  title: string;
  is_active: boolean;
  bank_name?: string;
  account_name?: string;
  account_number?: string;
  ifsc?: string;
  upi_id?: string;
  crypto_network?: string;
  crypto_address?: string;
  international_name?: string;
  international_email?: string;
  image_url?: string;
};

type FilterType = "ALL" | PaymentType;

const typeFilterOptions: Array<{
  value: FilterType;
  label: string;
  icon: typeof CreditCard;
}> = [
  { value: "ALL", label: "All", icon: CreditCard },
  { value: "BANK", label: "Bank", icon: BadgeIndianRupee },
  { value: "UPI", label: "UPI", icon: QrCode },
  { value: "CRYPTO", label: "Crypto", icon: Bitcoin },
  { value: "INTERNATIONAL", label: "International", icon: Globe2 },
];

export default function PaymentMethodPage() {
  const { data, isLoading } = usePaymentMethods();
  const [addOpen, setAddOpen] = useState(false);
  const [editData, setEditData] = useState<PaymentMethod | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("ALL");
  const [onlyActive, setOnlyActive] = useState(false);

  const methods = useMemo<PaymentMethod[]>(() => data?.data ?? [], [data?.data]);

  const stats = useMemo(() => {
    const active = methods.filter((method) => method.is_active).length;
    const bank = methods.filter((method) => method.type === "BANK").length;
    const upi = methods.filter((method) => method.type === "UPI").length;
    const crypto = methods.filter((method) => method.type === "CRYPTO").length;
    const international = methods.filter((method) => method.type === "INTERNATIONAL").length;

    return { total: methods.length, active, bank, upi, crypto, international };
  }, [methods]);

  const filteredMethods = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return methods.filter((method) => {
      const isTypeMatched = typeFilter === "ALL" || method.type === typeFilter;
      if (!isTypeMatched) return false;

      if (onlyActive && !method.is_active) return false;

      if (!searchTerm) return true;

      const searchableText = [
        method.title,
        method.bank_name,
        method.account_name,
        method.account_number,
        method.ifsc,
        method.upi_id,
        method.crypto_network,
        method.crypto_address,
        method.international_name,
        method.international_email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }, [methods, search, typeFilter, onlyActive]);

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="container-pad space-y-5 text-[var(--foreground)]">
      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700">
              <Sparkles size={12} />
              Bank Detail Management
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Payment Methods
            </h1>
            <p className="max-w-2xl text-sm text-[var(--text-muted)]">
              Manage bank accounts, UPI IDs, crypto wallets, and international
              payment profiles for deposit and withdrawal operations.
            </p>
          </div>

          <button
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"
            onClick={() => setAddOpen(true)}
            type="button"
          >
            <Plus size={16} />
            Add Payment Method
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <StatsCard label="Total Methods" value={String(stats.total)} tone="slate" />
          <StatsCard label="Active" value={String(stats.active)} tone="emerald" />
          <StatsCard label="Bank" value={String(stats.bank)} tone="sky" />
          <StatsCard label="UPI" value={String(stats.upi)} tone="violet" />
          <StatsCard label="Crypto" value={String(stats.crypto)} tone="amber" />
          <StatsCard label="International" value={String(stats.international)} tone="teal" />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, account, UPI, wallet or email..."
              className="w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {typeFilterOptions.map((option) => {
              const Icon = option.icon;
              const isActive = typeFilter === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTypeFilter(option.value)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                    isActive
                      ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                  }`}
                >
                  <Icon size={14} />
                  {option.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setOnlyActive((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                onlyActive
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                  : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
              }`}
            >
              Only Active
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredMethods.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-10 text-center text-sm text-[var(--text-muted)]">
              No payment methods found for current filter.
            </div>
          ) : (
            filteredMethods.map((item) => (
              <PaymentMethodCard
                key={item._id}
                data={item}
                onEdit={() => setEditData(item)}
              />
            ))
          )}
        </div>
      </div>

      {addOpen && <AddPaymentModal onClose={() => setAddOpen(false)} />}
      {editData && (
        <EditPaymentModal
          data={editData}
          onClose={() => setEditData(null)}
        />
      )}
    </div>
  );
}

function StatsCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "slate" | "emerald" | "sky" | "violet" | "amber" | "teal";
}) {
  const toneMap: Record<typeof tone, string> = {
    slate: "text-slate-700 border-slate-400/30 bg-slate-500/[0.04]",
    emerald: "text-emerald-700 border-emerald-400/30 bg-emerald-500/[0.04]",
    sky: "text-sky-700 border-sky-400/30 bg-sky-500/[0.04]",
    violet: "text-violet-700 border-violet-400/30 bg-violet-500/[0.04]",
    amber: "text-amber-700 border-amber-400/30 bg-amber-500/[0.04]",
    teal: "text-teal-700 border-teal-400/30 bg-teal-500/[0.04]",
  };

  return (
    <div className={`rounded-lg border p-3 ${toneMap[tone]}`}>
      <p className="text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
