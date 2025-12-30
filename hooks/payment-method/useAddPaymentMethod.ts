import { paymentService } from "@/services/payment-method/payment-method.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddPaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-methods"] }),
  });
};
