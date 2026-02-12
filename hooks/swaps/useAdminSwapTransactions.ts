import { useQuery } from "@tanstack/react-query";
import {
  getAdminSwapTransactions,
  type AdminSwapTransactionsResponse,
  type GetSwapTransactionsParams,
} from "@/services/adminSwap.service";

export const useAdminSwapTransactions = (params: GetSwapTransactionsParams) => {
  return useQuery<AdminSwapTransactionsResponse>({
    queryKey: ["admin-swap-transactions", params],
    queryFn: () => getAdminSwapTransactions(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
