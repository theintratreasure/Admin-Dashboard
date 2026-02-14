import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversionRates,
  updateConversionRates,
  type ConversionRatesPayload,
} from "@/services/conversionRate.service";

export const conversionRatesQueryKey = ["conversion-rates"] as const;

export const useConversionRates = () =>
  useQuery({
    queryKey: conversionRatesQueryKey,
    queryFn: getConversionRates,
    refetchOnWindowFocus: true,
  });

export const useUpdateConversionRates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ConversionRatesPayload) => updateConversionRates(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversionRatesQueryKey });
    },
  });
};
