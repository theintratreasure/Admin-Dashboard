import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInstrument } from "@/services/instrument.service";

export const useCreateInstrument = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createInstrument,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["instruments"] });
    },
  });
};
