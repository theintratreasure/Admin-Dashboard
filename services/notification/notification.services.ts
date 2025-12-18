import api from "@/api/axios";

export type BroadcastNotificationPayload = {
  title: string;
  message: string;
  data?: {
    type?: string;
  };
};

export async function broadcastNotificationService(
  payload: BroadcastNotificationPayload
) {
  const res = await api.post(
    "/notification/admin/broadcast",
    payload
  );
  return res.data;
}
