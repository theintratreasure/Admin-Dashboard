import { paymentService } from "@/services/payment-method/payment-method.service";
import { useQuery } from "@tanstack/react-query";

export const usePaymentMethods = () =>
  useQuery({
    queryKey: ["payment-methods"],
    queryFn: paymentService.list,
    staleTime: 1000 * 60 * 5,
  });
