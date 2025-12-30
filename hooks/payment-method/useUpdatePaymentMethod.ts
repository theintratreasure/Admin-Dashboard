import { paymentService } from "@/services/payment-method/payment-method.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdatePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: any) =>
      paymentService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-methods"] }),
  });
};
