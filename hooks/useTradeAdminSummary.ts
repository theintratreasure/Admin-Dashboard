import { useQuery } from "@tanstack/react-query";
import { getTradeAdminSummary } from "@/services/tradeAdmin.service";

export const useTradeAdminSummary = () =>
  useQuery({
    queryKey: ["trade-admin-summary"],
    queryFn: getTradeAdminSummary,
    staleTime: 1000 * 30,
  });
