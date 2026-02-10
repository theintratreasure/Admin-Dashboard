import api from "@/api/axios";

export type TradeAdminSummary = {
  activePositions: number;
  activePendingOrders: number;
  activeUsers: number;
  activeTradingAccounts: number;
};

export type TradeAdminBrokerageItem = {
  _id: string;
  user_id: string;
  account_id: string;
  trade_id: string;
  symbol: string;
  spread: number;
  commission: number;
  swap: number;
  pnl: number;
  createdAt: string;
  updatedAt: string;
};

export type TradeAdminBrokeragePagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TradeAdminBrokerageResponse = {
  success?: boolean;
  data: TradeAdminBrokerageItem[];
  pagination?: TradeAdminBrokeragePagination;
};

export type TradeAdminBrokerageParams = {
  symbol?: string;
  from?: string;
  to?: string;
  page: number;
  limit: number;
};

export type TradeSide = "BUY" | "SELL";
export type TradeOrderType =
  | "MARKET"
  | "BUY_LIMIT"
  | "SELL_LIMIT"
  | "BUY_STOP"
  | "SELL_STOP";
export type TradeOrderKind = "MARKET" | "LIMIT" | "STOP";
export type TradeTimeField = "closeTime" | "openTime" | "createdAt";
export type TradeSortDir = "asc" | "desc";

export type TradeAdminClosedTrade = {
  _id: string;
  userId: string;
  accountId: string;
  ipAddress?: string;
  positionId: string;
  symbol: string;
  side: TradeSide | string;
  orderType: TradeOrderType | string;
  status: string;
  volume: number;
  contractSize: number;
  leverage: number;
  openPrice: number;
  entryPrice: number;
  closePrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  marginUsed: number;
  grossPnL: number;
  commission: number;
  spread: number;
  swap: number;
  realizedPnL: number;
  openTime?: string;
  closeTime?: string;
  closeReason?: string;
  engineVersion?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TradeAdminClosedTradesPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type TradeAdminClosedTradesResponse = {
  success?: boolean;
  data: TradeAdminClosedTrade[];
  pagination?: TradeAdminClosedTradesPagination;
};

export type TradeAdminClosedTradesParams = {
  page: number;
  limit: number;
  userId?: string;
  accountId?: string;
  symbol?: string;
  positionId?: string;
  side?: TradeSide;
  orderType?: TradeOrderType;
  orderKind?: TradeOrderKind;
  from?: string;
  to?: string;
  timeField?: TradeTimeField;
  sortBy?: TradeTimeField;
  sortDir?: TradeSortDir;
};

export const getTradeAdminSummary = async (): Promise<TradeAdminSummary> => {
  const res = await api.get("/trade-admin/summary");
  return res.data?.data;
};

export const getTradeAdminBrokerage = async (
  params: TradeAdminBrokerageParams
): Promise<TradeAdminBrokerageResponse> => {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: params.limit,
  };

  if (params.symbol?.trim()) query.symbol = params.symbol.trim().toUpperCase();
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;

  const res = await api.get("/trade-admin/brokerage", { params: query });
  return res.data as TradeAdminBrokerageResponse;
};

export const getTradeAdminClosedTrades = async (
  params: TradeAdminClosedTradesParams
): Promise<TradeAdminClosedTradesResponse> => {
  const query: Record<string, string | number> = {
    page: params.page,
    limit: Math.min(Math.max(params.limit, 1), 100),
  };

  if (params.userId?.trim()) query.userId = params.userId.trim();
  if (params.accountId?.trim()) query.accountId = params.accountId.trim();
  if (params.symbol?.trim()) query.symbol = params.symbol.trim().toUpperCase();
  if (params.positionId?.trim()) query.positionId = params.positionId.trim();
  if (params.side) query.side = params.side;
  if (params.orderType) {
    query.orderType = params.orderType;
  } else if (params.orderKind) {
    query.orderKind = params.orderKind;
  }
  if (params.from) query.from = params.from;
  if (params.to) query.to = params.to;
  if (params.timeField) query.timeField = params.timeField;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortDir) query.sortDir = params.sortDir;

  const res = await api.get("/trade-admin/trades/closed", { params: query });
  return res.data as TradeAdminClosedTradesResponse;
};
