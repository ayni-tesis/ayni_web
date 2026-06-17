import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/lib/api/search";

export const searchKeys = {
  all: ["search"] as const,
  query: (q: string) => [...searchKeys.all, q] as const,
};

/** Búsqueda global. Se activa con 2+ caracteres (el componente aplica debounce). */
export function useGlobalSearch(q: string) {
  const term = q.trim();
  return useQuery({
    queryKey: searchKeys.query(term),
    queryFn: () => searchService.query(term),
    enabled: term.length >= 2,
    staleTime: 10000,
  });
}
