import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getTradeAdminPendingOpenOrders,
  type TradeAdminPendingOpenParams,
} from "@/services/tradeAdmin.service";

export const useTradeAdminPendingOpenOrders = (
  params: TradeAdminPendingOpenParams
) =>
  useQuery({
    queryKey: [
      "trade-admin-pending-open",
      params.page,
      params.limit,
      params.userId ?? "",
      params.accountId ?? "",
      params.orderId ?? "",
      params.symbol ?? "",
      params.side ?? "",
      params.orderType ?? "",
      params.orderKind ?? "",
      params.from ?? "",
      params.to ?? "",
      params.timeField ?? "",
      params.sortBy ?? "",
      params.sortDir ?? "",
    ],
    queryFn: () => getTradeAdminPendingOpenOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
