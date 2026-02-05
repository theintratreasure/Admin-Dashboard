import { useQuery } from "@tanstack/react-query";
import { getInstruments } from "@/services/instrument.service";

export const useInstruments = ({
  page,
  limit,
  segment,
}: {
  page: number;
  limit: number;
  segment?: string;
}) => {
  return useQuery({
    queryKey: ["instruments", page, limit, segment],
    queryFn: () => getInstruments({ page, limit, segment }),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
