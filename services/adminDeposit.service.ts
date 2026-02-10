import api from "@/api/axios";

export type DepositStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface GetDepositsParams {
  page?: number;
  limit?: number;
  status?: DepositStatus;
  fromDate?: string;
  toDate?: string;
}

export interface CreateAdminDepositPayload {
  accountId: string;
  amount: number;
  method: string;
}

export interface CreateAdminDepositData {
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

export interface CreateAdminDepositResponse {
  success: boolean;
  message: string;
  data: CreateAdminDepositData;
}

export const getAdminDeposits = async (params: GetDepositsParams) => {
  const res = await api.get("/deposits/all", { params });
  return res.data;
};

export const createAdminDeposit = async (
  payload: CreateAdminDepositPayload
) : Promise<CreateAdminDepositResponse> => {
  const res = await api.post<CreateAdminDepositResponse>(
    "/deposits/admin-deposit",
    payload
  );
  return res.data;
};

export const approveDeposit = async (depositId: string) => {
  try {
    const res = await api.patch(
      `/deposits/${depositId}/approve`,
      { status: "APPROVED" }
    );
    return res.data;
  } catch (error: unknown) {
    const statusCode = (error as { response?: { status?: number } }).response?.status;
    if (statusCode === 400 || statusCode === 422) {
      const fallbackRes = await api.patch(`/deposits/${depositId}/approve`);
      return fallbackRes.data;
    }
    throw error;
  }
};

export const rejectDeposit = async (
  depositId: string,
  reason: string
) => {
  const res = await api.patch(
    `/deposits/${depositId}/reject`,
    { status: "REJECTED", rejectionReason: reason }
  );
  return res.data;
};
export const editDepositAmount = async (
  depositId: string,
  newAmount: number
) => {
  const res = await api.patch(
    `/deposits/${depositId}/edit-amount`,
    { newAmount }
  );
  return res.data;
};
