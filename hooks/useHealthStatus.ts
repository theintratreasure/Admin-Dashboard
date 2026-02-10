import { useQuery } from "@tanstack/react-query";
import { getHealthStatus } from "@/services/health.service";
import type { HealthResponse } from "@/types/health";

export const useHealthStatus = () =>
  useQuery<HealthResponse>({
    queryKey: ["system-health-status"],
    queryFn: getHealthStatus,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
