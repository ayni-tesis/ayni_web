import { apiFetch } from "./client";
import type {
  ListPlaguesParams,
  PageResponse,
  Plague,
  PlagueTagKind,
  Severity,
} from "./types";

/**
 * Catálogo de plagas. Backend real: diagnosis-service vía Gateway,
 * bajo /api/diagnoses/plagues. Lectura: cualquier usuario; escritura: AGRONOMIST/ADMIN.
 */

export type PlagueInput = {
  commonName: string;
  scientificName?: string;
  description?: string;
  severity: Severity;
  tags?: PlagueTagKind[];
  imageUrl?: string | null;
  estimatedLossPercent?: number;
};

export type PlaguesService = {
  list(params: ListPlaguesParams): Promise<PageResponse<Plague>>;
  getById(id: string): Promise<Plague>;
  create(input: PlagueInput): Promise<Plague>;
  update(id: string, input: Partial<PlagueInput>): Promise<Plague>;
  remove(id: string): Promise<void>;
};

export const plaguesService: PlaguesService = {
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

  create(input) {
    return apiFetch<Plague>("/diagnoses/plagues", { method: "POST", body: input });
  },

  update(id, input) {
    return apiFetch<Plague>(`/diagnoses/plagues/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  remove(id) {
    return apiFetch<void>(`/diagnoses/plagues/${id}`, { method: "DELETE" });
  },
};

// Helpers de UI
export const SEVERITY_ORDER: Severity[] = [
  "CRITICAL",
  "HIGH_RISK",
  "MODERATE",
  "LOW",
];
