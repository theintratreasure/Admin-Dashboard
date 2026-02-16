export type SpreadType = "FIXED" | "FLOATING";

export interface AccountPlan {
  _id: string;
  name: string;
  spreadPips: number;
  commission: number;
  leverageNote: string;
  max_leverage?: number;
  minLotSize: number;
  minDeposit: number;
  guidance: string;
  is_demo_allowed: boolean;
  spread_type: SpreadType;
  commission_per_lot: number;
  swap_enabled: boolean;
  referral_reward_amount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountPlanPayload {
  name: string;
  spreadPips: number;
  commission: number;
  leverageNote: string;
  max_leverage?: number;
  minLotSize: number;
  minDeposit: number;
  guidance: string;
  is_demo_allowed: boolean;
  spread_type: SpreadType;
  commission_per_lot: number;
  swap_enabled: boolean;
  referral_reward_amount?: number;
  isActive: boolean;
}
