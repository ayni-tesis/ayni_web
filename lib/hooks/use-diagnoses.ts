import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { diagnosesService, type ListDiagnosesParams } from "@/lib/api/diagnoses";

export const diagnosesKeys = {
  all: ["diagnoses"] as const,
  stats: () => [...diagnosesKeys.all, "dashboard-stats"] as const,
  list: (params: ListDiagnosesParams) =>
    [...diagnosesKeys.all, "list", params] as const,
  zones: () => [...diagnosesKeys.all, "zones"] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: diagnosesKeys.stats(),
    queryFn: () => diagnosesService.dashboardStats(),
  });
}

export function useDiagnoses(params: ListDiagnosesParams) {
  return useQuery({
    queryKey: diagnosesKeys.list(params),
    queryFn: () => diagnosesService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useZoneStats() {
  return useQuery({
    queryKey: diagnosesKeys.zones(),
    queryFn: () => diagnosesService.zoneStats(),
  });
}
