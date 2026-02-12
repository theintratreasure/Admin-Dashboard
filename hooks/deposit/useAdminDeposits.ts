import { useQuery } from "@tanstack/react-query";
import {
  getAdminDeposits,
  type AdminDepositsListPayload,
  type GetDepositsParams,
} from "@/services/adminDeposit.service";

export const useAdminDeposits = (params: GetDepositsParams) => {
  return useQuery<AdminDepositsListPayload>({
    queryKey: ["admin-deposits", params],
    queryFn: () => getAdminDeposits(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
