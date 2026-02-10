import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getTradeAdminBrokerage,
  type TradeAdminBrokerageParams,
} from "@/services/tradeAdmin.service";

export const useTradeAdminBrokerage = (params: TradeAdminBrokerageParams) =>
  useQuery({
    queryKey: [
      "trade-admin-brokerage",
      params.symbol ?? "",
      params.from ?? "",
      params.to ?? "",
      params.page,
      params.limit,
    ],
    queryFn: () => getTradeAdminBrokerage(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
