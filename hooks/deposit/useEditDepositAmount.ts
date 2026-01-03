import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editDepositAmount } from "@/services/adminDeposit.service";

export const useEditDepositAmount = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      newAmount,
    }: {
      id: string;
      newAmount: number;
    }) => editDepositAmount(id, newAmount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deposits"] });
    },
  });
};
