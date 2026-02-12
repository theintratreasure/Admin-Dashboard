import { useMutation } from "@tanstack/react-query";
import {
  resetAccountTradePassword,
  resetAccountWatchPassword,
} from "@/services/accountAuth.service";

export const useResetAccountTradePassword = () =>
  useMutation({
    mutationFn: ({ accountId, newPassword }: { accountId: string; newPassword: string }) =>
      resetAccountTradePassword(accountId, newPassword),
  });

export const useResetAccountWatchPassword = () =>
  useMutation({
    mutationFn: ({ accountId, newPassword }: { accountId: string; newPassword: string }) =>
      resetAccountWatchPassword(accountId, newPassword),
  });
