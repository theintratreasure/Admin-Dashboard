import { keepPreviousData, useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  getTradeAdminUsersFunds,
  type TradeAdminUsersFundsParams,
  type TradeAdminUsersFundsResponse,
} from "@/services/userFunds.service";

export const useAdminUserFunds = (
  params: TradeAdminUsersFundsParams
): UseQueryResult<TradeAdminUsersFundsResponse, Error> =>
  useQuery<TradeAdminUsersFundsResponse, Error, TradeAdminUsersFundsResponse>({
    queryKey: [
      "trade-admin-users-funds",
      params.page,
      params.limit,
      params.q ?? "",
      params.userId ?? "",
      params.userType ?? "",
      params.isMailVerified ?? "",
      params.kycStatus ?? "",
      params.accountType ?? "",
      params.accountStatus ?? "",
      params.currency ?? "",
      params.sortBy ?? "",
      params.sortDir ?? "",
    ],
    queryFn: () => getTradeAdminUsersFunds(params),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
