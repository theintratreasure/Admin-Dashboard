import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  approveDeposit,
  rejectDeposit
} from "@/services/adminDeposit.service";

export const useApproveDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveDeposit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-deposits"] })
  });
};

export const useRejectDeposit = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectDeposit(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-deposits"] })
  });
};
