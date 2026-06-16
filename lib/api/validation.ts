import { apiFetch } from "./client";
import type { AdminDiagnosis } from "./diagnoses";
import type { PageResponse } from "./types";

/**
 * Cola de validación fitosanitaria. Backend real: report-service vía Gateway,
 * bajo /api/reports/validation-queue y /api/reports/diagnoses/{id}/{validate,reject}.
 */

export const validationService = {
  queue(page = 0, size = 20): Promise<PageResponse<AdminDiagnosis>> {
    return apiFetch<PageResponse<AdminDiagnosis>>("/reports/validation-queue", {
      method: "GET",
      searchParams: { page, size },
    });
  },

  validate(id: string, label: string | undefined, confirmed: boolean): Promise<AdminDiagnosis> {
    return apiFetch<AdminDiagnosis>(`/reports/diagnoses/${id}/validate`, {
      method: "POST",
      body: { label: label || null, confirmed },
    });
  },

  reject(id: string): Promise<AdminDiagnosis> {
    return apiFetch<AdminDiagnosis>(`/reports/diagnoses/${id}/reject`, { method: "POST" });
  },
};
