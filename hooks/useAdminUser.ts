import { useQuery } from "@tanstack/react-query";
import { fetchAdminUserById } from "@/services/user.service";

export const useAdminUser = (userId?: string) =>
  useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => fetchAdminUserById(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      if (status === 404) return false;
      return failureCount < 2;
    },
  });
