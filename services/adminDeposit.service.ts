import api from "@/api/axios";

export type DepositStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface GetDepositsParams {
  page?: number;
  limit?: number;
  status?: DepositStatus;
  fromDate?: string;
  toDate?: string;
}

export const getAdminDeposits = async (params: GetDepositsParams) => {
  const res = await api.get("/deposits/all", { params });
  return res.data;
};

export const approveDeposit = async (depositId: string) => {
  const res = await api.patch(`/deposits/${depositId}/approve`);
  return res.data;
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