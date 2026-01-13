import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInstrument } from "@/services/instrument.service";

export const useDeleteInstrument = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteInstrument,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instruments"] });
    },
  });
};
