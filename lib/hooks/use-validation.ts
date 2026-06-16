import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { validationService } from "@/lib/api/validation";

export const validationKeys = {
  all: ["validation"] as const,
  queue: () => [...validationKeys.all, "queue"] as const,
};

export function useValidationQueue() {
  return useQuery({
    queryKey: validationKeys.queue(),
    queryFn: () => validationService.queue(0, 20),
  });
}

export function useValidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, label, confirmed }: { id: string; label?: string; confirmed: boolean }) =>
      validationService.validate(id, label, confirmed),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: validationKeys.all }),
  });
}

export function useReject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => validationService.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: validationKeys.all }),
  });
}
