import { useQuery } from "@tanstack/react-query";
import {
  getAdminWithdrawals,
  type AdminWithdrawalsListPayload,
  type GetWithdrawalsParams,
} from "@/services/adminWithdrawal.service";

export const useAdminWithdrawals = (params: GetWithdrawalsParams) => {
  return useQuery<AdminWithdrawalsListPayload>({
    queryKey: ["admin-withdrawals", params],
    queryFn: () => getAdminWithdrawals(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
