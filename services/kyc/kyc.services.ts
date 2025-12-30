import api from "@/api/axios";
import { KycStatus, AdminKycListResponse } from "./kyc.types";

export const getAdminKycService = async ({
  status,
  page,
  limit,
}: {
  status?: KycStatus;
  page: number;
  limit: number;
}): Promise<AdminKycListResponse> => {
  const res = await api.get("/kyc/admin", {
    params: {
      ...(status ? { status } : {}), // ALL => status removed
      page,
      limit,
    },
  });

  return res.data;
};
export async function updateKycStatusService(
  id: string,
  payload: { status: "VERIFIED" | "REJECTED"; rejectionReason?: string }
) {
  const res = await api.put(`/kyc/admin/${id}/status`, payload);
  return res.data;
}