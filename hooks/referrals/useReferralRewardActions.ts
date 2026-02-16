import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveReferralReward,
  rejectReferralReward,
} from "@/services/adminReferralReward.service";

export const useApproveReferralReward = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveReferralReward,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-referral-rewards"] }),
  });
};

export const useRejectReferralReward = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectReferralReward(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-referral-rewards"] }),
  });
};
