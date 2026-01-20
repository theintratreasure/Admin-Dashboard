import api from "@/api/axios";

export type MarketSchedule = {
  _id: string;
  segment: string;
  timezone: string;
  openTime: string;
  closeTime: string;
  weeklyOff: string[];
  holidays: string[];
  dayOverrides?: Record<string, { closeTime?: string }>;
  dateOverrides?: Record<string, { closeTime?: string }>;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};
export type MarketSegment = "forex" | "metal" | "crypto" | "indexes";

export const getMarketSchedule = async (
  segment: string
): Promise<MarketSchedule> => {
  const res = await api.get(`/market/schedule/${segment}`);

  // 🔴 VERY IMPORTANT SAFETY
  if (!res?.data) {
    throw new Error("Schedule not found");
  }

  return res.data; // ⬅️ NOT res.data.data
};

export const updateMarketSchedule = async (
  segment: string,
  payload: Partial<MarketSchedule>
): Promise<MarketSchedule> => {
  const res = await api.put(`/market/schedule/${segment}`, payload);
  return res.data;
};
