import { useQuery } from "@tanstack/react-query";
import {
  getAdminNotificationsService,
  NotificationListResponse,
} from "@/services/notification/notification.services";

interface UseGetAdminNotificationsProps {
  page: number;
  limit: number;
}

export const useGetAdminNotifications = ({
  page,
  limit,
}: UseGetAdminNotificationsProps) => {
  return useQuery({
    queryKey: ["admin-notifications", page, limit] as const,
    queryFn: () => getAdminNotificationsService(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
