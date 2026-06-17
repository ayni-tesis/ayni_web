"use client";

import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  History,
  Info,
  Layers,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import type { PipelineStage } from "@/lib/api/pipeline";
import { usePipelineModels } from "@/lib/hooks/use-pipeline";
import { t } from "@/lib/i18n/es";

const MODEL_HISTORY = [
  { version: "v2.1 (Activo)", stage: "Clasificación", model: "SmallPavicNet-MC", accuracy: "94.2% F1", loss: "0.08", date: "10 Jun 2026", status: "PRODUCTION" },
  { version: "v2.0", stage: "Clasificación", model: "EfficientNet-B0", accuracy: "91.8% F1", loss: "0.12", date: "28 May 2026", status: "ROLLBACKED" },
  { version: "v1.4 (Activo)", stage: "Localización", model: "YOLOv8-Leaf", accuracy: "92.4% mAP", loss: "0.15", date: "15 May 2026", status: "PRODUCTION" },
  { version: "v1.3", stage: "Localización", model: "YOLOv8-Leaf", accuracy: "89.1% mAP", loss: "0.21", date: "02 May 2026", status: "ARCHIVED" },
];

function formatBytes(bytes: number | null): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function num(params: Record<string, unknown>, key: string): string {
  const v = params[key];
  return typeof v === "number" ? String(v) : "—";
}

export default function PipelinePage() {
  const { data, isLoading, isError } = usePipelineModels();
  const stages = data?.stages ?? [];

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader title={t.pipelinePage.title} description={t.pipelinePage.description} />

      <div className="bg-secondary/40 border border-primary/20 text-gray-1 p-s2 rounded-xl flex items-start gap-s2">
        <Info size={18} className="shrink-0 mt-0.5 text-primary" />
        <div className="flex flex-col gap-s1 text-sm">
          <span className="font-bold text-primary">Modelos en vivo · historial de referencia</span>
          <span className="leading-relaxed text-gray-2">
            Los modelos cargados (abajo) se leen en tiempo real del{" "}
            <code>ml-model-service</code>. El historial de versiones es ilustrativo
            y el rollback está deshabilitado hasta integrar un registro de modelos.
          </span>
        </div>
      </div>

      {/* Diagrama de dos etapas (educativo) */}
      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <h6 className="text-h6 font-bold text-black-2">Diagrama Fitosanitario de Dos Etapas</h6>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-s3 bg-gray-5/30 border border-gray-5 rounded-2xl p-s3 relative overflow-hidden">
          <DiagramStep icon={<Database size={24} />} title="Imagen de Campo" desc="Foto tomada en la app móvil por el caficultor." tone="plain" />
          <ArrowRight className="hidden lg:block text-gray-4" size={20} />
          <DiagramStep icon={<Layers size={24} />} title="1. YOLOv8 (Localización)" desc="Detecta el contorno de la hoja y extrae el Bounding Box omitiendo el fondo." tone="primary" />
          <ArrowRight className="hidden lg:block text-gray-4" size={20} />
          <div className="flex flex-col items-center text-center max-w-[180px] z-10">
            <div className="h-14 w-14 rounded-xl bg-white border border-dashed border-gray-4 flex items-center justify-center text-gray-3 text-[10px] font-bold">RECORTADA</div>
            <span className="text-sm font-bold text-black-2 mt-s2">Segmento de Hoja</span>
            <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">Imagen normalizada aislada de hojas circundantes.</span>
          </div>
          <ArrowRight className="hidden lg:block text-gray-4" size={20} />
          <DiagramStep icon={<Cpu size={24} />} title="2. SmallPavicNet / EfficientNet" desc="Clasifica la severidad y tipo de plaga (Roya, Minador, Phoma, Cercospora)." tone="primary" />
          <ArrowRight className="hidden lg:block text-gray-4" size={20} />
          <DiagramStep icon={<CheckCircle2 size={24} />} title="Diagnóstico Fitosanitario" desc="Diagnóstico con certeza y recomendación de control." tone="solid" />
        </div>
      </div>

      {/* Modelos cargados (datos reales) */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-3">Cargando modelos…</div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-error">
          El servicio de modelos ML no está disponible.
        </div>
      ) : (
        <div className="grid gap-s3 grid-cols-1 md:grid-cols-2">
          {stages.map((stage) => (
            <ModelCard key={stage.stage} stage={stage} />
          ))}
        </div>
      )}

      {/* Historial de referencia (ilustrativo, rollback deshabilitado) */}
      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-base font-bold text-black-2">Historial de Despliegues (referencia)</h6>
            <p className="text-sm text-gray-3 font-normal mt-s1">
              Ejemplo ilustrativo. El registro real de versiones y la reversión llegarán con el model registry.
            </p>
          </div>
          <History size={20} className="text-gray-3" />
        </div>
        <div className="overflow-x-auto border-t border-gray-5">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-5/50 border-b border-gray-5 text-gray-2 text-xs font-bold uppercase tracking-wider">
                <th className="py-s2 px-s3">Versión</th>
                <th className="py-s2 px-s3">Etapa</th>
                <th className="py-s2 px-s3">Modelo Neuronal</th>
                <th className="py-s2 px-s3">Precisión Registrada</th>
                <th className="py-s2 px-s3">Pérdida (Loss)</th>
                <th className="py-s2 px-s3">Fecha Registro</th>
                <th className="py-s2 px-s3">Estado</th>
                <th className="py-s2 px-s3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-5 text-black-2">
              {MODEL_HISTORY.map((m) => (
                <tr key={m.version} className="hover:bg-gray-5/30 transition-colors">
                  <td className="py-s2 px-s3 font-bold">{m.version}</td>
                  <td className="py-s2 px-s3 font-medium">{m.stage}</td>
                  <td className="py-s2 px-s3 text-sm text-gray-1">{m.model}</td>
                  <td className="py-s2 px-s3 text-sm font-bold text-primary">{m.accuracy}</td>
                  <td className="py-s2 px-s3 text-sm text-gray-2 font-mono">{m.loss}</td>
                  <td className="py-s2 px-s3 text-sm text-gray-3">{m.date}</td>
                  <td className="py-s2 px-s3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                      m.status === "PRODUCTION" ? "bg-success/10 text-success border-success/20"
                        : m.status === "ROLLBACKED" ? "bg-error/10 text-error border-error/20"
                        : "bg-gray-5 text-gray-3 border-gray-4/30"
                    }`}>
                      {m.status === "PRODUCTION" ? "PRODUCCIÓN" : m.status === "ROLLBACKED" ? "REVERTIDO" : "ARCHIVADO"}
                    </span>
                  </td>
                  <td className="py-s2 px-s3 text-right">
                    {m.status === "PRODUCTION" && !m.version.includes("v1.4") ? (
                      <button type="button" disabled title="Reversión de versiones: próximamente"
                        className="h-8 px-3 rounded-full border border-gray-5 text-gray-3 text-xs font-bold flex items-center gap-1.5 ml-auto opacity-60 cursor-not-allowed">
                        <RotateCcw size={12} />
                        Revertir
                      </button>
                    ) : (
                      <span className="text-xs text-gray-3 font-semibold">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DiagramStep({ icon, title, desc, tone }: { icon: React.ReactNode; title: string; desc: string; tone: "plain" | "primary" | "solid" }) {
  const cls = tone === "solid" ? "bg-primary text-white"
    : tone === "primary" ? "bg-secondary text-primary border border-primary/20"
    : "bg-white border border-gray-5 text-gray-2";
  return (
    <div className="flex flex-col items-center text-center max-w-[200px] z-10">
      <div className={`h-14 w-14 rounded-full flex items-center justify-center shadow-sm ${cls}`}>{icon}</div>
      <span className={`text-sm font-bold mt-s2 ${tone === "primary" ? "text-primary" : "text-black-2"}`}>{title}</span>
      <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">{desc}</span>
    </div>
  );
}

function ModelCard({ stage }: { stage: PipelineStage }) {
  const isLocalization = stage.stage === "LOCALIZATION";
  const labels = Array.isArray(stage.params.labels) ? (stage.params.labels as string[]) : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
      <div className="flex items-center justify-between border-b border-gray-5 pb-s2">
        <div className="flex items-center gap-s2">
          <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0 border border-primary/10">
            {isLocalization ? <Layers size={22} /> : <Cpu size={22} />}
          </div>
          <div>
            <h6 className="text-base font-bold text-black-2">{stage.name}</h6>
            <p className="text-xs text-gray-3 font-semibold mt-s1 font-mono">{stage.file}</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded text-xs font-bold border flex items-center gap-s1 ${
          stage.loaded ? "bg-success/10 text-success border-success/20" : "bg-error/10 text-error border-error/20"
        }`}>
          {stage.loaded ? "Cargado" : "No cargado"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-s2">
        <Metric label="Framework" value={stage.framework} />
        <Metric label="Tamaño del modelo" value={formatBytes(stage.sizeBytes)} />
        {isLocalization ? (
          <>
            <Metric label="Umbral de confianza" value={num(stage.params, "confThreshold")} />
            <Metric label="Umbral IoU" value={num(stage.params, "iouThreshold")} />
            <Metric label="Máx. detecciones" value={num(stage.params, "maxDetections")} />
          </>
        ) : (
          <>
            <Metric label="Tamaño de entrada" value={`${num(stage.params, "inputSize")} px`} />
            <Metric label="Clases" value={num(stage.params, "classes")} />
          </>
        )}
      </div>

      {!isLocalization && labels.length > 0 && (
        <div className="flex flex-col gap-s1 pt-s1">
          <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">Etiquetas del clasificador</span>
          <div className="flex flex-wrap gap-s1">
            {labels.map((l) => (
              <span key={l} className="px-2 py-0.5 rounded bg-gray-5 text-gray-1 text-[11px] font-bold border border-gray-4/30">{l}</span>
            ))}
          </div>
        </div>
      )}

      <div className="p-s2 rounded-xl bg-gray-5/30 border border-gray-5 flex gap-s2 text-xs text-gray-2 leading-relaxed font-normal">
        <Info size={16} className="shrink-0 text-primary mt-0.5" />
        <span>
          {isLocalization
            ? "Primera etapa: aísla la hoja de café eliminando el ruido visual (suelo, ramas, otras plantas)."
            : "Segunda etapa: clasifica el tipo de plaga y su severidad a partir del segmento de hoja recortado."}
        </span>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
      <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">{label}</span>
      <span className="text-base font-bold text-black-2 break-words">{value}</span>
    </div>
  );
}
