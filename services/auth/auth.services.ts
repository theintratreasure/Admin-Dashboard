import api from "@/api/axios";

export type LoginPayload = {
  email: string;
  password: string;
  fcmToken: null;
};

export type LoginResponse = {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    role: string;
  };
};

export type LogoutPayload = {
  refreshToken: string;
};

export const loginService = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", payload);
  return res.data;
  
};

export const logoutService = async (refreshToken: string) => {
  const res = await api.post("/auth/logout", {
    refreshToken,
  });
  return res.data;
};