import api from "@/api/axios";

export type SwapDirection = "all" | "credit" | "debit";

export type GetSwapTransactionsParams = {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  direction?: SwapDirection;
};

export type SwapUser = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  userType?: string;
};

export type SwapAccount = {
  _id?: string;
  account_number?: string;
  account_type?: string;
};

export type SwapTransaction = {
  _id: string;
  user?: SwapUser;
  account?: SwapAccount;
  type?: string;
  amount?: number;
  balanceAfter?: number;
  equityAfter?: number;
  status?: string;
  referenceType?: string;
  remark?: string;
  createdAt?: string;
};

export type SwapSummary = {
  totalCount?: number;
  totalAmount?: number;
  fromDate?: string;
  toDate?: string;
  direction?: string;
  timeZone?: string;
};

export type SwapPagination = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
};

export type AdminSwapTransactionsResponse = {
  success?: boolean;
  message?: string;
  data?: SwapTransaction[];
  summary?: SwapSummary;
  pagination?: SwapPagination;
};

export const getAdminSwapTransactions = async (
  params: GetSwapTransactionsParams
): Promise<AdminSwapTransactionsResponse> => {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(200, Math.max(1, params.limit ?? 50));

  let fromDate = params.fromDate?.trim() || undefined;
  let toDate = params.toDate?.trim() || undefined;
  if (fromDate && toDate && fromDate > toDate) {
    [fromDate, toDate] = [toDate, fromDate];
  }

  const res = await api.get("/transactions/admin/swap", {
    params: {
      page,
      limit,
      fromDate,
      toDate,
      direction: params.direction ?? "all",
    },
  });

  return res.data as AdminSwapTransactionsResponse;
};
