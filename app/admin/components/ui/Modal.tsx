"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

export default function Modal({
  title,
  open,
  onClose,
  children,
  footer,
  size = "lg",
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!open) return null;

  const sizeClass =
    size === "sm"
      ? "max-w-md"
      : size === "md"
      ? "max-w-xl"
      : size === "xl"
      ? "max-w-5xl"
      : "max-w-3xl";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full ${sizeClass} rounded-3xl bg-[var(--card-bg)] max-h-[90vh] overflow-hidden flex flex-col mx-4 sm:mx-0`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto min-h-0 flex-1">
          {children}
        </div>
        {footer && (
          <div className="border-t border-[var(--card-border)] bg-[var(--card-bg)] px-6 pt-4 pb-5 rounded-b-3xl shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
