import { paymentService } from "@/services/payment-method/payment-method.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTogglePaymentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      paymentService.toggle(id, is_active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-methods"] }),
  });
};
