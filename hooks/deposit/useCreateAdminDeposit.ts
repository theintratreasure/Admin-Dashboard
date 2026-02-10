import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminDeposit,
  CreateAdminDepositPayload,
} from "@/services/adminDeposit.service";

export const useCreateAdminDeposit = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminDepositPayload) =>
      createAdminDeposit(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deposits"] });
    },
  });
};
