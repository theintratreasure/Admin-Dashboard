import api from "@/api/axios";

export type NotificationType =
  | "MAINTENANCE"
  | "HOLIDAY"
  | "GENERAL"
  | "INFORMATION";

export type BroadcastNotificationPayload = {
  title: string;
  message: string;
  expireAt: string; // ISO
  data: {
    type: NotificationType;
  };
};

export async function broadcastNotificationService(
  payload: BroadcastNotificationPayload
) {
  const res = await api.post("/notification/admin/broadcast", payload);
  return res.data;
}
