"use client";

import Image from "next/image";
import {
  CheckCircle,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminKyc } from "@/services/kyc/kyc.types";

type ImageItem = {
  label: string;
  src?: string;
};

export default function AdminKycViewModal({
  data,
  loading,
  actionInFlight,
  onApprove,
  onReject,
  onClose,
}: {
  data: AdminKyc;
  loading: boolean;
  actionInFlight?: "APPROVE" | "REJECT" | null;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmApprove, setConfirmApprove] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const documentLabel =
    typeof data.documentType === "string" && data.documentType.trim()
      ? data.documentType.trim().replace(/_/g, " ")
      : "--";

  const images: ImageItem[] = [
    { label: "Front", src: data.documents.front?.image_url },
    { label: "Back", src: data.documents.back?.image_url },
    { label: "Selfie", src: data.documents.selfie?.image_url },
  ];

  /* keyboard navigation */
  useEffect(() => {
    if (!viewerOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewerOpen(false);
      if (e.key === "ArrowRight")
        setActiveIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerOpen, images.length]);

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl p-3 sm:p-6">
        <div
          className="
            w-full max-w-4xl overflow-hidden rounded-2xl
            border border-[var(--card-border)]
            bg-[var(--card-bg)]
            shadow-[0_30px_90px_rgba(0,0,0,0.35)]
          "
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 border-b border-[var(--card-border)] px-5 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                KYC REVIEW
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-tight">
                {data.user.name}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {data.user.email} • {data.user.phone}
              </p>
              <p className="mt-1 text-xs">
                Document{" "}
                <span className="font-medium">
                  {documentLabel}
                </span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full border border-[var(--card-border)] p-2"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
            {/* IMAGE GRID */}
            <div className="grid gap-3 px-5 py-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, idx) => (
                <ImageCard
                  key={img.label}
                  label={img.label}
                  src={img.src}
                  onClick={() => {
                    setActiveIndex(idx);
                    setViewerOpen(true);
                  }}
                />
              ))}
            </div>

            {/* PREVIOUS REJECTION */}
            {data.rejectionReason && (
              <div className="mx-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-500">
                Previous rejection: {data.rejectionReason}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex flex-col gap-4 border-t border-[var(--card-border)] px-5 py-4">
            {data.status === "PENDING" && (
              <>
                <div
                  className="rounded-2xl border border-[var(--card-border)] p-4"
                  style={{
                    background:
                      "color-mix(in srgb, var(--hover-bg) 70%, transparent)",
                  }}
                >
                  <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span className="font-semibold uppercase tracking-wider">
                      Rejection Reason
                    </span>
                    <span>{reason.trim().length}/240</span>
                  </div>
                  <textarea
                    value={reason}
                    maxLength={240}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Explain why the KYC is being rejected"
                    className="
                      w-full rounded-xl border border-[var(--card-border)]
                      bg-[var(--card-bg)] px-4 py-3 text-sm
                      focus:outline-none focus:ring-2 focus:ring-red-500/30
                    "
                    rows={2}
                  />
                  <p className="mt-2 text-xs text-[var(--text-muted)]">
                    Reason is required for rejection and will be visible to the user.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button
                    disabled={loading || reason.trim().length === 0}
                    onClick={() => onReject(reason.trim())}
                    className="
                      flex items-center gap-2 rounded-full
                      border border-red-500/40 bg-red-500/10 px-5 py-2 text-sm text-red-500
                      hover:bg-red-500 hover:text-white
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    <XCircle size={16} />
                    {actionInFlight === "REJECT" ? "Rejecting..." : "Reject"}
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => setConfirmApprove(true)}
                    className="
                      flex items-center gap-2 rounded-full
                      bg-[var(--primary)] px-5 py-2 text-sm text-white
                      shadow-[0_12px_35px_var(--glow)]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    <CheckCircle size={16} />
                    {actionInFlight === "APPROVE" ? "Approving..." : "Approve"}
                  </button>
                </div>
              </>
            )}

            {confirmApprove && (
              <div
                className="
                  flex flex-wrap items-center justify-between gap-3
                  rounded-2xl border border-[var(--card-border)]
                  px-4 py-3
                "
                style={{
                  background:
                    "color-mix(in srgb, var(--hover-bg) 80%, transparent)",
                }}
              >
                <div>
                  <p className="text-sm font-semibold">
                    Confirm approval
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    This will mark the KYC as verified.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfirmApprove(false)}
                    disabled={loading}
                    className="
                      rounded-full border border-[var(--card-border)]
                      px-4 py-2 text-xs
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onApprove}
                    disabled={loading}
                    className="
                      rounded-full bg-green-600 px-5 py-2 text-xs text-white
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    {actionInFlight === "APPROVE" ? "Approving..." : "Yes, approve"}
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* FULL IMAGE VIEWER */}
      {viewerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90">
          <button
            className="absolute right-6 top-6 text-white"
            onClick={() => setViewerOpen(false)}
          >
            <X size={28} />
          </button>

          <button
            onClick={() =>
              setActiveIndex((i) => (i - 1 + images.length) % images.length)
            }
            className="absolute left-6 text-white"
          >
            <ChevronLeft size={42} />
          </button>

          <div className="relative h-[80vh] w-[80vw]">
            {images[activeIndex].src && (
              <Image
                src={images[activeIndex].src!}
                alt="KYC preview"
                fill
                className="object-contain"
              />
            )}
          </div>

          <button
            onClick={() =>
              setActiveIndex((i) => (i + 1) % images.length)
            }
            className="absolute right-6 text-white"
          >
            <ChevronRight size={42} />
          </button>

          <div className="absolute bottom-6 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
            {images[activeIndex].label}
          </div>
        </div>
      )}
    </>
  );
}

/* IMAGE CARD */

function ImageCard({
  label,
  src,
  onClick,
}: {
  label: string;
  src?: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="
        group relative h-[140px] cursor-zoom-in sm:h-[180px] lg:h-[200px]
        overflow-hidden rounded-2xl
        border border-[var(--card-border)]
        bg-black
        
      "
    >
      {src ? (
        <>
          <Image
            src={src}
            alt={label}
            fill
            className="object-contain transform-gpu transition-transform duration-700 ease-out group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100" />
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
          Not provided
        </div>
      )}

      <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
        {label}
      </span>
    </div>
  );
}
