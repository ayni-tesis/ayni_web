"use client";

import { AlertTriangle, Calendar, Check, MapPin, Tag, X } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { useReject, useValidate, useValidationQueue } from "@/lib/hooks/use-validation";
import { t } from "@/lib/i18n/es";

const PEST_LABELS: { value: string; label: string }[] = [
  { value: "RUST", label: "Roya del cafeto (Hemileia vastatrix)" },
  { value: "MINER", label: "Minador de la hoja (Leucoptera coffeella)" },
  { value: "PHOMA", label: "Phoma del cafeto (Phyllasticta coffeicola)" },
  { value: "REDSPIDER", label: "Araña roja" },
  { value: "HEALTHY", label: "Hoja sana (Coffea arabica)" },
];

export default function ValidationPage() {
  const { data, isLoading, isError } = useValidationQueue();
  const validate = useValidate();
  const reject = useReject();
  const [selectedLabel, setSelectedLabel] = useState("");

  const items = data?.content ?? [];
  const current = items[0];
  const total = data?.totalElements ?? 0;
  const busy = validate.isPending || reject.isPending;

  function handleConfirm() {
    if (!current) return;
    validate.mutate(
      { id: current.id, label: selectedLabel || undefined, confirmed: true },
      { onSuccess: () => setSelectedLabel("") },
    );
  }
  function handleReject() {
    if (!current) return;
    reject.mutate(current.id, { onSuccess: () => setSelectedLabel("") });
  }

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader title={t.validationPage.title} description={t.validationPage.description} />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-3">Cargando cola…</div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-error">No se pudo cargar la cola de validación.</div>
      ) : !current ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-2">
          No hay diagnósticos pendientes de validación. ✅
        </div>
      ) : (
        <div className="grid gap-s3 grid-cols-1 lg:grid-cols-12">
          {/* Contexto del diagnóstico */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">Contexto del diagnóstico</h6>
            <div className="grid grid-cols-2 gap-s2">
              <Meta label="Caficultor" value={current.farmerLabel} icon={null} />
              <Meta label="Origen" value={current.source === "OFFLINE_SYNCED" ? "Offline" : "En vivo"} icon={null} />
              <Meta label="Ubicación"
                value={current.latitude && current.longitude ? `${current.latitude}, ${current.longitude}` : "—"}
                icon={<MapPin size={14} className="text-gray-3" />} />
              <Meta label="Fecha de captura"
                value={current.capturedAt ? new Date(current.capturedAt).toLocaleString("es-PE") : "—"}
                icon={<Calendar size={14} className="text-gray-3" />} />
              <Meta label="Severidad estimada"
                value={current.severity != null ? `${(current.severity * 100).toFixed(0)}%` : "—"} icon={null} />
            </div>
            <p className="text-xs text-gray-3 mt-s1">
              La imagen y el Grad-CAM no se almacenan en el panel; la validación corrige la etiqueta para
              retroalimentar el dataset.
            </p>
          </div>

          {/* Panel de decisión */}
          <div className="lg:col-span-5 flex flex-col gap-s2">
            <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
              <div className="flex gap-s2 p-s2 rounded-xl bg-warning/10 border border-warning/20 text-gray-1">
                <AlertTriangle size={20} className="shrink-0 mt-0.5 text-warning" />
                <div className="flex flex-col gap-s1 text-xs">
                  <span className="font-bold">Baja confianza de inferencia</span>
                  <span className="leading-relaxed">
                    El modelo reporta <strong>{current.confidence != null ? `${(current.confidence * 100).toFixed(0)}%` : "—"}</strong> de certeza. Requiere confirmación experta.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-s1 mt-s1">
                <span className="text-xs font-bold text-gray-3 uppercase tracking-wider">DIAGNÓSTICO AUTOMÁTICO</span>
                <div className="text-lg font-bold text-black-2 mt-s1">{current.pestName}</div>
                <span className="text-xs text-gray-3 italic">{current.scientificName}</span>
              </div>

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
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-3 leading-relaxed">
                  Deja el selector vacío para confirmar la detección del modelo, o elige la plaga real para corregir.
                </p>
              </div>

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

            <div className="px-3 text-sm text-gray-3 font-semibold">
              Pendientes en la cola: {total}
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
