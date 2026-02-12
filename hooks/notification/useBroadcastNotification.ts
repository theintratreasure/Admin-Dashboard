import { useMutation } from "@tanstack/react-query";
import { broadcastNotificationService } from "@/services/notification/notification.services";
import type { BroadcastNotificationPayload } from "@/services/notification/notification.services";

export const useBroadcastNotification = () => {
  return useMutation({
    mutationFn: (payload: BroadcastNotificationPayload) =>
      broadcastNotificationService(payload),
  });
};
