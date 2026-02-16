"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface PremiumInputProps {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "password";
  icon?: LucideIcon;
  disabled?: boolean;
  required?: boolean;
}

export default function PremiumInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  icon: Icon,
  disabled = false,
  required = false,
}: PremiumInputProps) {
  const inputValue =
    type === "number" &&
    (value === 0 || value === "0" || value === null || value === undefined)
      ? ""
      : value;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium text-[var(--text-muted)]">
          {label}
          {required && <span className="text-[var(--danger)] ml-1">*</span>}
        </label>
      )}

      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2
        bg-[var(--input-bg)]
        border-[var(--input-border)]
        focus-within:border-[var(--primary)]
        focus-within:shadow-[0_0_0_3px_var(--glow)]
        transition`}
      >
        {Icon && (
          <Icon
            size={18}
            className="text-[var(--text-muted)] shrink-0"
          />
        )}

        <input
          type={type}
          value={inputValue}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-[var(--foreground)]
          placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
