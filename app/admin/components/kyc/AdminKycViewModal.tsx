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
  onApprove,
  onReject,
  onClose,
}: {
  data: AdminKyc;
  loading: boolean;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmApprove, setConfirmApprove] = useState(false);

  const [viewerOpen, setViewerOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl">
        <div
          className="
            w-full max-w-6xl overflow-hidden rounded-3xl
            border border-[var(--card-border)]
            bg-[var(--card-bg)]
            shadow-[0_40px_120px_rgba(0,0,0,0.45)]
          "
        >
          {/* HEADER */}
          <div className="flex justify-between border-b border-[var(--card-border)] px-6 py-5">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                KYC REVIEW
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                {data.user.name}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {data.user.email} • {data.user.phone}
              </p>
              <p className="mt-1 text-xs">
                Document{" "}
                <span className="font-medium">
                  {data.documentType.replace("_", " ")}
                </span>
              </p>
            </div>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* IMAGE GRID */}
          <div className="grid gap-6 px-6 py-6 md:grid-cols-3">
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
            <div className="mx-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
              Previous rejection: {data.rejectionReason}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-4 border-t border-[var(--card-border)] px-6 py-5">
            {data.status === "PENDING" && (
              <>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter rejection reason (required)"
                  className="
                    w-full rounded-xl border border-[var(--card-border)]
                    bg-[var(--card-bg)] px-4 py-3 text-sm
                    focus:outline-none focus:ring-2 focus:ring-red-500/40
                  "
                />

                <div className="flex justify-end gap-4">
                  <button
                    disabled={loading || !reason}
                    onClick={() => onReject(reason)}
                    className="
                      flex items-center gap-2 rounded-full
                      bg-red-500/10 px-6 py-2 text-sm text-red-400
                      hover:bg-red-500 hover:text-white
                    "
                  >
                    <XCircle size={16} /> Reject
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => setConfirmApprove(true)}
                    className="
                      flex items-center gap-2 rounded-full
                      bg-[var(--primary)] px-6 py-2 text-sm text-white
                      shadow-[0_12px_35px_var(--glow)]
                    "
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                </div>
              </>
            )}

            {confirmApprove && (
              <div className="flex items-center justify-end gap-4">
                <span className="text-sm">Confirm approval?</span>
                <button
                  onClick={onApprove}
                  className="rounded-full bg-green-600 px-6 py-2 text-sm text-white"
                >
                  Yes, approve
                </button>
              </div>
            )}
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
        group relative h-[260px] cursor-zoom-in
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
            className="object-cover transition-transform duration-500 group-hover:scale-110"
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
