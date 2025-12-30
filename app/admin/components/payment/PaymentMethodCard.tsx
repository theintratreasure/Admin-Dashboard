import { Pencil, Trash2 } from "lucide-react";
import { useTogglePaymentStatus } from "@/hooks/payment-method/useTogglePaymentStatus";
import { useDeletePaymentMethod } from "@/hooks/payment-method/useDeletePaymentMethod";

export default function PaymentMethodCard({ data, onEdit }: any) {
  const toggle = useTogglePaymentStatus();
  const del = useDeletePaymentMethod();

  const label =
    data.type === "BANK"
      ? "Bank account"
      : data.type === "UPI"
      ? "UPI handle"
      : "Crypto wallet";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl
      border border-[var(--card-border)]
      bg-[var(--card-bg)]
      px-4 py-4 md:px-5 md:py-5
      shadow-[0_1px_4px_rgba(0,0,0,0.55)]
      transition-all"
    >
      {/* Top row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)]">
              {data.title}
            </h3>

            {data.is_active && (
              <span
                className="rounded-full
                bg-[var(--hover-bg)]
                border border-[var(--card-border)]
                px-2.5 py-0.5
                text-[11px] font-medium
                text-[var(--success)]"
              >
                Active
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-[var(--text-muted)]">
            {label}
          </p>
        </div>

        {/* Toggle */}
        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)] cursor-pointer select-none">
          <span>{data.is_active ? "Enabled" : "Disabled"}</span>

          <button
            type="button"
            onClick={() =>
              toggle.mutate({ id: data._id, is_active: !data.is_active })
            }
            className={`relative inline-flex h-5 w-9 items-center rounded-full border transition
            ${
              data.is_active
                ? "border-[var(--success)] bg-[var(--hover-bg)]"
                : "border-[var(--card-border)] bg-[var(--hover-bg)]"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full
              bg-[var(--foreground)]
              shadow transition-transform
              ${
                data.is_active ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-1 gap-1.5 text-xs md:text-sm text-[var(--foreground)]">
        {data.type === "BANK" && (
          <>
            <p>
              <span className="text-[var(--text-muted)]">Bank:</span>{" "}
              <span className="font-medium">{data.bank_name}</span>
            </p>
            <p>
              <span className="text-[var(--text-muted)]">Account holder:</span>{" "}
              <span className="font-medium">{data.account_name}</span>
            </p>
            <p>
              <span className="text-[var(--text-muted)]">Account:</span>{" "}
              <span className="font-mono">
                ****{data.account_number?.slice(-4)}
              </span>
            </p>
            <p>
              <span className="text-[var(--text-muted)]">IFSC:</span>{" "}
              <span className="font-mono">{data.ifsc}</span>
            </p>
          </>
        )}

        {data.type === "UPI" && (
          <p>
            <span className="text-[var(--text-muted)]">UPI ID:</span>{" "}
            <span className="font-mono">{data.upi_id}</span>
          </p>
        )}

        {data.type === "CRYPTO" && (
          <>
            <p>
              <span className="text-[var(--text-muted)]">Network:</span>{" "}
              <span className="font-medium">{data.crypto_network}</span>
            </p>
            <p className="truncate">
              <span className="text-[var(--text-muted)]">Wallet:</span>{" "}
              <span className="font-mono">{data.crypto_address}</span>
            </p>
          </>
        )}
      </div>

      {/* Image */}
      {data.image_url && (
        <div className="mt-4">
          <img
            src={data.image_url}
            className="h-28 w-full max-w-xs rounded-xl
            border border-[var(--card-border)]
            bg-[var(--hover-bg)]
            object-contain"
            alt="Payment proof"
          />
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-1.5">
        <button
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1
          text-xs font-medium
          text-[var(--text-muted)]
          hover:bg-[var(--hover-bg)]
          transition"
          onClick={onEdit}
          type="button"
        >
          <Pencil size={14} /> Edit
        </button>

        <button
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1
          text-xs font-medium
          text-[var(--danger)]
          hover:bg-[var(--hover-bg)]
          transition"
          onClick={() => del.mutate(data._id)}
          type="button"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
