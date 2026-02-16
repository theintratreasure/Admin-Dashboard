import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBonusSettings,
  updateBonusSettings,
  type BonusSettingsPayload,
} from "@/services/adminBonus.service";

export const bonusSettingsQueryKey = ["bonus-settings"] as const;

export const useBonusSettings = () =>
  useQuery({
    queryKey: bonusSettingsQueryKey,
    queryFn: getBonusSettings,
    refetchOnWindowFocus: true,
  });

export const useUpdateBonusSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BonusSettingsPayload) => updateBonusSettings(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bonusSettingsQueryKey });
    },
  });
};
