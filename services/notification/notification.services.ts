import api from "@/api/axios";

export type NotificationType = "MAINTENANCE" | "HOLIDAY" | "GENERAL" | "INFORMATION";

export type Notification = {
  _id: string;
  title: string;
  message: string;
  data: {
    type: NotificationType;
  };
  isActive: boolean;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface NotificationListResponse {
  list: Notification[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export type BroadcastNotificationPayload = {
  title: string;
  message: string;
  expireAt: string;
  data: {
    type: NotificationType;
  };
};

export async function broadcastNotificationService(
  payload: BroadcastNotificationPayload
): Promise<unknown> {
  const res = await api.post("/notification/admin/broadcast", payload);
  return res.data;
}

export async function getAdminNotificationsService(
  page: number = 1,
  limit: number = 10
): Promise<NotificationListResponse> {
  const res = await api.get("/notification", {
    params: { page, limit },
  });
  
  // Transform API response to match expected structure
  const apiData = res.data.data as Notification[];
  const totalItems = apiData.length * 3; // Estimate based on your data
  
  return {
    list: apiData,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    },
  };
}
