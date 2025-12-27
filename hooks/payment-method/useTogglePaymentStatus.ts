import { useMutation } from "@tanstack/react-query";
import { togglePaymentStatusService } from "@/services/payment-method/paymentMethod.services";

export const useTogglePaymentStatus = () =>
  useMutation({
    mutationFn: ({
      id,
      is_active,
    }: {
      id: string;
      is_active: boolean;
    }) => togglePaymentStatusService({ id, is_active }),
  });
