import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUser } from "@/services/user.service";
import type { AdminUserUpdatePayload } from "@/types/user";

export const useUpdateAdminUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AdminUserUpdatePayload;
    }) => updateAdminUser(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-user", variables.id] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};
