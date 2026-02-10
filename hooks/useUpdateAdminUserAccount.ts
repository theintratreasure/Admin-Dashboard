import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdminUserAccount } from "@/services/user.service";
import type { AdminAccountUpdatePayload } from "@/types/account";

export const useUpdateAdminUserAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: AdminAccountUpdatePayload;
    }) => updateAdminUserAccount(accountId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-accounts"] });
    },
  });
};
