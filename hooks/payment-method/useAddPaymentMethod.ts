import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addPaymentMethodService } from "@/services/payment-method/paymentMethod.services";

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPaymentMethodService,

    onSuccess: () => {
      
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
  });
};
