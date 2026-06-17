import { useQuery } from "@tanstack/react-query";
import { diagnosesService } from "@/lib/api/diagnoses";

export function useDiagnosisDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["diagnosis-detail", id],
    queryFn: () => diagnosesService.getById(id as string),
    enabled: Boolean(id),
    staleTime: 30000,
  });
}
