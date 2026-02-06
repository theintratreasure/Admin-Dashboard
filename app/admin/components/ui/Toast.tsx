"use client";

import { CheckCircle } from "lucide-react";

export function Toast({ message }: { message: string }) {
  return (
    <div
      className="fixed top-5 right-5 z-[200] max-w-[90vw] sm:max-w-sm
      animate-slideIn rounded-xl
      bg-[var(--card-bg)] border border-[var(--card-border)]
      shadow-2xl px-4 py-3 flex items-center gap-2"
      role="status"
      aria-live="polite"
    >
      <CheckCircle size={18} className="text-[var(--success)]" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
