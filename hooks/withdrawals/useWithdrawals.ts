import { getWithdrawals } from "@/services/withdrawal.service";
import { useQuery } from "@tanstack/react-query";

interface AdminWithdrawalsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export const useAdminWithdrawals = ({
  page,
  limit,
  status,
  search,
}: AdminWithdrawalsParams) =>
  useQuery({
    queryKey: ["admin-withdrawals", page, limit, status, search],
    queryFn: () =>
      getWithdrawals({ page, limit, status, search }),
  });
