import { Pencil, Trash2 } from "lucide-react";
import { useTogglePaymentStatus } from "@/hooks/payment-method/useTogglePaymentStatus";
import { useDeletePaymentMethod } from "@/hooks/payment-method/useDeletePaymentMethod";

export default function PaymentMethodCard({ data, onEdit }: any) {
    const toggle = useTogglePaymentStatus();
    const del = useDeletePaymentMethod();
    const [toast, setToast] = useState<string | null>(null);
    useEffect(() => {
        if (toast) {
            const t = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(t);
        }
    }, [toast]);
    const label =
        data.type === "BANK"
            ? "Bank account"
            : data.type === "UPI"
                ? "UPI handle"
                : "Crypto wallet";

    return (
        <div
            className="
      relative flex flex-col h-100 overflow-hidden overflow-y-auto
      rounded-2xl
      border border-[var(--card-border)]
      bg-[var(--card-bg)]
      px-4 py-4 md:px-5 md:py-5
      shadow-[var(--shadow-1)]
      "
        >
            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <h3
                            className={`text-lg font-semibold text-[var(--foreground)]"
                                }`}
                        >
                            {data.title}
                        </h3>

                        <span
                            className={`
    inline-block px-2 py-0.5 text-xs font-medium rounded-full border
    ${data.is_active
                                    ? "text-[var(--success)] bg-[var(--hover-bg)] border-[var(--card-border)]"
                                    : "text-[var(--danger)] bg-[rgba(220,38,38,0.12)] border-[var(--danger)]"
                                }
  `}
                        >
                            {data.is_active ? "Active" : "Inactive"}
                        </span>

                    </div>

                    <p
                        className={`text-xs 
                                 "text-[var(--text-muted)]"
                            }`}
                    >
                        {label}
                    </p>
                </div>

                {/* Toggle */}
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <span
                        className={
                            data.is_active
                                ? "text-[var(--text-muted)]"
                                : "text-[var(--danger)]"
                        }
                    >
                        {data.is_active ? "Enabled" : "Disabled"}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            toggle.mutate({ id: data._id, is_active: !data.is_active })
                        }
                        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition
        ${data.is_active
                                ? "border-[var(--success)] bg-[var(--hover-bg)]"
                                : "border-[var(--danger)] bg-[var(--hover-bg)]"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 rounded-full
          bg-[var(--foreground)]
          shadow transition-transform
          ${data.is_active ? "translate-x-4" : "translate-x-0.5"}
        `}
                        />
                    </button>
                </label>
            </div>


            {/* BODY */}
            <div className="mt-4 flex-1 space-y-3">
                {data.type === "BANK" && (
                    <>
                        <CopyInput label="Bank name" value={data.bank_name} onCopy={() => setToast("Copied")} />
                        <CopyInput label="Account holder" value={data.account_name} onCopy={() => setToast("Copied")} />
                        <CopyInput
                            label="Account number"
                            value={data.account_number}
                            onCopy={() => setToast("Copied")}
                        />
                        <CopyInput label="IFSC" value={data.ifsc} onCopy={() => setToast("Copied")} />
                    </>
                )}

                {data.type === "UPI" && (
                    <CopyInput label="UPI ID" value={data.upi_id} onCopy={() => setToast("Copied")} />
                )}

                {data.type === "CRYPTO" && (
                    <>
                        <CopyInput label="Network" value={data.crypto_network} onCopy={() => setToast("Copied")} />
                        <CopyInput label="Wallet address" value={data.crypto_address} onCopy={() => setToast("Copied")} />
                    </>
                )}

                {/* IMAGE (fixed height, centered) */}
                {data.image_url && (
                    <div
                        className="
            h-32 w-full rounded-xl
            border border-[var(--card-border)]
            bg-[var(--hover-bg)]
            flex items-center justify-center
            overflow-hidden
            "
                    >
                        <img
                            src={data.image_url}
                            alt="Payment proof"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                )}
            </div>

            {/* ACTIONS */}
            <div className="mt-4 flex justify-end gap-2">
                <button
                    className="btn btn-ghost text-xs"
                    onClick={onEdit}
                >
                    <Pencil size={14} /> Edit
                </button>
                <button
                    className="btn text-xs text-[var(--danger)]"
                    onClick={() => del.mutate(data._id)}
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>

            {toast && (
                <div className="fixed z-10 bottom-4 right-4 rounded-lg bg-[var(--primary)] text-white px-4 py-2 shadow-xl">
                    {toast}
                </div>
            )}

        </div>
    );
}
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";


function CopyInput({
    label,
    value,
    onCopy,
}: {
    label: string;
    value: string;
    onCopy: () => void;
}) {
    const copy = async () => {
        await navigator.clipboard.writeText(value);
        onCopy();
    };

    return (
        <div className="space-y-1">
            <label className="block text-xs text-[var(--text-muted)]">
                {label}
            </label>

            <div className="relative">
                <input
                    readOnly
                    value={value}
                    className="
          input w-full pr-10
          bg-[var(--input-bg)]
          border-[var(--input-border)]
          text-[var(--foreground)]
          font-mono
          "
                />
                <button
                    type="button"
                    onClick={copy}
                    className="
          absolute right-2 top-1/2 -translate-y-1/2
          text-[var(--text-muted)]
          hover:text-[var(--foreground)]
          transition
          "
                    title="Copy"
                >
                    <Copy size={14} />
                </button>
            </div>
        </div>
    );
}