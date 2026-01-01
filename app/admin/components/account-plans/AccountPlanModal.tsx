"use client";

import AccountPlanForm from "./AccountPlanForm";
import { AccountPlan, AccountPlanPayload } from "@/types/accountPlan";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: AccountPlan | null;
  onSubmit: (payload: AccountPlanPayload) => void;
  loading?: boolean;
}

export default function AccountPlanModal({
  open,
  onClose,
  initialData,
  onSubmit,
  loading,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* 🔒 Modal container */}
      <div className="card-elevated w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* 🔹 Header (fixed) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] shrink-0">
          <h2 className="text-lg font-semibold">
            {initialData ? "Edit Account Plan" : "Create Account Plan"}
          </h2>

          <button onClick={onClose} className="text-xl">
            ✕
          </button>
        </div>

        {/* 🔹 Scrollable form area */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AccountPlanForm
            initialData={initialData}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
