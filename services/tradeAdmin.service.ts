import api from "@/api/axios";

export type TradeAdminSummary = {
  activePositions: number;
  activePendingOrders: number;
  activeUsers: number;
  activeTradingAccounts: number;
};

export const getTradeAdminSummary = async (): Promise<TradeAdminSummary> => {
  const res = await api.get("/trade-admin/summary");
  return res.data?.data;
};
