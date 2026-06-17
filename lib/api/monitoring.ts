import { apiFetch } from "./client";

/**
 * Estado de la plataforma. Backend real: report-service vía Gateway, bajo /api/monitoring.
 */

export type ServiceHealth = {
  name: string;
  status: "UP" | "DOWN";
  instances: number;
  latencyMs: number | null;
};

export type InfraStatus = {
  name: string;
  status: "UP" | "DOWN";
};

export const monitoringService = {
  services(): Promise<ServiceHealth[]> {
    return apiFetch<ServiceHealth[]>("/monitoring/services", { method: "GET" });
  },
  infrastructure(): Promise<InfraStatus[]> {
    return apiFetch<InfraStatus[]>("/monitoring/infrastructure", { method: "GET" });
  },
};
