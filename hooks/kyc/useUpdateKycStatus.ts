import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKycStatusService } from "@/services/kyc/kyc.services";
import toast from "react-hot-toast";

interface UpdateKycArgs {
  kycId: string;
  payload: {
    status: "VERIFIED" | "REJECTED";
    rejectionReason?: string;
  };
}

export function useUpdateKycStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ kycId, payload }: UpdateKycArgs) =>
      updateKycStatusService({
        id: kycId,
        payload,
      }),

    onSuccess: () => {
      toast.success("KYC status updated successfully");

    
      queryClient.invalidateQueries({
        queryKey: ["admin-all-kyc"],
        exact: false,
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update KYC"
      );
    },
  });
}
