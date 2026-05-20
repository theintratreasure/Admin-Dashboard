import { useMutation } from "@tanstack/react-query";
import {
  creditBonus,
  creditTradableFund,
  type BonusCreditPayload,
  type TradableFundCreditPayload,
} from "@/services/adminBonus.service";

export const useBonusCredit = () =>
  useMutation({
    mutationFn: (payload: BonusCreditPayload) => creditBonus(payload),
  });

export const useTradableFundCredit = () =>
  useMutation({
    mutationFn: (payload: TradableFundCreditPayload) => creditTradableFund(payload),
  });
