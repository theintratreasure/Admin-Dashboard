import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { getAdminKycService, KycStatus } from "@/services/kyc/kyc.services";

interface UseGetAdminAllKycParams {
  status?: KycStatus;
  page?: number;
  limit?: number;
}

export const useGetAdminAllKyc = ({
  status,
  page = 1,
  limit = 10,
}: UseGetAdminAllKycParams) => {
  return useQuery({
    queryKey: ["admin-all-kyc", status, page, limit],
    queryFn: () =>
      getAdminKycService({
        status,
        page,
        limit,
      }),

  
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });
};
