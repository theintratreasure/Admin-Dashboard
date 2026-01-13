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
}) =>
  useQuery({
    queryKey: ["instruments", page, limit, segment ?? "ALL"],
    queryFn: () =>
      getInstruments({
        page,
        limit,
        segment,
      }),
    staleTime: 30_000,
  });
