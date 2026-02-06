import api from "@/api/axios";
import type {
  AdminUserListResponse,
  AdminUserProfile,
  AdminUserUpdatePayload,
  UserListParams,
} from "@/types/user";
import type { AdminTransactionListResponse } from "@/types/transaction";
import type { AdminAccountListResponse } from "@/types/account";

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  pagination?: unknown;
};

function unwrapApi<T>(payload: ApiEnvelope<T> | T): T {
  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success === false) {
      const message = (payload as ApiEnvelope<T>).message || "Request failed.";
      throw new Error(message);
    }
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}

function unwrapList<T extends { data: unknown; pagination: unknown }>(
  payload: ApiEnvelope<T> | T
): T {
  if (payload && typeof payload === "object" && "success" in payload) {
    if (payload.success === false) {
      const message = (payload as ApiEnvelope<T>).message || "Request failed.";
      throw new Error(message);
    }
    return payload as T;
  }
  return payload as T;
}

export async function fetchAdminUsers(
  params: UserListParams
): Promise<AdminUserListResponse> {
  const query: Record<string, string | number | boolean> = {};

  if (params.q) query.q = params.q;
  if (params.kycStatus) query.kycStatus = params.kycStatus;
  if (params.isMailVerified !== undefined)
    query.isMailVerified = params.isMailVerified;
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;

  const { data } = await api.get<ApiEnvelope<AdminUserListResponse>>(
    "/user/admin/list",
    { params: query }
  );

  return unwrapList<AdminUserListResponse>(data);
}

export async function fetchAdminUserById(
  userId: string
): Promise<AdminUserProfile> {
  const { data } = await api.get<ApiEnvelope<AdminUserProfile>>(
    `/user/admin/${userId}`
  );
  return unwrapApi<AdminUserProfile>(data);
}

export async function updateAdminUser(
  userId: string,
  payload: AdminUserUpdatePayload
): Promise<AdminUserProfile> {
  const { data } = await api.patch<ApiEnvelope<AdminUserProfile>>(
    `/user/admin/${userId}`,
    payload
  );
  return unwrapApi<AdminUserProfile>(data);
}

export async function fetchAdminUserTransactions(
  userId: string,
  params: {
    page: number;
    limit: number;
    fromDate?: string;
    toDate?: string;
    type?: string;
    status?: string;
    referenceId?: string;
    account?: string;
    sortBy?: string;
    sortDir?: string;
  }
): Promise<AdminTransactionListResponse> {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };
  if (params.fromDate) query.fromDate = params.fromDate;
  if (params.toDate) query.toDate = params.toDate;
  if (params.type) query.type = params.type;
  if (params.status) query.status = params.status;
  if (params.referenceId) query.referenceId = params.referenceId;
  if (params.account) query.account = params.account;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortDir) query.sortDir = params.sortDir;

  const { data } = await api.get<ApiEnvelope<AdminTransactionListResponse>>(
    `/transactions/admin/${userId}`,
    { params: query }
  );

  return unwrapList<AdminTransactionListResponse>(data);
}

export async function fetchAdminUserAccounts(
  userId: string,
  params?: { page?: number; limit?: number }
): Promise<AdminAccountListResponse> {
  const query: Record<string, string | number> = {};
  if (params?.page) query.page = params.page;
  if (params?.limit) query.limit = params.limit;

  const { data } = await api.get<ApiEnvelope<AdminAccountListResponse>>(
    `/accounts/admin/user/${userId}`,
    { params: query }
  );

  return unwrapList<AdminAccountListResponse>(data);
}

export async function changeAdminUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success?: boolean; message?: string }> {
  const { data } = await api.patch<ApiEnvelope<{ message?: string }>>(
    `/auth/admin/user/${userId}/password`,
    { newPassword }
  );
  return data as { success?: boolean; message?: string };
}
