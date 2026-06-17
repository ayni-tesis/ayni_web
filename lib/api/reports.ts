import { getToken } from "@/lib/auth/session";
import { apiFetch } from "./client";
import type { PageResponse } from "./types";

/**
 * Servicio de reportes. Backend real: report-service vía Gateway, bajo /api/reports.
 * Generación asíncrona (estado GENERATING → READY); la descarga va autenticada (Bearer).
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export type ReportType = "SENASA_INCIDENT" | "PERSONAL_SUMMARY" | "ZONE_STATS";
export type ReportFormat = "PDF" | "CSV";
export type ReportStatus = "GENERATING" | "READY" | "FAILED";

export type Report = {
  id: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  fileName: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  region: string | null;
  district: string | null;
  rowCount: number | null;
  errorMessage: string | null;
  downloadAvailable: boolean;
  requestedAt: string;
  generatedAt: string | null;
};

export type GenerateReportInput = {
  type: ReportType;
  format: ReportFormat;
  periodStart?: string;
  periodEnd?: string;
  region?: string;
  district?: string;
};

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  SENASA_INCIDENT: "SENASA · Incidencia fitosanitaria",
  PERSONAL_SUMMARY: "Resumen personal de diagnósticos",
  ZONE_STATS: "Estadísticas por zona",
};

export const reportsService = {
  list(page = 0, size = 20): Promise<PageResponse<Report>> {
    return apiFetch<PageResponse<Report>>("/reports", {
      method: "GET",
      searchParams: { page, size },
    });
  },

  get(id: string): Promise<Report> {
    return apiFetch<Report>(`/reports/${id}`, { method: "GET" });
  },

  generate(input: GenerateReportInput): Promise<Report> {
    return apiFetch<Report>("/reports/generate", { method: "POST", body: input });
  },

  /** Descarga el archivo con el token (un <a href> no enviaría el Authorization). */
  async download(report: Report): Promise<void> {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/reports/${report.id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw { status: res.status, message: "No se pudo descargar el reporte" };
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = report.fileName ?? `reporte-${report.id}.${report.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },
};
