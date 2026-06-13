import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { plaguesService } from "@/lib/api/plagues";
import type { ListPlaguesParams } from "@/lib/api/types";

export const plaguesKeys = {
  all: ["plagues"] as const,
  list: (params: ListPlaguesParams) =>
    [...plaguesKeys.all, "list", params] as const,
  detail: (id: string) => [...plaguesKeys.all, "detail", id] as const,
};

export function usePlagues(params: ListPlaguesParams) {
  return useQuery({
    queryKey: plaguesKeys.list(params),
    queryFn: () => plaguesService.list(params),
    placeholderData: keepPreviousData,
  });
}
