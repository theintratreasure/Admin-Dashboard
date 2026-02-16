import { useMutation } from "@tanstack/react-query";
import { creditBonus, type BonusCreditPayload } from "@/services/adminBonus.service";

export const useBonusCredit = () =>
  useMutation({
    mutationFn: (payload: BonusCreditPayload) => creditBonus(payload),
  });
