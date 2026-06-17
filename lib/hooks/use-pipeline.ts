import { useQuery } from "@tanstack/react-query";
import { pipelineService } from "@/lib/api/pipeline";

export const pipelineKeys = {
  all: ["pipeline"] as const,
  models: () => [...pipelineKeys.all, "models"] as const,
};

export function usePipelineModels() {
  return useQuery({
    queryKey: pipelineKeys.models(),
    queryFn: () => pipelineService.models(),
    refetchInterval: 30000,
  });
}
