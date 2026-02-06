import { useQuery } from "@tanstack/react-query";
import { fetchAdminUserAccounts } from "@/services/user.service";

export const useAdminUserAccounts = ({
  userId,
  page = 1,
  limit = 50,
}: {
  userId?: string;
  page?: number;
  limit?: number;
}) =>
  useQuery({
    queryKey: ["admin-user-accounts", userId, page, limit],
    queryFn: () =>
      fetchAdminUserAccounts(userId as string, {
        page,
        limit,
      }),
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
