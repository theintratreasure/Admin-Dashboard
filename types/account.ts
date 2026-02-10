export type AdminAccount = {
  _id: string;
  user_id?: string;
  account_plan_id?: string;
  account_number?: string;
  account_type?: string;
  plan_name?: string;
  leverage?: number;
  spread_enabled?: boolean;
  spread_pips?: number;
  commission_per_lot?: number;
  swap_enabled?: boolean;
  swap_charge?: number;
  balance?: number;
  hold_balance?: number;
  equity?: number;
  currency?: string;
  first_deposit?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AdminAccountUpdatePayload = {
  leverage: number;
  spread_enabled: boolean;
  spread_pips: number;
  commission_per_lot: number;
  swap_enabled: boolean;
  swap_charge: number;
  status: "active" | "disabled";
};

export type AdminAccountPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AdminAccountListResponse = {
  success?: boolean;
  data: AdminAccount[];
  pagination: AdminAccountPagination;
};
