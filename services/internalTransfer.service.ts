import api from "@/api/axios";

export type InternalTransferPayload = {
  fromAccount: string;
  toAccount: string;
  amount: number;
};

export type InternalTransferResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

export const createAdminInternalTransfer = async (
  payload: InternalTransferPayload
): Promise<InternalTransferResponse> => {
  const res = await api.post<InternalTransferResponse>(
    "/internal-transfer/admin/create",
    payload
  );

  if (res.data && typeof res.data === "object" && res.data.success === false) {
    const message = res.data.message || "Request failed.";
    throw new Error(message);
  }

  return res.data;
};

