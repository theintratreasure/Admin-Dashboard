import api from "@/api/axios";

export type DefaultWatchlistItem = {
  code: string;
  name: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export async function fetchDefaultWatchlist() {
  const res = await api.get<ApiResponse<DefaultWatchlistItem[]>>(
    "/watchlist/default/list"
  );
  return res.data;
}

export async function addDefaultWatchlist(code: string) {
  const res = await api.post<ApiResponse<any>>(
    "/watchlist/default/add",
    { code }
  );
  return res.data;
}

export async function removeDefaultWatchlist(code: string) {
  const res = await api.delete<ApiResponse<any>>(
    `/watchlist/default/remove/${code}`
  );
  return res.data;
}
