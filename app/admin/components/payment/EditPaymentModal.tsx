"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import { useUpdatePaymentMethod } from "@/hooks/payment-method/useUpdatePaymentMethod";
import GlobalLoader from "../ui/GlobalLoader";
import { X } from "lucide-react";

export default function EditPaymentModal({
  data,
  onClose,
}: {
  data: any;
  onClose: () => void;
}) {
  const update = useUpdatePaymentMethod();
  const [form, setForm] = useState<any>({ ...data });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(data.image_url || null);
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);

    const payload: any = {
      title: form.title,
      bank_name: form.bank_name,
      account_name: form.account_name,
      account_number: form.account_number,
      ifsc: form.ifsc,
      upi_id: form.upi_id,
      crypto_network: form.crypto_network,
      crypto_address: form.crypto_address,
    };

    if (file) {
      const img = await uploadToCloudinary(file);
      payload.image_url = img.secure_url;
      payload.image_public_id = img.public_id;
    }

    update.mutate(
      { id: data._id, payload },
      {
        onSuccess: onClose,
        onSettled: () => setLoading(false),
      }
    );
  };

  const handleFileChange = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : data.image_url || null);
  };

  return (
    <>
      {loading && <GlobalLoader />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div
          className="relative w-full max-w-xl rounded-2xl
          bg-[var(--card-bg)]
          border border-[var(--card-border)]
          shadow-2xl shadow-black/40
          px-6 py-5 md:px-8 md:py-6 animate-[fadeIn_0.18s_ease-out]"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full
            bg-[var(--hover-bg)]
            text-[var(--text-muted)]
            hover:opacity-80 transition"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="mb-4 space-y-1 pr-8">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              Edit payment method
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">
              Update existing payout details for this method.
            </p>
          </div>

          {/* Content */}
          <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Title"
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.type === "BANK" && (
                <>
                  <Field label="Bank name" placeholder="HDFC Bank" value={form.bank_name} onChange={(v) => setForm({ ...form, bank_name: v })} />
                  <Field label="Account holder" placeholder="John Doe" value={form.account_name} onChange={(v) => setForm({ ...form, account_name: v })} />
                  <Field label="Account number" placeholder="************1234" value={form.account_number} onChange={(v) => setForm({ ...form, account_number: v })} />
                  <Field label="IFSC code" placeholder="HDFC0001234" value={form.ifsc} onChange={(v) => setForm({ ...form, ifsc: v })} />
                </>
              )}

              {form.type === "UPI" && (
                <Field label="UPI ID" placeholder="username@upi" value={form.upi_id} onChange={(v) => setForm({ ...form, upi_id: v })} />
              )}

              {form.type === "CRYPTO" && (
                <>
                  <Field label="Network" placeholder="TRC20 / ERC20 / Polygon" value={form.crypto_network} onChange={(v) => setForm({ ...form, crypto_network: v })} />
                  <Field label="Wallet address" placeholder="0x..." value={form.crypto_address} onChange={(v) => setForm({ ...form, crypto_address: v })} />
                </>
              )}
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-[var(--text-muted)]">
                Replace image (optional)
              </label>

              <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[var(--card-border)]
              bg-[var(--hover-bg)] p-3 text-xs text-[var(--text-muted)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p>Upload a new QR or proof image.</p>
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white">
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] || null)
                      }
                    />
                  </label>
                </div>
              </div>

              {preview && (
                <div className="rounded-lg border border-[var(--card-border)] bg-[var(--hover-bg)] p-2 inline-block">
                  <img
                    src={preview}
                    alt="Payment image"
                    className="max-h-40 rounded-md object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary disabled:opacity-60"
              onClick={save}
              disabled={loading || !form.title}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-[var(--text-muted)]">
        {label}
      </label>
      <input
        className="input w-full"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
