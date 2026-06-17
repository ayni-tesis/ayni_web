import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type GenerateReportInput,
  type Report,
  reportsService,
} from "@/lib/api/reports";
import type { PageResponse } from "@/lib/api/types";

export const reportsKeys = {
  all: ["reports"] as const,
  list: (page: number, size: number) =>
    [...reportsKeys.all, "list", page, size] as const,
};

/**
 * Lista de reportes. Mientras haya alguno en GENERATING, refresca cada 2s
 * (polling) para reflejar el paso a READY/FAILED.
 */
export function useReports(page = 0, size = 20) {
  return useQuery({
    queryKey: reportsKeys.list(page, size),
    queryFn: () => reportsService.list(page, size),
    refetchInterval: (query) => {
      const data = query.state.data as PageResponse<Report> | undefined;
      const generating = data?.content.some((r) => r.status === "GENERATING");
      return generating ? 2000 : false;
    },
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GenerateReportInput) => reportsService.generate(input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: reportsKeys.all }),
  });
}
