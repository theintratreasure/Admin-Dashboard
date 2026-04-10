import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminUser } from "@/services/user.service";

export const useDeleteAdminUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteAdminUser(userId),
    onSuccess: (_, userId) => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-user", userId] });
      qc.invalidateQueries({ queryKey: ["admin-user-accounts", userId] });
    },
  });
};
