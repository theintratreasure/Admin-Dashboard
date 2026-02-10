import api from "@/api/axios";

export interface WithdrawalPayoutPayload {
  bank_name?: string;
  account_holder_name?: string;
  account_number?: string;
  ifsc?: string;
  upi_id?: string;
  crypto_address?: string;
  wallet_network?: string;
  note?: string;
}

export interface CreateAdminWithdrawalPayload {
  accountId: string;
  amount: number;
  method: string;
  payout?: WithdrawalPayoutPayload;
}

export interface CreateAdminWithdrawalData {
  user: string;
  account: string;
  amount: number;
  method: string;
  status: string;
  rejectionReason?: string;
  actionBy?: string;
  actionAt?: string;
  ipAddress?: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminWithdrawalResponse {
  success: boolean;
  message: string;
  data: CreateAdminWithdrawalData;
}

export const getWithdrawals = async ({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) => {
  const res = await api.get("/withdrawals/admin/all", {
    params: { page, limit, status, search },
  });
  return res.data.data;
};

export const createAdminWithdrawal = async (
  payload: CreateAdminWithdrawalPayload
): Promise<CreateAdminWithdrawalResponse> => {
  const res = await api.post<CreateAdminWithdrawalResponse>(
    "/withdrawals/admin/create",
    payload
  );
  return res.data;
};

export const approveWithdrawal = async (id: string) => {
  const res = await api.patch(
    `/withdrawals/admin/${id}/approve`
  );
  return res.data;
};

export const rejectWithdrawal = async ({
  id,
  reason,
}: {
  id: string;
  reason: string;
}) => {
  const res = await api.patch(
    `/withdrawals/admin/${id}/reject`,
    { rejectionReason: reason }
  );
  return res.data;
};
