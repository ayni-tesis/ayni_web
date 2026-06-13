import { MOCK_PLAGUES } from "@/lib/mock/plagues";
import { apiFetch } from "./client";
import type {
  ListPlaguesParams,
  PageResponse,
  Plague,
  Severity,
} from "./types";

/**
 * Contrato del catálogo de plagas. El backend lo expondrá bajo
 * /api/diagnoses/plagues cuando el microservicio diagnosis-service publique
 * el endpoint admin. Para migrar: cambiar NEXT_PUBLIC_USE_MOCK_API a false.
 */
export type PlaguesService = {
  list(params: ListPlaguesParams): Promise<PageResponse<Plague>>;
  getById(id: string): Promise<Plague>;
};

// ────────────────────────────────────────────────────────────
// Implementación real
// ────────────────────────────────────────────────────────────

const realPlaguesService: PlaguesService = {
  list(params) {
    const severities = params.severities?.length
      ? params.severities.join(",")
      : undefined;
    return apiFetch<PageResponse<Plague>>("/diagnoses/plagues", {
      method: "GET",
      searchParams: {
        page: params.page,
        size: params.size,
        search: params.search,
        severities,
      },
    });
  },

  getById(id) {
    return apiFetch<Plague>(`/diagnoses/plagues/${id}`, { method: "GET" });
  },
};

// ────────────────────────────────────────────────────────────
// Implementación mock
// ────────────────────────────────────────────────────────────

const SIMULATED_LATENCY_MS = 300;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), SIMULATED_LATENCY_MS),
  );
}

function matchesFilters(plague: Plague, params: ListPlaguesParams): boolean {
  if (
    params.severities?.length &&
    !params.severities.includes(plague.severity)
  ) {
    return false;
  }
  if (params.search) {
    const needle = params.search.toLowerCase();
    const haystack =
      `${plague.commonName} ${plague.scientificName} ${plague.description}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

const mockPlaguesService: PlaguesService = {
  list(params) {
    const page = params.page ?? 0;
    const size = params.size ?? 9;

    const filtered = MOCK_PLAGUES.filter((p) => matchesFilters(p, params));
    const start = page * size;
    const content = filtered.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(filtered.length / size));

    return delay<PageResponse<Plague>>({
      content,
      page,
      size,
      totalElements: filtered.length,
      totalPages,
      last: page >= totalPages - 1,
    });
  },

  getById(id) {
    const plague = MOCK_PLAGUES.find((p) => p.id === id);
    if (!plague) {
      return Promise.reject({ status: 404, message: "Plague not found" });
    }
    return delay(plague);
  },
};

// ────────────────────────────────────────────────────────────
// Selector
// ────────────────────────────────────────────────────────────

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const plaguesService: PlaguesService = useMock
  ? mockPlaguesService
  : realPlaguesService;

// Helpers de UI
export const SEVERITY_ORDER: Severity[] = [
  "CRITICAL",
  "HIGH_RISK",
  "MODERATE",
  "LOW",
];
