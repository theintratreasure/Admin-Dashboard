import api from "@/api/axios";

/* ================= TYPES ================= */

export interface Holiday {
  _id: string;
  title: string;
  date: string;
  isActive: boolean;
  expireAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HolidayListResponse {
  data: Holiday[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* ================= SERVICES ================= */

export const holidayService = {
  getAll: async (page = 1, limit = 10): Promise<HolidayListResponse> => {
    const { data } = await api.get(
      `/holidays?page=${page}&limit=${limit}`
    );
    return data;
  },

  create: async (payload: { title: string; date: string }) => {
    const { data } = await api.post("/holidays", payload);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<{ title: string; isActive: boolean }>
  ) => {
    const { data } = await api.put(`/holidays/${id}`, payload);
    return data.data;
  },

  remove: async (id: string) => {
    const { data } = await api.delete(`/holidays/${id}`);
    return data;
  },
};
