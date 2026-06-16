import { getToken } from "@/lib/auth/session";
import { apiFetch } from "./client";
import type { PageResponse } from "./types";

/**
 * Analítica de diagnósticos para el dashboard admin.
 * Backend real: report-service vía Gateway (read-model global), bajo /api/reports.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

export type DiagnosisStatus = "PENDING" | "CONFIRMED" | "REJECTED";

export type AdminDiagnosis = {
  id: string;
  pestType: string | null;
  pestName: string;
  scientificName: string;
  confidence: number | null;
  severity: number | null;
  source: string | null;
  latitude: string | null;
  longitude: string | null;
  capturedAt: string | null;
  status: DiagnosisStatus;
  farmerLabel: string;
};

export type DashboardStats = {
  activeFarmers: number;
  totalDiagnoses: number;
  pendingValidation: number;
  criticalAlerts: number;
  healthyCount: number;
  affectedCount: number;
  avgConfidence: number;
  topPest: string | null;
  byPest: { pestType: string; pestName: string; count: number }[];
};

export type ZoneStat = {
  latitude: number;
  longitude: number;
  pestType: string;
  count: number;
};

export type ListDiagnosesParams = {
  pest?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
};

/** Opciones de filtro de plaga (valor = enum del backend). */
export const PEST_OPTIONS: { value: string; label: string }[] = [
  { value: "ALL", label: "Todas las plagas" },
  { value: "RUST", label: "Roya del cafeto" },
  { value: "MINER", label: "Minador de la hoja" },
  { value: "PHOMA", label: "Phoma del cafeto" },
  { value: "REDSPIDER", label: "Araña roja" },
  { value: "HEALTHY", label: "Hoja sana" },
];

export const diagnosesService = {
  dashboardStats(): Promise<DashboardStats> {
    return apiFetch<DashboardStats>("/reports/dashboard/stats", { method: "GET" });
  },

  list(params: ListDiagnosesParams): Promise<PageResponse<AdminDiagnosis>> {
    return apiFetch<PageResponse<AdminDiagnosis>>("/reports/diagnoses", {
      method: "GET",
      searchParams: {
        pest: params.pest === "ALL" ? undefined : params.pest,
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        page: params.page,
        size: params.size,
      },
    });
  },

  zoneStats(): Promise<ZoneStat[]> {
    return apiFetch<ZoneStat[]>("/reports/stats/zone", { method: "GET" });
  },

  async exportCsv(params: ListDiagnosesParams): Promise<void> {
    const token = getToken();
    const url = new URL(`${API_BASE_URL}/reports/diagnoses/export`);
    if (params.pest && params.pest !== "ALL") url.searchParams.set("pest", params.pest);
    if (params.dateFrom) url.searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) url.searchParams.set("dateTo", params.dateTo);
    const res = await fetch(url.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw { status: res.status, message: "No se pudo exportar" };
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "diagnosticos.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  },
};
