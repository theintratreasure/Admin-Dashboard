import { paymentService } from "@/services/payment-method/payment-method.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PaymentMethodPayload } from "@/services/payment-method/payment-method.service";

export const useUpdatePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<PaymentMethodPayload>;
    }) => paymentService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payment-methods"] }),
  });
};
