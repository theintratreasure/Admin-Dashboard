import api from "@/api/axios";

type ResetPasswordResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export const resetAccountTradePassword = async (
  accountId: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const { data } = await api.post(
    `/account-auth/admin/${accountId}/reset-trade-password`,
    { newPassword }
  );
  return data as ResetPasswordResponse;
};

export const resetAccountWatchPassword = async (
  accountId: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const { data } = await api.post(
    `/account-auth/admin/${accountId}/reset-watch-password`,
    { newPassword }
  );
  return data as ResetPasswordResponse;
};
