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
  Server,
  Smartphone,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { t } from "@/lib/i18n/es";

const INITIAL_MODEL_HISTORY = [
  {
    version: "v2.1 (Activo)",
    stage: "Clasificación",
    model: "SmallPavicNet-MC",
    accuracy: "94.2% F1",
    loss: "0.08",
    date: "10 Jun 2026",
    status: "PRODUCTION",
  },
  {
    version: "v2.0",
    stage: "Clasificación",
    model: "EfficientNet-B0",
    accuracy: "91.8% F1",
    loss: "0.12",
    date: "28 May 2026",
    status: "ROLLBACKED",
  },
  {
    version: "v1.4 (Activo)",
    stage: "Localización",
    model: "YOLOv8-Leaf",
    accuracy: "92.4% mAP",
    loss: "0.15",
    date: "15 May 2026",
    status: "PRODUCTION",
  },
  {
    version: "v1.3",
    stage: "Localización",
    model: "YOLOv8-Leaf",
    accuracy: "89.1% mAP",
    loss: "0.21",
    date: "02 May 2026",
    status: "ARCHIVED",
  },
];

export default function PipelinePage() {
  const modelHistory = INITIAL_MODEL_HISTORY;

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.pipelinePage.title}
        description={t.pipelinePage.description}
      />

      <div className="bg-secondary/40 border border-primary/20 text-gray-1 p-s2 rounded-xl flex items-start gap-s2">
        <Info size={18} className="shrink-0 mt-0.5 text-primary" />
        <div className="flex flex-col gap-s1 text-sm">
          <span className="font-bold text-primary">Próximamente</span>
          <span className="leading-relaxed text-gray-2">
            El versionado de modelos y el control de despliegues aún no están
            conectados al <code>ml-model-service</code>. Las métricas y el
            historial que se muestran son ilustrativos; la reversión de versiones
            está deshabilitada hasta integrar el registro de modelos.
          </span>
        </div>
      </div>

      {/* Visual Pipeline Stage Connection Flow */}
      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <h6 className="text-h6 font-bold text-black-2">
          Diagrama Fitosanitario de Dos Etapas
        </h6>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-s3 bg-gray-5/30 border border-gray-5 rounded-2xl p-s3 relative overflow-hidden">
          {/* Step 1: Image Input */}
          <div className="flex flex-col items-center text-center max-w-[180px] z-10">
            <div className="h-14 w-14 rounded-full bg-white border border-gray-5 flex items-center justify-center text-gray-2 shadow-sm">
              <Database size={24} />
            </div>
            <span className="text-sm font-bold text-black-2 mt-s2">
              Imagen de Campo
            </span>
            <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">
              Foto tomada en la app móvil por el caficultor.
            </span>
          </div>

          <ArrowRight className="hidden lg:block text-gray-4" size={20} />

          {/* Step 2: YOLO Stage */}
          <div className="flex flex-col items-center text-center max-w-[200px] z-10">
            <div className="h-14 w-14 rounded-full bg-secondary text-primary border border-primary/20 flex items-center justify-center shadow-sm">
              <Layers size={24} />
            </div>
            <span className="text-sm font-bold text-primary mt-s2">
              1. YOLOv8 (Localización)
            </span>
            <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">
              Detecta el contorno de la hoja y extrae el Bounding Box omitiendo
              el fondo.
            </span>
          </div>

          <ArrowRight className="hidden lg:block text-gray-4" size={20} />

          {/* Step 3: Cropped Leaf Image */}
          <div className="flex flex-col items-center text-center max-w-[180px] z-10">
            <div className="h-14 w-14 rounded-xl bg-white border border-dashed border-gray-4 flex items-center justify-center text-gray-3 text-[10px] font-bold">
              RECORTADA
            </div>
            <span className="text-sm font-bold text-black-2 mt-s2">
              Segmento de Hoja
            </span>
            <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">
              Imagen normalizada aislada de hojas circundantes.
            </span>
          </div>

          <ArrowRight className="hidden lg:block text-gray-4" size={20} />

          {/* Step 4: SmallPavicNet Stage */}
          <div className="flex flex-col items-center text-center max-w-[220px] z-10">
            <div className="h-14 w-14 rounded-full bg-secondary text-primary border border-primary/20 flex items-center justify-center shadow-sm">
              <Cpu size={24} />
            </div>
            <span className="text-sm font-bold text-primary mt-s2">
              2. SmallPavicNet / EfficientNet
            </span>
            <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">
              Clasifica la severidad y tipo de plaga (Roya, Minador, Phoma,
              Cercospora).
            </span>
          </div>

          <ArrowRight className="hidden lg:block text-gray-4" size={20} />

          {/* Step 5: Final Result */}
          <div className="flex flex-col items-center text-center max-w-[180px] z-10">
            <div className="h-14 w-14 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <span className="text-sm font-bold text-black-2 mt-s2">
              Diagnóstico Fitosanitario
            </span>
            <span className="text-xs text-gray-3 font-normal mt-s1 leading-normal">
              Diagnóstico con certeza y recomendación de control.
            </span>
          </div>
        </div>
      </div>

      {/* Two Active Models Side-by-Side detail */}
      <div className="grid gap-s3 grid-cols-1 md:grid-cols-2">
        {/* Model 1: Localization */}
        <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div className="flex items-center justify-between border-b border-gray-5 pb-s2">
            <div className="flex items-center gap-s2">
              <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0 border border-primary/10">
                <Layers size={22} />
              </div>
              <div>
                <h6 className="text-base font-bold text-black-2">
                  Detector de Hojas (YOLOv8)
                </h6>
                <p className="text-xs text-gray-3 font-semibold mt-s1">
                  yolov8n-leaf-v1.4.pt
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-secondary text-primary text-xs font-bold border border-primary/20 flex items-center gap-s1">
              <Server size={14} />
              FastAPI Cloud
            </span>
          </div>

          <div className="grid grid-cols-2 gap-s2">
            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                {t.pipelinePage.metrics.map}
              </span>
              <span className="text-2xl font-bold text-black-2">92.4%</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Para detección de hoja de café
              </span>
            </div>

            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                {t.pipelinePage.metrics.latency}
              </span>
              <span className="text-2xl font-bold text-black-2">45 ms</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Inferencia backend promedio
              </span>
            </div>

            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                {t.pipelinePage.metrics.dataset}
              </span>
              <span className="text-2xl font-bold text-black-2">4,200</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Imágenes anotadas
              </span>
            </div>

            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                Parámetros
              </span>
              <span className="text-2xl font-bold text-black-2">3.2 M</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Red neuronal YOLOv8 Nano
              </span>
            </div>
          </div>

          <div className="p-s2 rounded-xl bg-gray-5/30 border border-gray-5 flex gap-s2 text-xs text-gray-2 leading-relaxed font-normal">
            <Info size={16} className="shrink-0 text-primary mt-0.5" />
            <span>
              Este modelo ejecuta la primera etapa y se encarga de aislar la
              hoja de café eliminando el ruido visual (suelo, ramas, otras
              plantas). Corre en la nube por su demanda de GPU.
            </span>
          </div>
        </div>

        {/* Model 2: Classification */}
        <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div className="flex items-center justify-between border-b border-gray-5 pb-s2">
            <div className="flex items-center gap-s2">
              <div className="h-12 w-12 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0 border border-primary/10">
                <Cpu size={22} />
              </div>
              <div>
                <h6 className="text-base font-bold text-black-2">
                  Clasificador de Plagas
                </h6>
                <p className="text-xs text-gray-3 font-semibold mt-s1">
                  smallpavicnet-pest-v2.1.tflite
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-warning/10 text-warning text-xs font-bold border border-warning/20 flex items-center gap-s1">
              <Smartphone size={14} />
              Edge (App Móvil)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-s2">
            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                {t.pipelinePage.metrics.f1}
              </span>
              <span className="text-2xl font-bold text-black-2">94.2%</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Clasificación multilabel
              </span>
            </div>

            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                {t.pipelinePage.metrics.latency}
              </span>
              <span className="text-2xl font-bold text-black-2">65 ms</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Inferencia local (CPU móvil)
              </span>
            </div>

            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                {t.pipelinePage.metrics.dataset}
              </span>
              <span className="text-2xl font-bold text-black-2">6,800</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Muestras de hojas enfermas
              </span>
            </div>

            <div className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1">
              <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
                Tamaño de Archivo
              </span>
              <span className="text-2xl font-bold text-black-2">8.4 MB</span>
              <span className="text-[10px] text-gray-3 font-normal mt-s1">
                Optimizado con cuantización INT8
              </span>
            </div>
          </div>

          <div className="p-s2 rounded-xl bg-gray-5/30 border border-gray-5 flex gap-s2 text-xs text-gray-2 leading-relaxed font-normal">
            <Info size={16} className="shrink-0 text-warning mt-0.5" />
            <span>
              <strong>SmallPavicNet-MC</strong> está optimizado y cuantizado a
              formato TensorFlow Lite. Se empaqueta en la app móvil para
              permitir el diagnóstico inmediato en campo sin internet.
            </span>
          </div>
        </div>
      </div>

      {/* History and Rollback Table */}
      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <div className="flex items-center justify-between">
          <div>
            <h6 className="text-base font-bold text-black-2">
              Historial de Despliegues y Control de Versiones
            </h6>
            <p className="text-sm text-gray-3 font-normal mt-s1">
              Auditoría y reversión de modelos para garantizar la consistencia
              fitosanitaria.
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
              {modelHistory.map((m) => (
                <tr
                  key={m.version}
                  className="hover:bg-gray-5/30 transition-colors"
                >
                  <td className="py-s2 px-s3 font-bold">{m.version}</td>
                  <td className="py-s2 px-s3 font-medium">{m.stage}</td>
                  <td className="py-s2 px-s3 text-sm text-gray-1">{m.model}</td>
                  <td className="py-s2 px-s3 text-sm font-bold text-primary">
                    {m.accuracy}
                  </td>
                  <td className="py-s2 px-s3 text-sm text-gray-2 font-mono">
                    {m.loss}
                  </td>
                  <td className="py-s2 px-s3 text-sm text-gray-3">{m.date}</td>
                  <td className="py-s2 px-s3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                        m.status === "PRODUCTION"
                          ? "bg-success/10 text-success border-success/20"
                          : m.status === "ROLLBACKED"
                            ? "bg-error/10 text-error border-error/20"
                            : "bg-gray-5 text-gray-3 border-gray-4/30"
                      }`}
                    >
                      {m.status === "PRODUCTION"
                        ? "PRODUCCIÓN"
                        : m.status === "ROLLBACKED"
                          ? "REVERTIDO"
                          : "ARCHIVADO"}
                    </span>
                  </td>
                  <td className="py-s2 px-s3 text-right">
                    {m.status === "PRODUCTION" &&
                    !m.version.includes("v1.4") ? (
                      <button
                        type="button"
                        disabled
                        title="Reversión de versiones: próximamente"
                        className="h-8 px-3 rounded-full border border-gray-5 text-gray-3 text-xs font-bold flex items-center gap-1.5 ml-auto opacity-60 cursor-not-allowed"
                      >
                        <RotateCcw size={12} />
                        Revertir
                      </button>
                    ) : (
                      <span className="text-xs text-gray-3 font-semibold">
                        -
                      </span>
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
