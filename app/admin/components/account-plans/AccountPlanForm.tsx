"use client";

import { useState } from "react";
import {
  Layers,
  Percent,
  DollarSign,
  BadgePercent,
  Activity,
  Scale,
  Gift,
} from "lucide-react";

import { AccountPlan, AccountPlanPayload } from "@/types/accountPlan";
import PremiumInput from "../ui/PremiumInput";
import Toggle from "../ui/Toggle";

type DraftNumber = number | "";

type AccountPlanDraft = Omit<
  AccountPlanPayload,
  | "spreadPips"
  | "commission"
  | "max_leverage"
  | "minDeposit"
  | "commission_per_lot"
  | "referral_reward_amount"
> & {
  spreadPips: DraftNumber;
  commission: DraftNumber;
  max_leverage: DraftNumber;
  minDeposit: DraftNumber;
  commission_per_lot: DraftNumber;
  referral_reward_amount: DraftNumber;
};

const DEFAULT_FORM: AccountPlanDraft = {
  name: "",
  spreadPips: "",
  commission: "",
  leverageNote: "Up to Unlimited",
  max_leverage: "",
  minLotSize: 0.01,
  minDeposit: "",
  guidance: "",
  is_demo_allowed: true,
  spread_type: "FLOATING",
  commission_per_lot: "",
  swap_enabled: true,
  referral_reward_amount: "",
  isActive: true,
};

function getInitialForm(initialData?: AccountPlan | null): AccountPlanDraft {
  if (!initialData) return DEFAULT_FORM;

  return {
    name: initialData.name,
    spreadPips: initialData.spreadPips,
    commission: initialData.commission,
    leverageNote: initialData.leverageNote,
    max_leverage: initialData.max_leverage ?? 0,
    minLotSize: initialData.minLotSize,
    minDeposit: initialData.minDeposit,
    guidance: initialData.guidance,
    is_demo_allowed: initialData.is_demo_allowed,
    spread_type: initialData.spread_type,
    commission_per_lot: initialData.commission_per_lot,
    swap_enabled: initialData.swap_enabled,
    referral_reward_amount: initialData.referral_reward_amount ?? 0,
    isActive: initialData.isActive,
  };
}

interface Props {
  initialData?: AccountPlan | null;
  onSubmit: (payload: AccountPlanPayload) => void;
  loading?: boolean;
}

export default function AccountPlanForm({
  initialData,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<AccountPlanDraft>(() =>
    getInitialForm(initialData)
  );
  const parseDraftNumber = (value: DraftNumber) =>
    value === "" ? 0 : Number(value);

  return (
    <div className="space-y-5">
      {/* ================= BASIC ================= */}
      <PremiumInput
        label="Plan Name"
        value={form.name}
        onChange={(v) => setForm({ ...form, name: v })}
        icon={Layers}
        required
      />

      {/* ================= GRID 1 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PremiumInput
          label="Minimum Deposit"
          type="number"
          value={form.minDeposit}
          onChange={(v) =>
            setForm({ ...form, minDeposit: v === "" ? "" : Number(v) })
          }
          icon={DollarSign}
        />

        <PremiumInput
          label="Minimum Lot Size"
          type="number"
          value={form.minLotSize}
          onChange={(v) =>
            setForm({ ...form, minLotSize: Number(v) })
          }
          icon={Scale}
        />
      </div>

      {/* ================= GRID 2 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PremiumInput
          label="Spread (Pips)"
          type="number"
          value={form.spreadPips}
          onChange={(v) =>
            setForm({ ...form, spreadPips: v === "" ? "" : Number(v) })
          }
          icon={Percent}
        />

        <PremiumInput
          label="Commission"
          type="number"
          value={form.commission}
          onChange={(v) =>
            setForm({ ...form, commission: v === "" ? "" : Number(v) })
          }
          icon={BadgePercent}
        />
      </div>

      {/* ================= GRID 3 ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PremiumInput
          label="Max Leverage (0 = Unlimited)"
          type="number"
          value={form.max_leverage}
          onChange={(v) =>
            setForm({ ...form, max_leverage: v === "" ? "" : Number(v) })
          }
          icon={Activity}
        />

        <PremiumInput
          label="Leverage Note"
          value={form.leverageNote}
          onChange={(v) =>
            setForm({ ...form, leverageNote: v })
          }
        />
      </div>

      {/* ================= SPREAD TYPE ================= */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--text-muted)]">
          Spread Type
        </label>
        <select
          value={form.spread_type}
          onChange={(e) =>
            setForm({
              ...form,
              spread_type: e.target.value as "FIXED" | "FLOATING",
            })
          }
          className="input w-full"
        >
          <option value="FLOATING">Floating</option>
          <option value="FIXED">Fixed</option>
        </select>
      </div>

      {/* ================= COMMISSION PER LOT ================= */}
      <PremiumInput
        label="Commission per Lot"
        type="number"
        value={form.commission_per_lot}
        onChange={(v) =>
          setForm({ ...form, commission_per_lot: v === "" ? "" : Number(v) })
        }
      />

      {/* ================= REFERRAL REWARD ================= */}
      <PremiumInput
        label="Referral Reward Amount"
        type="number"
        value={form.referral_reward_amount}
        onChange={(v) =>
          setForm({
            ...form,
            referral_reward_amount: v === "" ? "" : Number(v),
          })
        }
        icon={Gift}
      />

      {/* ================= GUIDANCE ================= */}
      <PremiumInput
        label="Guidance / Support Note"
        value={form.guidance}
        onChange={(v) =>
          setForm({ ...form, guidance: v })
        }
      />

      {/* ================= TOGGLES ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <Toggle
          label="Demo Account Allowed"
          value={form.is_demo_allowed}
          onChange={(v) =>
            setForm({ ...form, is_demo_allowed: v })
          }
        />

        <Toggle
          label="Swap Enabled"
          value={form.swap_enabled}
          onChange={(v) =>
            setForm({ ...form, swap_enabled: v })
          }
        />

        <Toggle
          label="Plan Active"
          value={form.isActive}
          onChange={(v) =>
            setForm({ ...form, isActive: v })
          }
        />
      </div>

      {/* ================= SUBMIT ================= */}
      <button
        disabled={loading}
        onClick={() =>
          onSubmit({
            ...form,
            spreadPips: parseDraftNumber(form.spreadPips),
            commission: parseDraftNumber(form.commission),
            max_leverage: parseDraftNumber(form.max_leverage),
            minDeposit: parseDraftNumber(form.minDeposit),
            commission_per_lot: parseDraftNumber(form.commission_per_lot),
            referral_reward_amount: parseDraftNumber(form.referral_reward_amount),
          })
        }
        className="btn btn-primary w-full mt-2"
      >
        {loading ? "Saving..." : "Save Account Plan"}
      </button>
    </div>
  );
}
