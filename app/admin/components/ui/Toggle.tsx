"use client";

import React from "react";

interface ToggleProps {
  label: React.ReactNode;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ label, value, onChange, disabled = false }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="min-w-0 flex-1 text-sm leading-5 text-[var(--foreground)] break-words">
        {label}
      </span>

      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          onChange(!value);
        }}
        aria-pressed={value}
        aria-disabled={disabled}
        className={`
          relative inline-flex h-5 w-9 shrink-0 items-center
          sm:h-6 sm:w-11
          rounded-full border transition
          ${value
            ? "bg-[var(--primary)] border-[var(--primary)]"
            : "bg-[var(--input-bg)] border-[var(--card-border)]"}
          focus:outline-none focus:ring-2 focus:ring-[var(--glow)]
          disabled:opacity-60 disabled:cursor-not-allowed
          ${disabled ? "" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow
            sm:h-5 sm:w-5
            transition duration-200 ease-in-out
            ${value ? "translate-x-4 sm:translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
