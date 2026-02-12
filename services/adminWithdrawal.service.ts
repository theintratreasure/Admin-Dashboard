import api from "@/api/axios";

export type WithdrawalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

export type WithdrawalMethod = "UPI" | "BANK" | "CRYPTO";
export type WithdrawalSortBy = "createdAt" | "updatedAt" | "actionAt" | "amount";
export type SortDir = "asc" | "desc";

export interface GetWithdrawalsParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: WithdrawalStatus;
  method?: WithdrawalMethod;
  userId?: string;
  accountId?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: WithdrawalSortBy;
  sortDir?: SortDir;
}

export type AdminWithdrawalsListPayload = {
  data: unknown[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeWithdrawalListResponse(payload: unknown): AdminWithdrawalsListPayload {
  const root = payload as Record<string, unknown> | null | undefined;
  const rootData = root && typeof root === "object" ? (root as { data?: unknown }).data : undefined;
  const node =
    rootData && typeof rootData === "object" ? (rootData as Record<string, unknown>) : root;

  const listCandidate =
    (Array.isArray(rootData) ? rootData : undefined) ??
    (node && Array.isArray((node as { data?: unknown }).data)
      ? (node as { data: unknown[] }).data
      : undefined) ??
    (node && Array.isArray((node as { items?: unknown }).items)
      ? (node as { items: unknown[] }).items
      : undefined) ??
    (node && Array.isArray((node as { list?: unknown }).list)
      ? (node as { list: unknown[] }).list
      : undefined) ??
    [];

  const total =
    asNumber((root as { total?: unknown })?.total) ??
    asNumber((node as { total?: unknown })?.total) ??
    asNumber((node as { pagination?: { total?: unknown } })?.pagination?.total) ??
    asNumber((node as { pagination?: { totalItems?: unknown } })?.pagination?.totalItems) ??
    asNumber((node as { pagination?: { totalDocs?: unknown } })?.pagination?.totalDocs) ??
    listCandidate.length;

  const page =
    asNumber((root as { page?: unknown })?.page) ??
    asNumber((node as { page?: unknown })?.page) ??
    asNumber((node as { pagination?: { page?: unknown } })?.pagination?.page);

  const limit =
    asNumber((root as { limit?: unknown })?.limit) ??
    asNumber((node as { limit?: unknown })?.limit) ??
    asNumber((node as { pagination?: { limit?: unknown } })?.pagination?.limit);

  const totalPages =
    asNumber((root as { totalPages?: unknown })?.totalPages) ??
    asNumber((node as { totalPages?: unknown })?.totalPages) ??
    asNumber((node as { pagination?: { totalPages?: unknown } })?.pagination?.totalPages);

  return {
    data: Array.isArray(listCandidate) ? listCandidate : [],
    total,
    page,
    limit,
    totalPages,
  };
}

export const getAdminWithdrawals = async (
  params: GetWithdrawalsParams
): Promise<AdminWithdrawalsListPayload> => {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  const q = params.q?.trim() || undefined;

  let fromDate = params.fromDate?.trim() || undefined;
  let toDate = params.toDate?.trim() || undefined;

  if (fromDate && toDate && fromDate > toDate) {
    [fromDate, toDate] = [toDate, fromDate];
  }

  const res = await api.get("/withdrawals/admin/search", {
    params: {
      page,
      limit,
      q,
      status: params.status,
      method: params.method,
      userId: params.userId,
      accountId: params.accountId,
      fromDate,
      toDate,
      from: fromDate,
      to: toDate,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });

  return normalizeWithdrawalListResponse(res.data);
};

