import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Bitcoin,
  Building2,
  Copy,
  CreditCard,
  Globe2,
  Landmark,
  Mail,
  Pencil,
  QrCode,
  Trash2,
  User,
} from "lucide-react";
import { useTogglePaymentStatus } from "@/hooks/payment-method/useTogglePaymentStatus";
import { useDeletePaymentMethod } from "@/hooks/payment-method/useDeletePaymentMethod";
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
  swift_code?: string;
  upi_id?: string;
  crypto_network?: string;
  crypto_address?: string;
  international_name?: string;
  international_email?: string;
  image_url?: string;
};

export default function PaymentMethodCard({
  data,
  onEdit,
}: {
  data: PaymentMethod;
  onEdit: () => void;
}) {
  const toggle = useTogglePaymentStatus();
  const del = useDeletePaymentMethod();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const typeMeta = getTypeMeta(data.type);
  const TypeIcon = typeMeta.icon;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className={`h-1 w-full ${typeMeta.stripClass}`} />

      <div className="space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${typeMeta.pillClass}`}
              >
                <TypeIcon size={12} />
                {typeMeta.label}
              </span>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  data.is_active
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-700"
                }`}
              >
                {data.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            <h3 className="mt-2 truncate text-base font-semibold text-[var(--foreground)] sm:text-lg">
              {data.title || "Untitled Method"}
            </h3>
            <p className="text-xs text-[var(--text-muted)]">{typeMeta.description}</p>
          </div>

          <label className="inline-flex items-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--input-bg)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)]">
            {data.is_active ? "Enabled" : "Disabled"}
            <button
              type="button"
              aria-label="Toggle payment status"
              onClick={() =>
                toggle.mutate({ id: data._id, is_active: !data.is_active })
              }
              className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
                data.is_active
                  ? "border-emerald-500/50 bg-emerald-500/20"
                  : "border-slate-400/60 bg-slate-300/40"
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  data.is_active ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.type === "BANK" && (
            <>
              <CopyField
                icon={Landmark}
                label="Bank Name"
                value={data.bank_name}
                onCopy={() => setToast("Bank name copied")}
              />
              <CopyField
                icon={Building2}
                label="Account Holder"
                value={data.account_name}
                onCopy={() => setToast("Account holder copied")}
              />
              <CopyField
                icon={CreditCard}
                label="Account Number"
                value={data.account_number}
                onCopy={() => setToast("Account number copied")}
              />
              <CopyField
                icon={Building2}
                label="IFSC"
                value={data.ifsc}
                onCopy={() => setToast("IFSC copied")}
              />
              <CopyField
                icon={Globe2}
                label="SWIFT Code"
                value={data.swift_code}
                onCopy={() => setToast("SWIFT code copied")}
              />
            </>
          )}

          {data.type === "UPI" && (
            <CopyField
              icon={QrCode}
              label="UPI ID"
              value={data.upi_id}
              onCopy={() => setToast("UPI ID copied")}
            />
          )}

          {data.type === "CRYPTO" && (
            <>
              <CopyField
                icon={Bitcoin}
                label="Network"
                value={data.crypto_network}
                onCopy={() => setToast("Network copied")}
              />
              <CopyField
                icon={Bitcoin}
                label="Wallet Address"
                value={data.crypto_address}
                onCopy={() => setToast("Wallet address copied")}
              />
            </>
          )}

          {data.type === "INTERNATIONAL" && (
            <>
              <CopyField
                icon={User}
                label="Account Holder"
                value={data.international_name}
                onCopy={() => setToast("Account holder copied")}
              />
              <CopyField
                icon={Mail}
                label="Email"
                value={data.international_email}
                onCopy={() => setToast("Email copied")}
              />
            </>
          )}
        </div>

        {data.type !== "BANK" && data.image_url && (
          <div className="rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-2">
            <div className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg border border-[var(--card-border)]/60 bg-gradient-to-br from-slate-100/60 via-white to-slate-100/50">
              <Image
                src={data.image_url}
                alt={`${data.title} preview`}
                fill
                sizes="(max-width: 768px) 100vw, 520px"
                className="object-contain p-1"
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 text-xs font-semibold hover:bg-[var(--hover-bg)]"
            onClick={onEdit}
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-500/10"
            onClick={() => del.mutate(data._id)}
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-[var(--foreground)] px-2.5 py-1 text-[11px] font-medium text-white">
          {toast}
        </div>
      )}
    </article>
  );
}

function CopyField({
  icon: Icon,
  label,
  value,
  onCopy,
}: {
  icon: typeof Landmark;
  label: string;
  value?: string;
  onCopy: () => void;
}) {
  const content = value?.trim() || "--";

  const copy = async () => {
    if (!value?.trim()) return;
    await navigator.clipboard.writeText(value);
    onCopy();
  };

  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] px-3 py-2.5">
      <p className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
        <Icon size={12} />
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="truncate font-mono text-sm text-[var(--foreground)]">{content}</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
          title={`Copy ${label}`}
        >
          <Copy size={12} />
        </button>
      </div>
    </div>
  );
}

function getTypeMeta(type: PaymentType) {
  if (type === "BANK") {
    return {
      label: "Bank",
      description: "Bank transfer details for manual deposits and payouts.",
      icon: Landmark,
      stripClass: "bg-gradient-to-r from-sky-500 to-blue-500",
      pillClass: "border-sky-500/40 bg-sky-500/10 text-sky-700",
    };
  }

  if (type === "UPI") {
    return {
      label: "UPI",
      description: "UPI handle for instant payment collection.",
      icon: QrCode,
      stripClass: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
      pillClass: "border-violet-500/40 bg-violet-500/10 text-violet-700",
    };
  }

  if (type === "CRYPTO") {
    return {
      label: "Crypto",
      description: "Wallet address and network for crypto transactions.",
      icon: Bitcoin,
      stripClass: "bg-gradient-to-r from-amber-500 to-orange-500",
      pillClass: "border-amber-500/40 bg-amber-500/10 text-amber-700",
    };
  }

  return {
    label: "International",
    description: "International payment account details for global payouts.",
    icon: Globe2,
    stripClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
    pillClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  };
}
