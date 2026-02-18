import { useMemo } from "react";
import { useInstruments } from "./useInstruments";

const MAX_INSTRUMENTS = 2000;

export function useInstrumentPrecisionMap() {
  const query = useInstruments({ page: 1, limit: MAX_INSTRUMENTS });

  const map = useMemo<Record<string, number>>(() => {
    const next: Record<string, number> = {};
    const rows = query.data?.data ?? [];
    rows.forEach((row) => {
      if (!row.code) return;
      next[row.code.toUpperCase()] = row.pricePrecision;
    });
    return next;
  }, [query.data?.data]);

  return { map, isLoading: query.isLoading };
}
