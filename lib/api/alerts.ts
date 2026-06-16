import { apiFetch } from "./client";
import type { PageResponse } from "./types";

/**
 * Reglas de alerta fitosanitaria. Backend real: notification-service vía Gateway,
 * bajo /api/alerts/rules. La severidad (severityThreshold) va en [0,1].
 */

export type AlertRule = {
  id: string;
  name: string;
  pestType: string | null;
  severityThreshold: number;
  zone: string | null;
  channel: string;
  recipients: string | null;
  status: "ACTIVE" | "PAUSED";
  createdAt: string;
};

export type AlertRuleInput = {
  name?: string;
  pestType?: string | null;
  severityThreshold?: number;
  zone?: string | null;
  channel?: string;
  recipients?: string | null;
  status?: string;
};

export const PEST_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Cualquier plaga" },
  { value: "RUST", label: "Roya del cafeto" },
  { value: "MINER", label: "Minador de la hoja" },
  { value: "PHOMA", label: "Phoma del cafeto" },
  { value: "REDSPIDER", label: "Araña roja" },
  { value: "HEALTHY", label: "Hoja sana" },
];

export const alertsService = {
  list(page = 0, size = 50): Promise<PageResponse<AlertRule>> {
    return apiFetch<PageResponse<AlertRule>>("/alerts/rules", {
      method: "GET",
      searchParams: { page, size },
    });
  },
  create(input: AlertRuleInput): Promise<AlertRule> {
    return apiFetch<AlertRule>("/alerts/rules", { method: "POST", body: input });
  },
  update(id: string, input: AlertRuleInput): Promise<AlertRule> {
    return apiFetch<AlertRule>(`/alerts/rules/${id}`, { method: "PATCH", body: input });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/alerts/rules/${id}`, { method: "DELETE" });
  },
};
