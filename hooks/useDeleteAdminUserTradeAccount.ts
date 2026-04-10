import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminUserTradeAccount } from "@/services/user.service";

export const useDeleteAdminUserTradeAccount = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      accountId: string;
      userId?: string;
    }) => deleteAdminUserTradeAccount(variables.accountId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["admin-user-accounts", variables.userId] });
      qc.invalidateQueries({ queryKey: ["admin-user", variables.userId] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-user-transactions", variables.userId] });
    },
  });
};
