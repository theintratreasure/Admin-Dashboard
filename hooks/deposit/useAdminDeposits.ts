import { useQuery } from "@tanstack/react-query";
import {
  getAdminDeposits,
  GetDepositsParams
} from "@/services/adminDeposit.service";

export const useAdminDeposits = (params: GetDepositsParams) => {
  return useQuery({
    queryKey: ["admin-deposits", params],
    queryFn: () => getAdminDeposits(params),
  });
};
