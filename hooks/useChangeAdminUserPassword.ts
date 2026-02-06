import { useMutation } from "@tanstack/react-query";
import { changeAdminUserPassword } from "@/services/user.service";

export const useChangeAdminUserPassword = () =>
  useMutation({
    mutationFn: ({ userId, newPassword }: { userId: string; newPassword: string }) =>
      changeAdminUserPassword(userId, newPassword),
  });
