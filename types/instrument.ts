export type InstrumentSegment =
  | "COMEX"
  | "FOREX"
  | "CRYPTO"
  | "US Stocks"
  | "US Indices";

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

