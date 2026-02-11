import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getTradeAdminPendingOrders,
  type TradeAdminPendingOrdersParams,
} from "@/services/tradeAdmin.service";

export const useTradeAdminPendingOrders = (
  params: TradeAdminPendingOrdersParams
) =>
  useQuery({
    queryKey: [
      "trade-admin-pending-orders",
      params.page,
      params.limit,
      params.status ?? "",
      params.symbol ?? "",
      params.userId ?? "",
      params.accountId ?? "",
      params.orderId ?? "",
      params.executedPositionId ?? "",
      params.side ?? "",
      params.orderType ?? "",
      params.orderKind ?? "",
      params.from ?? "",
      params.to ?? "",
      params.timeField ?? "",
      params.sortBy ?? "",
      params.sortDir ?? "",
    ],
    queryFn: () => getTradeAdminPendingOrders(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
