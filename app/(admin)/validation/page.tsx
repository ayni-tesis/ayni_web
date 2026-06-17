"use client";

import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronRight,
  ImageOff,
  MapPin,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { useDiagnosisDetail } from "@/lib/hooks/use-diagnosis-detail";
import { useReject, useValidate, useValidationQueue } from "@/lib/hooks/use-validation";
import { t } from "@/lib/i18n/es";

// Etiquetas reales del modelo (ml-model-service/labels.json): Rust/Miner/Phoma/Redspider/Healthy.
const PEST_LABELS: { value: string; label: string }[] = [
  { value: "RUST", label: "Roya del cafeto (Hemileia vastatrix)" },
  { value: "MINER", label: "Minador de la hoja (Leucoptera coffeella)" },
  { value: "PHOMA", label: "Phoma del cafeto (Phyllasticta coffeicola)" },
  { value: "REDSPIDER", label: "Araña roja (Oligonychus yothersi)" },
  { value: "HEALTHY", label: "Hoja sana (Coffea arabica)" },
];

export default function ValidationPage() {
  const { data, isLoading, isError } = useValidationQueue();
  const validate = useValidate();
  const reject = useReject();

  const [skipped, setSkipped] = useState<Set<string>>(new Set());
  const [selectedLabel, setSelectedLabel] = useState("");
  const [actionDone, setActionDone] = useState<"confirmed" | "rejected" | null>(null);

  const queue = data?.content ?? [];
  const total = data?.totalElements ?? 0;
  const visible = queue.filter((d) => !skipped.has(d.id));
  const current = visible[0];

  const detailQuery = useDiagnosisDetail(actionDone ? undefined : current?.id);
  const detail = detailQuery.data;
  const busy = validate.isPending || reject.isPending;

  function handleConfirm() {
    if (!current) return;
    validate.mutate(
      { id: current.id, label: selectedLabel || undefined, confirmed: true },
      { onSuccess: () => setActionDone("confirmed") },
    );
  }
  function handleReject() {
    if (!current) return;
    reject.mutate(current.id, { onSuccess: () => setActionDone("rejected") });
  }
  function handleNext() {
    setActionDone(null);
    setSelectedLabel("");
  }
  function handleSkip() {
    if (!current) return;
    setSkipped((prev) => new Set(prev).add(current.id));
    setSelectedLabel("");
  }

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader title={t.validationPage.title} description={t.validationPage.description} />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-3">
          Cargando cola de validación…
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-error">
          No se pudo cargar la cola de validación.
        </div>
      ) : actionDone ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 flex flex-col items-center justify-center text-center gap-s2 max-w-2xl mx-auto w-full">
          <div
            className={`h-16 w-16 rounded-full flex items-center justify-center border ${
              actionDone === "confirmed"
                ? "bg-success/10 text-success border-success/20"
                : "bg-error/10 text-error border-error/20"
            }`}
          >
            {actionDone === "confirmed" ? <Check size={32} /> : <X size={32} />}
          </div>
          <h5 className="text-h5 font-bold text-black-2">
            {actionDone === "confirmed" ? "Diagnóstico validado" : "Imagen rechazada"}
          </h5>
          <p className="text-base text-gray-2 max-w-md">
            {actionDone === "confirmed"
              ? "La etiqueta fue confirmada y se usará para retroalimentar el dataset del modelo ML."
              : "El diagnóstico se descartó de la cola y no se usará para entrenamiento."}
          </p>
          <div className="flex gap-s2 mt-s2">
            {visible.length > 0 ? (
              <button
                type="button"
                onClick={handleNext}
                className="press focus-ring h-11 px-s2 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-s1 hover:opacity-85 transition-opacity"
              >
                Siguiente imagen
                <ChevronRight size={16} />
              </button>
            ) : (
              <span className="text-sm text-gray-3 font-semibold">
                ¡Has completado la cola de validación! ✅
              </span>
            )}
          </div>
        </div>
      ) : !current ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-2">
          No hay diagnósticos pendientes de validación. ✅
        </div>
      ) : (
        <div className="grid gap-s3 grid-cols-1 lg:grid-cols-12">
          {/* Panel izquierdo: imagen + contexto */}
          <div className="lg:col-span-7 flex flex-col gap-s2">
            <div className="bg-white rounded-2xl border border-gray-5 overflow-hidden flex flex-col">
              <div className="h-[400px] w-full relative bg-black-3 flex items-center justify-center">
                {detailQuery.isLoading ? (
                  <div className="text-white/60 text-sm">Cargando imagen…</div>
                ) : detail?.imageUrl ? (
                  // biome-ignore lint/performance/noImgElement: imagen servida con SAS desde Azure Blob, fuera del dominio de Next/Image
                  <img
                    src={detail.imageUrl}
                    alt="Hoja de café para analizar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-s1 text-white/50">
                    <ImageOff size={40} />
                    <span className="text-sm">Imagen no disponible</span>
                    <span className="text-xs text-white/35">
                      (diagnóstico sin imagen almacenada)
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-s1">
                  <span className="px-3 py-1 rounded bg-black-2/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                    ID: {current.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contexto de captura */}
            <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
              <h6 className="text-base font-bold text-black-2">Origen y contexto de captura</h6>
              <div className="grid grid-cols-2 gap-s2">
                <Meta label="Caficultor" value={current.farmerLabel} icon={null} />
                <Meta
                  label="Origen"
                  value={current.source === "OFFLINE_SYNCED" ? "Sincronizado (offline)" : "En vivo"}
                  icon={null}
                />
                <Meta
                  label="Ubicación"
                  value={
                    current.latitude && current.longitude
                      ? `${current.latitude}, ${current.longitude}`
                      : "—"
                  }
                  icon={<MapPin size={14} className="text-gray-3" />}
                />
                <Meta
                  label="Fecha de captura"
                  value={current.capturedAt ? new Date(current.capturedAt).toLocaleString("es-PE") : "—"}
                  icon={<Calendar size={14} className="text-gray-3" />}
                />
              </div>
              <p className="text-xs text-gray-3 mt-s1">
                El read-model no almacena nombre de finca ni Grad-CAM; la validación corrige la
                etiqueta para retroalimentar el dataset.
              </p>
            </div>
          </div>

          {/* Panel derecho: decisión */}
          <div className="lg:col-span-5 flex flex-col gap-s2">
            <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
              {/* Alerta: por qué está aquí */}
              <div className="flex gap-s2 p-s2 rounded-xl bg-warning/10 border border-warning/20 text-gray-1">
                <AlertTriangle size={20} className="shrink-0 mt-0.5 text-warning" />
                <div className="flex flex-col gap-s1 text-xs">
                  <span className="font-bold">Baja confianza de inferencia</span>
                  <span className="leading-relaxed">
                    El modelo reporta un nivel de certeza de{" "}
                    <strong>
                      {current.confidence != null ? `${(current.confidence * 100).toFixed(0)}%` : "—"}
                    </strong>
                    . Requiere confirmación de un experto agrónomo.
                  </span>
                </div>
              </div>

              {/* Diagnóstico automático + barra de confianza */}
              <div className="flex flex-col gap-s1 mt-s1">
                <span className="text-xs font-bold text-gray-3 uppercase tracking-wider">
                  DIAGNÓSTICO AUTOMÁTICO
                </span>
                <div className="flex flex-col gap-s1 mt-s1">
                  <div className="text-lg font-bold text-black-2">{current.pestName}</div>
                  <span className="text-xs text-gray-3 italic">{current.scientificName}</span>
                  {current.confidence != null && (
                    <div className="flex items-center gap-s2 mt-s1">
                      <div className="flex-1 bg-gray-5 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-warning h-full rounded-full"
                          style={{ width: `${current.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-warning">
                        {(current.confidence * 100).toFixed(0)}% certeza
                      </span>
                    </div>
                  )}
                  {current.severity != null && (
                    <span className="text-xs text-gray-3 mt-s1">
                      Severidad estimada: <strong>{(current.severity * 100).toFixed(0)}%</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Confirmación / corrección */}
              <div className="flex flex-col gap-s2 border-t border-gray-5 pt-s2 mt-s1">
                <span className="text-xs font-bold text-gray-3 uppercase tracking-wider flex items-center gap-s1">
                  <Tag size={14} /> CONFIRMACIÓN DE DIAGNÓSTICO
                </span>
                <label htmlFor="pest-correction" className="text-sm font-bold text-gray-2">
                  ¿Cuál es el diagnóstico correcto?
                </label>
                <select
                  id="pest-correction"
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                  className="press h-12 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Confirmar detección del modelo ({current.pestName})</option>
                  {PEST_LABELS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-3 leading-relaxed">
                  Deja el selector vacío para confirmar la detección del modelo, o elige la plaga
                  real observada para corregir la etiqueta.
                </p>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-s2 border-t border-gray-5 pt-s2 mt-s1">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={busy}
                  className="press focus-ring h-12 flex-1 rounded-full border border-gray-5 text-error hover:bg-error/5 disabled:opacity-50 font-bold text-base flex items-center justify-center gap-s1 transition-colors"
                >
                  <X size={18} /> Descartar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={busy}
                  className="press focus-ring h-12 flex-1 rounded-full bg-primary text-white hover:opacity-85 disabled:opacity-50 font-bold text-base flex items-center justify-center gap-s1 transition-opacity shadow-sm"
                >
                  <Check size={18} /> Confirmar
                </button>
              </div>
            </div>

            {/* Navegación de la cola */}
            <div className="flex items-center justify-between px-3 text-sm text-gray-3 font-semibold">
              <span>
                {visible.length} en cola{total > queue.length ? ` (de ${total})` : ""}
              </span>
              {visible.length > 1 && (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="press text-primary hover:underline flex items-center gap-s1"
                >
                  Omitir imagen
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-s1">
      <span className="text-xs text-gray-3 font-normal">{label}</span>
      <span className="text-sm font-bold text-black-2 flex items-center gap-s1">
        {icon}
        {value}
      </span>
    </div>
  );
}
