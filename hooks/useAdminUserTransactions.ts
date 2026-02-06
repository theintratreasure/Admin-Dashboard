import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAdminUserTransactions } from "@/services/user.service";

export const useAdminUserTransactions = ({
  userId,
  page,
  limit,
  fromDate,
  toDate,
  type,
  status,
  referenceId,
  account,
  sortBy,
  sortDir,
}: {
  userId?: string;
  page: number;
  limit: number;
  fromDate?: string;
  toDate?: string;
  type?: string;
  status?: string;
  referenceId?: string;
  account?: string;
  sortBy?: string;
  sortDir?: string;
}) =>
  useQuery({
    queryKey: [
      "admin-transactions",
      userId,
      page,
      limit,
      fromDate,
      toDate,
      type,
      status,
      referenceId,
      account,
      sortBy,
      sortDir,
    ],
    queryFn: () =>
      fetchAdminUserTransactions(userId as string, {
        page,
        limit,
        fromDate,
        toDate,
        type,
        status,
        referenceId,
        account,
        sortBy,
        sortDir,
      }),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
