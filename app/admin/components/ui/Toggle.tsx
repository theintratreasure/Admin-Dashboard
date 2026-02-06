"use client";

import React from "react";

interface ToggleProps {
  label: React.ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[var(--foreground)]">
        {label}
      </span>

      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`
          relative inline-flex h-6 w-11 shrink-0 items-center
          rounded-full border transition
          ${value
            ? "bg-[var(--primary)] border-[var(--primary)]"
            : "bg-[var(--input-bg)] border-[var(--card-border)]"}
          focus:outline-none focus:ring-2 focus:ring-[var(--glow)]
          cursor-pointer
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white shadow
            transition duration-200 ease-in-out
            ${value ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
