import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ListUsersParams } from "@/lib/api/types";
import { usersService } from "@/lib/api/users";

export const usersKeys = {
  all: ["users"] as const,
  list: (params: ListUsersParams) =>
    [...usersKeys.all, "list", params] as const,
  detail: (id: string) => [...usersKeys.all, "detail", id] as const,
};

/**
 * Devuelve el estado completo de TanStack Query.
 * `isLoading` = primera carga (sin datos).
 * `isFetching` = cualquier refetch en background (con datos visibles).
 * `isError` + `refetch` para el camino de fallback.
 */
export function useUsers(params: ListUsersParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
    placeholderData: keepPreviousData,
  });
}
