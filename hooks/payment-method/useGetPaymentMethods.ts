import { useQuery } from "@tanstack/react-query";
import { getPaymentMethodsService } from "@/services/payment-method/paymentMethod.services";

export const useGetPaymentMethods = () =>
  useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethodsService,
  });
