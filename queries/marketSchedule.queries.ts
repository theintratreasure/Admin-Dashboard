import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMarketSchedule,
  updateMarketSchedule,
  MarketSchedule,
} from "@/services/marketSchedule.service";

export const useMarketSchedule = (segment: string) => {
  return useQuery<MarketSchedule>({
    queryKey: ["market-schedule", segment],
    queryFn: () => getMarketSchedule(segment),
    enabled: !!segment,
  });
};

export const useUpdateMarketSchedule = (segment: string) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<MarketSchedule>) =>
      updateMarketSchedule(segment, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["market-schedule", segment],
      });
    },
  });
};
