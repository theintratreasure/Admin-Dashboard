import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethodService } from "@/services/payment-method/paymentMethod.services";

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePaymentMethodService(id),

    onSuccess: () => {
      // 🔥 payment list auto refresh
      queryClient.invalidateQueries({
        queryKey: ["payment-methods"],
      });
    },
  });
};
