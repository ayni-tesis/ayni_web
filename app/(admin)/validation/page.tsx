"use client";

import {
  AlertTriangle,
  Calendar,
  Check,
  ChevronRight,
  Layers,
  MapPin,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { t } from "@/lib/i18n/es";

const MOCK_QUEUE = [
  {
    id: "q1",
    imageUrl:
      "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600&auto=format&fit=crop", // Coffee leaves with disease
    pestDetected: "RUST",
    pestName: "Roya del cafeto (Hemileia vastatrix)",
    confidence: 0.58, // Low confidence trigger
    severity: 0.75,
    farmer: "Gualberto Huamán",
    farm: "Finca Monteverde",
    location: "Villa Rica - Sector San Miguel",
    date: "12 Jun 2026, 17:45",
  },
  {
    id: "q2",
    imageUrl:
      "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?q=80&w=600&auto=format&fit=crop",
    pestDetected: "MINER",
    pestName: "Minador de la hoja (Leucoptera coffeella)",
    confidence: 0.52,
    severity: 0.35,
    farmer: "Silvia Condori",
    farm: "Finca El Cafetal",
    location: "Villa Rica - Sector Prado",
    date: "12 Jun 2026, 16:30",
  },
];

export default function ValidationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGradcam, setShowGradcam] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [actionDone, setActionDone] = useState<"confirmed" | "rejected" | null>(
    null,
  );

  const currentItem = MOCK_QUEUE[currentIndex];
  const hasItems = currentItem && !actionDone;

  const handleConfirm = () => {
    setActionDone("confirmed");
  };

  const handleReject = () => {
    setActionDone("rejected");
  };

  const handleNext = () => {
    if (currentIndex < MOCK_QUEUE.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setActionDone(null);
      setSelectedLabel("");
      setShowGradcam(false);
    }
  };

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.validationPage.title}
        description={t.validationPage.description}
      />

      {actionDone ? (
        /* Action feedback overlay */
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
            {actionDone === "confirmed"
              ? "Diagnóstico Validado"
              : "Imagen Rechazada"}
          </h5>
          <p className="text-base text-gray-2 max-w-md">
            {actionDone === "confirmed"
              ? "La etiqueta fue confirmada y se ha programado para retroalimentar el dataset del modelo ML."
              : "La imagen ha sido descartada de la cola y no se usará para entrenamiento."}
          </p>
          <div className="flex gap-s2 mt-s2">
            {currentIndex < MOCK_QUEUE.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="press focus-ring h-11 px-s2 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-s1 hover:opacity-85 transition-opacity"
              >
                Siguiente imagen
                <ChevronRight size={16} />
              </button>
            ) : (
              <div className="flex flex-col gap-s1">
                <span className="text-sm text-gray-3 font-semibold">
                  ¡Has completado toda la cola de hoy!
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex(0);
                    setActionDone(null);
                  }}
                  className="press focus-ring h-10 px-5 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 font-bold text-xs"
                >
                  Volver a empezar (demo)
                </button>
              </div>
            )}
          </div>
        </div>
      ) : hasItems ? (
        <div className="grid gap-s3 grid-cols-1 lg:grid-cols-12">
          {/* Left Panel: Image and Visuals (Col-span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-s2">
            <div className="bg-white rounded-2xl border border-gray-5 overflow-hidden flex flex-col relative">
              {/* Image Container */}
              <div className="h-[400px] w-full relative bg-black-3 flex items-center justify-center">
                {/* Simulated Image */}
                <img
                  src={currentItem.imageUrl}
                  alt="Hoja de café para analizar"
                  className="h-full w-full object-cover"
                />

                {/* Simulated Gradcam Heatmap Overlay */}
                {showGradcam && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-error/30 via-warning/20 to-transparent mix-blend-color-burn pointer-events-none">
                    <div className="absolute top-[40%] left-[30%] h-36 w-36 rounded-full bg-error/30 blur-2xl animate-pulse" />
                    <div className="absolute top-[35%] left-[45%] h-24 w-24 rounded-full bg-warning/30 blur-xl" />
                  </div>
                )}

                {/* Image Overlay Header tags */}
                <div className="absolute top-4 left-4 flex gap-s1">
                  <span className="px-3 py-1 rounded bg-black-2/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                    ID: {currentItem.id}
                  </span>
                  {showGradcam && (
                    <span className="px-3 py-1 rounded bg-warning/80 backdrop-blur-md text-white text-xs font-bold border border-warning/10 flex items-center gap-s1">
                      <Layers size={12} />
                      Grad-CAM Activo
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle Visual Mode */}
              <div className="p-s2 border-t border-gray-5 bg-gray-5/20 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-3 uppercase tracking-wider">
                  MODO DE VISUALIZACIÓN
                </span>
                <button
                  type="button"
                  onClick={() => setShowGradcam(!showGradcam)}
                  className={`press h-9 px-s2 rounded-full text-xs font-bold flex items-center gap-s1 transition-colors ${
                    showGradcam
                      ? "bg-primary text-white"
                      : "border border-gray-4 bg-white text-gray-1 hover:bg-gray-5"
                  }`}
                >
                  <Layers size={14} />
                  {showGradcam
                    ? "Ver original"
                    : "Ver mapa de calor (Grad-CAM)"}
                </button>
              </div>
            </div>

            {/* Farm Context Metadata */}
            <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
              <h6 className="text-base font-bold text-black-2">
                Origen y Contexto de Captura
              </h6>
              <div className="grid grid-cols-2 gap-s2">
                <div className="flex flex-col gap-s1">
                  <span className="text-xs text-gray-3 font-normal">
                    Caficultor
                  </span>
                  <span className="text-sm font-bold text-black-2">
                    {currentItem.farmer}
                  </span>
                </div>
                <div className="flex flex-col gap-s1">
                  <span className="text-xs text-gray-3 font-normal">Finca</span>
                  <span className="text-sm font-bold text-black-2">
                    {currentItem.farm}
                  </span>
                </div>
                <div className="flex flex-col gap-s1">
                  <span className="text-xs text-gray-3 font-normal">
                    Ubicación
                  </span>
                  <span className="text-sm font-bold text-black-2 flex items-center gap-s1">
                    <MapPin size={14} className="text-gray-3" />
                    {currentItem.location}
                  </span>
                </div>
                <div className="flex flex-col gap-s1">
                  <span className="text-xs text-gray-3 font-normal">
                    Fecha de sincronización
                  </span>
                  <span className="text-sm font-bold text-black-2 flex items-center gap-s1">
                    <Calendar size={14} className="text-gray-3" />
                    {currentItem.date}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Decision Dashboard (Col-span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-s2">
            <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
              {/* Alert header: why it is here */}
              <div className="flex gap-s2 p-s2 rounded-xl bg-warning/10 border border-warning/20 text-gray-1">
                <AlertTriangle
                  size={20}
                  className="shrink-0 mt-0.5 text-warning"
                />
                <div className="flex flex-col gap-s1 text-xs">
                  <span className="font-bold">
                    Baja Confianza de Inferencia
                  </span>
                  <span className="leading-relaxed">
                    El modelo reporta un nivel de certeza de{" "}
                    <strong>
                      {(currentItem.confidence * 100).toFixed(0)}%
                    </strong>
                    . Requiere confirmación de un experto agrónomo.
                  </span>
                </div>
              </div>

              {/* Model Diagnosis info */}
              <div className="flex flex-col gap-s1 mt-s1">
                <span className="text-xs font-bold text-gray-3 uppercase tracking-wider">
                  DIAGNÓSTICO AUTOMÁTICO
                </span>
                <div className="flex flex-col gap-s1 mt-s1">
                  <div className="text-lg font-bold text-black-2">
                    {currentItem.pestName}
                  </div>
                  <div className="flex items-center gap-s2">
                    <div className="flex-1 bg-gray-5 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-warning h-full rounded-full"
                        style={{ width: `${currentItem.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-warning">
                      {(currentItem.confidence * 100).toFixed(0)}% certeza
                    </span>
                  </div>
                </div>
              </div>

              {/* Decision Forms */}
              <div className="flex flex-col gap-s2 border-t border-gray-5 pt-s2 mt-s1">
                <span className="text-xs font-bold text-gray-3 uppercase tracking-wider flex items-center gap-s1">
                  <Tag size={14} />
                  CONFIRMACIÓN DE DIAGNÓSTICO
                </span>

                <div className="flex flex-col gap-s2">
                  <label
                    htmlFor="pest-correction-select"
                    className="text-sm font-bold text-gray-2"
                  >
                    ¿Cuál es el diagnóstico correcto?
                  </label>
                  <select
                    id="pest-correction-select"
                    value={selectedLabel}
                    onChange={(e) => setSelectedLabel(e.target.value)}
                    className="press h-12 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">
                      Confirmar detección del modelo ({currentItem.pestName})
                    </option>
                    <option value="RUST">
                      Roya del cafeto (Hemileia vastatrix)
                    </option>
                    <option value="MINER">
                      Minador de la hoja (Leucoptera coffeella)
                    </option>
                    <option value="PHOMA">
                      Phoma o quema (Phyllasticta coffeicola)
                    </option>
                    <option value="CERCOSPORA">
                      Cercosporiosis (Cercospora coffeicola)
                    </option>
                    <option value="HEALTHY">Hoja sana (Coffea arabica)</option>
                  </select>
                  <p className="text-xs text-gray-3 leading-relaxed mt-s1">
                    * Si el diagnóstico del modelo es correcto, deja el dropdown
                    vacío y presiona <strong>Confirmar</strong>. De lo
                    contrario, selecciona la plaga real observada en la foto
                    para corregir la etiqueta.
                  </p>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row gap-s2 border-t border-gray-5 pt-s2 mt-s1">
                <button
                  type="button"
                  onClick={handleReject}
                  className="press focus-ring h-12 flex-1 rounded-full border border-gray-5 text-error hover:bg-error/5 font-bold text-base flex items-center justify-center gap-s1 transition-colors"
                >
                  <X size={18} />
                  Descartar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="press focus-ring h-12 flex-1 rounded-full bg-primary text-white hover:opacity-85 font-bold text-base flex items-center justify-center gap-s1 transition-opacity shadow-sm"
                >
                  <Check size={18} />
                  Confirmar
                </button>
              </div>
            </div>

            {/* Pagination/Skip queue info */}
            <div className="flex items-center justify-between px-3 text-sm text-gray-3 font-semibold">
              <span>
                Fila {currentIndex + 1} de {MOCK_QUEUE.length}
              </span>
              {currentIndex < MOCK_QUEUE.length - 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(currentIndex + 1)}
                  className="press text-primary hover:underline flex items-center gap-s1"
                >
                  Omitir imagen
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Fallback if queue has ended or error */
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-2">
          No hay imágenes en la cola de validación.
        </div>
      )}
    </div>
  );
}
