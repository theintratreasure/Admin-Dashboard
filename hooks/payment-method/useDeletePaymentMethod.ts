import { paymentService } from "@/services/payment-method/payment-method.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeletePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-methods"] }),
  });
};
