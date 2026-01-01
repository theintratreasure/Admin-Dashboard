import { useMutation } from "@tanstack/react-query";
import { broadcastNotificationService } from "@/services/notification/notification.services";

export const useBroadcastNotification = () => {
  return useMutation({
    mutationFn: (payload: any) => broadcastNotificationService(payload),
  });
};
