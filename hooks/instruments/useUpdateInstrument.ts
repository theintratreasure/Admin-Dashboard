import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInstrument } from "@/services/instrument.service";

export const useUpdateInstrument = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => updateInstrument(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instruments"] });
    },
  });
};
