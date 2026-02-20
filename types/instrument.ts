export type InstrumentSegment =
  | "COMEX"
  | "FOREX"
  | "CRYPTO"
  | "ENERGY"
  | "US Stocks"
  | "US Indices";

export type SpreadMode = "FIXED" | "ADD_ON";

export interface Instrument {
  _id: string;
  code: string;
  name: string;
  segment: string;

  lotSize: number;
  minQty: number;
  maxQty: number;
  qtyPrecision: number;

  pricePrecision: number;
  tickSize?: number | null;
  spread: number;
  spread_mode?: SpreadMode;

  contractSize: number;

  swapEnabled: boolean;
  swapLong: number;
  swapShort: number;

  isActive: boolean;
  isTradeable: boolean;
}

export interface InstrumentListResponse {
  success: boolean;
  data: Instrument[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

