import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type AlertRuleInput, alertsService } from "@/lib/api/alerts";

export const alertsKeys = {
  all: ["alerts"] as const,
  list: () => [...alertsKeys.all, "list"] as const,
};

export function useAlertRules() {
  return useQuery({
    queryKey: alertsKeys.list(),
    queryFn: () => alertsService.list(),
  });
}

export function useCreateRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AlertRuleInput) => alertsService.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: alertsKeys.all }),
  });
}

export function useUpdateRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AlertRuleInput }) =>
      alertsService.update(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: alertsKeys.all }),
  });
}

export function useDeleteRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertsService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: alertsKeys.all }),
  });
}
