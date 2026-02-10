import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminWithdrawal,
  CreateAdminWithdrawalPayload,
} from "@/services/withdrawal.service";

export const useCreateAdminWithdrawal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminWithdrawalPayload) =>
      createAdminWithdrawal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-withdrawals"] });
    },
  });
};
