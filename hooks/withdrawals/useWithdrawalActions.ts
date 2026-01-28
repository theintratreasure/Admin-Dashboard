import { approveWithdrawal, rejectWithdrawal } from "@/services/withdrawal.service";
import { useMutation } from "@tanstack/react-query";

export const useApproveWithdrawal = () =>
  useMutation({
    mutationFn: approveWithdrawal,
  });

export const useRejectWithdrawal = () =>
  useMutation({
    mutationFn: rejectWithdrawal,
  });
