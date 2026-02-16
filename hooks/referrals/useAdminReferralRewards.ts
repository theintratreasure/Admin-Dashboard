import { useQuery } from "@tanstack/react-query";
import {
  getAdminReferralRewards,
  type AdminReferralRewardsListPayload,
  type GetReferralRewardsParams,
} from "@/services/adminReferralReward.service";

export const useAdminReferralRewards = (params: GetReferralRewardsParams) => {
  return useQuery<AdminReferralRewardsListPayload>({
    queryKey: ["admin-referral-rewards", params],
    queryFn: () => getAdminReferralRewards(params),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
};
