import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminSignupService,
  type AdminSignupPayload,
} from "@/services/auth/auth.services";

export const useCreateAdminUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdminSignupPayload) => adminSignupService(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

