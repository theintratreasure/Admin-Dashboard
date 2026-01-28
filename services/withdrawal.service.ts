import api from "@/api/axios";

export const getWithdrawals = async ({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const res = await api.get("/withdrawals/admin/all", {
    params: { page, limit, status },
  });
  return res.data.data;
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
