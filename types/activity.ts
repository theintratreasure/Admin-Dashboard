export type AdminActivityLog = {
  _id: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  action?: string;
  actor_type?: string;
  actor_id?: string | null;
  createdAt?: string;
};

export type AdminActivityListResponse = {
  success?: boolean;
  data: AdminActivityLog[];
  nextCursor?: string | null;
  limit?: number;
  message?: string;
};

export type AdminActivityParams = {
  userId?: string;
  limit?: number;
  cursor?: string;
  includeUser?: boolean;
};
