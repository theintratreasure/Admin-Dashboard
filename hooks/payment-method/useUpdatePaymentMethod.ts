import { useMutation } from "@tanstack/react-query";
import { updatePaymentMethodService } from "@/services/payment-method/paymentMethod.services";

export const useUpdatePaymentMethod = () =>
  useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: any;
    }) => updatePaymentMethodService({ id, payload }),
  });
