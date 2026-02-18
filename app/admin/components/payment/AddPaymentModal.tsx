"use client";

import { useState } from "react";
import Image from "next/image";
import { uploadToCloudinary } from "@/services/cloudinary.service";
import { useAddPaymentMethod } from "@/hooks/payment-method/useAddPaymentMethod";
import GlobalLoader from "../ui/GlobalLoader";
import { X } from "lucide-react";
import { Landmark, QrCode, Bitcoin, Globe2 } from "lucide-react";

type PaymentMethodDraft = {
    title: string;
    bank_name?: string;
    account_name?: string;
    account_number?: string;
    ifsc?: string;
    upi_id?: string;
    crypto_network?: string;
    crypto_address?: string;
    international_name?: string;
    international_email?: string;
};

export default function AddPaymentModal({ onClose }: { onClose: () => void }) {
    const add = useAddPaymentMethod();
    const [type, setType] = useState<"BANK" | "UPI" | "CRYPTO" | "INTERNATIONAL">("BANK");
    const [form, setForm] = useState<PaymentMethodDraft>({ title: "" });
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const typeOptions = [
        { value: "BANK", label: "Bank", icon: Landmark, helper: "A/C + IFSC" },
        { value: "UPI", label: "UPI", icon: QrCode, helper: "UPI handle" },
        { value: "CRYPTO", label: "Crypto", icon: Bitcoin, helper: "Wallet + network" },
        { value: "INTERNATIONAL", label: "International", icon: Globe2, helper: "Name + email" },
    ] as const;

    const submit = async () => {
        if (!file && type !== "INTERNATIONAL") return;
        setLoading(true);

        const img = file ? await uploadToCloudinary(file) : null;

        add.mutate(
            {
                type,
                title: form.title,
                bank_name: form.bank_name,
                account_name: form.account_name,
                account_number: form.account_number,
                ifsc: form.ifsc,
                upi_id: form.upi_id,
                crypto_network: form.crypto_network,
                crypto_address: form.crypto_address,
                international_name: form.international_name,
                international_email: form.international_email,
                image_url: img?.secure_url ?? "",
                image_public_id: img?.public_id ?? "",
            },
            { onSuccess: onClose, onSettled: () => setLoading(false) }
        );
    };

    const handleFileChange = (f: File | null) => {
        setFile(f);
        setPreview(f ? URL.createObjectURL(f) : null);
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
          px-6 py-5 md:px-8 md:py-6"
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
                            Add payment method
                        </h2>
                        <p className="text-xs md:text-sm text-[var(--text-muted)]">
                            These details will be shared with customers when they pay you.
                        </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                        {/* Payment type */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-muted)]">
                                Payment type
                            </label>

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {typeOptions.map((option) => {
                                    const Icon = option.icon;
                                    const active = type === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setType(option.value)}
                                            aria-pressed={active}
                                            className={`group relative flex w-full flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-[11px] font-semibold transition sm:text-xs
                                            ${
                                                active
                                                    ? "border-[var(--primary)]/50 bg-[var(--hover-bg)] text-[var(--foreground)] shadow-sm"
                                                    : "border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--hover-bg)]"
                                            }`}
                                        >
                                            <span
                                                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-[var(--text-muted)]
                                                ${
                                                    active
                                                        ? "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--primary)]"
                                                        : "border-[var(--card-border)] bg-[var(--input-bg)]"
                                                }`}
                                            >
                                                <Icon size={14} />
                                            </span>
                                            <span className="text-[11px] sm:text-xs">{option.label}</span>
                                            <span className="text-[9px] font-medium text-[var(--text-muted)] sm:text-[10px]">
                                                {option.helper}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
                                Title
                            </label>
                            <input
                                className="input w-full"
                                placeholder="e.g. Primary business account"
                                onChange={(e) =>
                                    setForm({ ...form, title: e.target.value })
                                }
                            />
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {type === "BANK" && (
                                <>
                                    <Input label="Bank name" placeholder="HDFC Bank" onChange={(v) => setForm({ ...form, bank_name: v })} />
                                    <Input label="Account holder" placeholder="John Doe" onChange={(v) => setForm({ ...form, account_name: v })} />
                                    <Input label="Account number" placeholder="************1234" onChange={(v) => setForm({ ...form, account_number: v })} />
                                    <Input label="IFSC code" placeholder="HDFC0001234" onChange={(v) => setForm({ ...form, ifsc: v })} />
                                </>
                            )}

                            {type === "UPI" && (
                                <Input label="UPI ID" placeholder="username@upi" onChange={(v) => setForm({ ...form, upi_id: v })} />
                            )}

                            {type === "CRYPTO" && (
                                <>
                                    <Input label="Network" placeholder="TRC20 / ERC20 / Polygon" onChange={(v) => setForm({ ...form, crypto_network: v })} />
                                    <Input label="Wallet address" placeholder="0x..." onChange={(v) => setForm({ ...form, crypto_address: v })} />
                                </>
                            )}

                            {type === "INTERNATIONAL" && (
                                <>
                                    <Input label="Account holder name" placeholder="Account Holder Name" onChange={(v) => setForm({ ...form, international_name: v })} />
                                    <Input label="Email" placeholder="user@example.com" onChange={(v) => setForm({ ...form, international_email: v })} />
                                </>
                            )}
                        </div>

                        {/* Upload */}
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-[var(--text-muted)]">
                                Proof / QR / Image{type === "INTERNATIONAL" ? " (optional)" : ""}
                            </label>

                            <div className="flex flex-col gap-2 rounded-xl border border-dashed border-[var(--card-border)]
              bg-[var(--hover-bg)] p-3 text-xs text-[var(--text-muted)]">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p>Upload a QR code, cheque, or reference image.</p>
                                    <label className="inline-flex cursor-pointer items-center rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white">
                                        Choose file
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
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={400}
                                        height={160}
                                        unoptimized
                                        className="max-h-40 w-auto rounded-md object-contain"
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
                            onClick={submit}
                            disabled={
                                loading ||
                                !form.title ||
                                (type !== "INTERNATIONAL" && !file) ||
                                (type === "INTERNATIONAL" &&
                                    (!form.international_name || !form.international_email))
                            }
                        >
                            Save payment method
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function Input({
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
                defaultValue={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
