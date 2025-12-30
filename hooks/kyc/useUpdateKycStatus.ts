import { updateKycStatusService } from "@/services/kyc/kyc.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateArgs = {
  id: string;
  payload: {
    status: "VERIFIED" | "REJECTED";
    rejectionReason?: string;
  };
};

export function useUpdateKycStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateArgs) =>
      updateKycStatusService(id, payload),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-kyc"] });
    },
  });
}
