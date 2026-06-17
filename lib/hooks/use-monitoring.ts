import { useQuery } from "@tanstack/react-query";
import { monitoringService } from "@/lib/api/monitoring";

export const monitoringKeys = {
  all: ["monitoring"] as const,
  services: () => [...monitoringKeys.all, "services"] as const,
  infrastructure: () => [...monitoringKeys.all, "infrastructure"] as const,
};

export function useServices() {
  return useQuery({
    queryKey: monitoringKeys.services(),
    queryFn: () => monitoringService.services(),
    refetchInterval: 10000,
  });
}

export function useInfrastructure() {
  return useQuery({
    queryKey: monitoringKeys.infrastructure(),
    queryFn: () => monitoringService.infrastructure(),
    refetchInterval: 15000,
  });
}
