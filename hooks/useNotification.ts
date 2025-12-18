import { useMutation } from "@tanstack/react-query";
import {
  broadcastNotificationService,
  BroadcastNotificationPayload,
} from "@/services/notification/notification.services";

export const useBroadcastNotification = () =>
  useMutation({
    mutationFn: (payload: BroadcastNotificationPayload) =>
      broadcastNotificationService(payload),
  });
