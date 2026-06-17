import { apiFetch } from "./client";

/**
 * Búsqueda global. Backend real: report-service agrega resultados de varios
 * servicios (plagas + caficultores) vía Gateway bajo /api/search. Solo AGRONOMIST/ADMIN.
 */

export type SearchResultType = "PLAGUE" | "USER";

export type SearchResult = {
  type: SearchResultType | string;
  id: string;
  title: string | null;
  subtitle: string | null;
};

export type SearchResponse = {
  query: string;
  results: SearchResult[];
};

export const searchService = {
  query(q: string): Promise<SearchResponse> {
    return apiFetch<SearchResponse>("/search", {
      method: "GET",
      searchParams: { q },
    });
  },
};
