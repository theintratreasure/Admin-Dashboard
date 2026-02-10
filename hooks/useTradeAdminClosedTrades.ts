import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getTradeAdminClosedTrades,
  type TradeAdminClosedTradesParams,
} from "@/services/tradeAdmin.service";

export const useTradeAdminClosedTrades = (params: TradeAdminClosedTradesParams) =>
  useQuery({
    queryKey: [
      "trade-admin-closed-trades",
      params.page,
      params.limit,
      params.userId ?? "",
      params.accountId ?? "",
      params.symbol ?? "",
      params.positionId ?? "",
      params.side ?? "",
      params.orderType ?? "",
      params.orderKind ?? "",
      params.from ?? "",
      params.to ?? "",
      params.timeField ?? "",
      params.sortBy ?? "",
      params.sortDir ?? "",
    ],
    queryFn: () => getTradeAdminClosedTrades(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
