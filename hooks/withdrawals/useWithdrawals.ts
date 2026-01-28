import { getWithdrawals } from "@/services/withdrawal.service";
import { useQuery } from "@tanstack/react-query";

export const useAdminWithdrawals = ({
  page,
  limit,
  status,
}: any) =>
  useQuery({
    queryKey: ["admin-withdrawals", page, limit, status],
    queryFn: () =>
      getWithdrawals({ page, limit, status }),
  });
