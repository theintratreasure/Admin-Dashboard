import api from "@/api/axios";

export type ReferralRewardStatus = "ELIGIBLE" | "REQUESTED" | "APPROVED" | "REJECTED";

export interface GetReferralRewardsParams {
  page?: number;
  limit?: number;
  status?: ReferralRewardStatus;
  referrerUserId?: string;
  referredUserId?: string;
  createdFrom?: string;
  createdTo?: string;
  requestedFrom?: string;
  requestedTo?: string;
  approvedFrom?: string;
  approvedTo?: string;
  rejectedFrom?: string;
  rejectedTo?: string;
}

export type AdminReferralRewardsListPayload = {
  data: unknown[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
};

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function normalizeRewardListResponse(payload: unknown): AdminReferralRewardsListPayload {
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

function normalizeDateRange(from?: string, to?: string) {
  if (from && to && from > to) {
    return { from: to, to: from };
  }
  return { from, to };
}

export const getAdminReferralRewards = async (
  params: GetReferralRewardsParams
): Promise<AdminReferralRewardsListPayload> => {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));

  const referrerUserId = params.referrerUserId?.trim() || undefined;
  const referredUserId = params.referredUserId?.trim() || undefined;

  const createdRange = normalizeDateRange(
    params.createdFrom?.trim() || undefined,
    params.createdTo?.trim() || undefined
  );
  const requestedRange = normalizeDateRange(
    params.requestedFrom?.trim() || undefined,
    params.requestedTo?.trim() || undefined
  );
  const approvedRange = normalizeDateRange(
    params.approvedFrom?.trim() || undefined,
    params.approvedTo?.trim() || undefined
  );
  const rejectedRange = normalizeDateRange(
    params.rejectedFrom?.trim() || undefined,
    params.rejectedTo?.trim() || undefined
  );

  const res = await api.get("/referrals/admin/rewards", {
    params: {
      page,
      limit,
      status: params.status,
      referrerUserId,
      referredUserId,
      createdFrom: createdRange.from,
      createdTo: createdRange.to,
      requestedFrom: requestedRange.from,
      requestedTo: requestedRange.to,
      approvedFrom: approvedRange.from,
      approvedTo: approvedRange.to,
      rejectedFrom: rejectedRange.from,
      rejectedTo: rejectedRange.to,
    },
  });

  return normalizeRewardListResponse(res.data);
};

export const approveReferralReward = async (rewardId: string) => {
  const res = await api.patch(`/referrals/admin/${rewardId}/approve`);
  return res.data;
};

export const rejectReferralReward = async (rewardId: string, reason: string) => {
  const res = await api.patch(`/referrals/admin/${rewardId}/reject`, {
    reason,
  });
  return res.data;
};
