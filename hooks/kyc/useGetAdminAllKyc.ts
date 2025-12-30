import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAdminKycService } from "@/services/kyc/kyc.services";
import {
  KycStatus,
  AdminKycListResponse,
} from "@/services/kyc/kyc.types";

interface Params {
  status?: KycStatus;
  page: number;
  limit: number;
}

export function useGetAdminAllKyc({
  status,
  page,
  limit,
}: Params) {
  return useQuery<AdminKycListResponse>({
    queryKey: ["admin-kyc", status ?? "ALL", page, limit],
    queryFn: () =>
      getAdminKycService({
        status,
        page,
        limit,
      }),

    // ✅ TanStack v5 correct way
    placeholderData: keepPreviousData,
  });
}
