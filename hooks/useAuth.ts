import { useMutation } from "@tanstack/react-query";
import { loginService, logoutService } from "@/services/auth/auth.services";

export const useLogin = () =>
  useMutation({
    mutationFn: loginService,
  });
/* ---------- LOGOUT ---------- */
export const useLogout = () =>
  useMutation({
    mutationFn: logoutService,
  });