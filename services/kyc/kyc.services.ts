import api from "@/api/axios";


export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface UpdateKycPayload {
  status: "VERIFIED" | "REJECTED";
  rejectionReason?: string;
}

export const getAdminKycService = async ({
  status,
  page = 1,
  limit = 10,
}: {
  status?: KycStatus;
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/kyc/admin", {
    params: {
      ...(status ? { status } : {}),
      page,
      limit,
    },
    headers: {
      "Cache-Control": "no-cache",
    },
  });

  return res.data;
};


export const updateKycStatusService = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateKycPayload;
}) => {
  const res = await api.put(`/kyc/admin/${id}/status`, payload);
  return res.data;
};
