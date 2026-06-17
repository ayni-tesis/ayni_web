import { apiFetch } from "./client";

/**
 * Pipeline ML (solo lectura). Backend real: report-service proxea al ml-model-service
 * vía Gateway bajo /api/pipeline. Expone los modelos realmente cargados por el servicio
 * de inferencia. El versionado/rollback no está disponible (sin registro de modelos).
 */

export type PipelineStage = {
  stage: "LOCALIZATION" | "CLASSIFICATION" | string;
  name: string;
  framework: string;
  file: string;
  sizeBytes: number | null;
  loaded: boolean;
  params: Record<string, unknown>;
};

export type PipelineModels = {
  modelsLoaded: boolean;
  stages: PipelineStage[];
  fallbackFullImage: boolean;
  gradcamEnabled: boolean;
};

export const pipelineService = {
  models(): Promise<PipelineModels> {
    return apiFetch<PipelineModels>("/pipeline/models", { method: "GET" });
  },
};
