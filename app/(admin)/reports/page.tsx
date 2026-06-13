"use client";

import {
  ArrowRight,
  Download,
  FileText,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";

const MOCK_REPORTS = [
  {
    id: "rep-001",
    name: "Reporte de Incidencia Fitosanitaria - Junio 2026",
    type: "SENASA Oficial",
    date: "12 Jun 2026, 21:00",
    size: "1.2 MB",
    status: "GENERATED",
  },
  {
    id: "rep-002",
    name: "Auditoría de Incidencia de Roya en Villa Rica (Histórico)",
    type: "Interno Cooperativa",
    date: "05 Jun 2026, 14:32",
    size: "4.8 MB",
    status: "GENERATED",
  },
  {
    id: "rep-003",
    name: "Reporte Consolidado de Calidad de Dataset v2.1",
    type: "Calidad ML",
    date: "01 Jun 2026, 10:15",
    size: "820 KB",
    status: "GENERATED",
  },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("SENASA_INCIDENCE");
  const [anonymizeData, setAnonymizeData] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportsList, setReportsList] = useState(MOCK_REPORTS);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const newReport = {
        id: `rep-00${reportsList.length + 1}`,
        name: `Reporte de Incidencia Fitosanitaria - ${new Date().toLocaleDateString(
          "es-PE",
          {
            month: "long",
            year: "numeric",
          },
        )}`,
        type: "SENASA Oficial",
        date: new Date().toLocaleString("es-PE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        size: "1.4 MB",
        status: "GENERATED",
      };
      setReportsList([newReport, ...reportsList]);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title="Reportes Fitosanitarios"
        description="Genera documentos oficiales consolidados para SENASA y exportaciones de incidentes."
      />

      <div className="grid gap-s3 grid-cols-1 lg:grid-cols-12">
        {/* Left column: Generator Panel (Col-span 5) */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-5 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2"
        >
          <div className="flex items-center gap-s2 text-primary font-bold">
            <FileText size={20} />
            <span>Configurar Reporte</span>
          </div>

          {/* Report Type */}
          <div className="flex flex-col gap-s1">
            <label
              htmlFor="report-type-select"
              className="text-sm font-bold text-gray-2"
            >
              Tipo de Reporte
            </label>
            <select
              id="report-type-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="press h-12 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="SENASA_INCIDENCE">
                SENASA Oficial: Reporte de Inidencia
              </option>
              <option value="FARMER_ACTIVITY">
                Resumen de Actividad de Caficultores
              </option>
              <option value="PLAGUE_INCIDENCE">
                Taxonomía y Propagación de Plagas
              </option>
              <option value="ML_DATASET">
                Calidad del Dataset de Entrenamiento
              </option>
            </select>
          </div>

          {/* Date range inputs */}
          <div className="grid grid-cols-2 gap-s2">
            <div className="flex flex-col gap-s1">
              <label
                htmlFor="date-start-input"
                className="text-sm font-bold text-gray-2"
              >
                Fecha Inicio
              </label>
              <input
                id="date-start-input"
                type="date"
                defaultValue="2026-06-01"
                className="h-11 px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-s1">
              <label
                htmlFor="date-end-input"
                className="text-sm font-bold text-gray-2"
              >
                Fecha Fin
              </label>
              <input
                id="date-end-input"
                type="date"
                defaultValue="2026-06-13"
                className="h-11 px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Sector selection */}
          <div className="flex flex-col gap-s1">
            <label
              htmlFor="sector-select-input"
              className="text-sm font-bold text-gray-2"
            >
              Zona / Sector
            </label>
            <select
              id="sector-select-input"
              className="press h-12 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
            >
              <option>Todos los sectores</option>
              <option>Sector San Miguel</option>
              <option>Sector Cedropampa</option>
              <option>Sector Prado</option>
              <option>Sector Canal</option>
            </select>
          </div>

          {/* Legal Compliance Check (Ley 29733) */}
          <div className="p-s2 rounded-xl bg-secondary/40 border border-primary/10 flex flex-col gap-s2">
            <div className="flex items-start gap-s1 text-primary">
              <ShieldAlert size={18} className="shrink-0 mt-s1" />
              <div className="flex flex-col gap-s1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Cumplimiento de Privacidad
                </span>
                <span className="text-xs text-primary font-semibold leading-relaxed">
                  Ley de Protección de Datos Personales (Ley N.º 29733)
                </span>
              </div>
            </div>

            <label className="flex items-center gap-s2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={anonymizeData}
                onChange={(e) => setAnonymizeData(e.target.checked)}
                className="h-5 w-5 rounded border-gray-4 text-primary focus:ring-primary outline-none"
              />
              <span className="text-xs font-bold text-gray-1">
                Anonimizar nombres y coordenadas exactas de caficultores
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="press focus-ring h-12 w-full bg-primary text-white hover:opacity-85 disabled:opacity-50 font-bold text-base flex items-center justify-center gap-s1 transition-all shadow-sm rounded-full"
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Generando documento…
              </>
            ) : (
              <>
                Generar Reporte
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Right column: Generated Files List (Col-span 7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div>
            <h6 className="text-base font-bold text-black-2">
              Documentos Recientes
            </h6>
            <p className="text-sm text-gray-3 font-normal mt-s1">
              Historial de reportes generados. Listos para descarga en formato
              PDF / CSV.
            </p>
          </div>

          <ul className="flex flex-col divide-y divide-gray-5 border-t border-gray-5">
            {reportsList.map((rep) => (
              <li
                key={rep.id}
                className="py-s2 flex flex-col sm:flex-row sm:items-center justify-between gap-s1"
              >
                <div className="flex items-start gap-s1">
                  <div className="h-10 w-10 rounded-lg bg-gray-5 text-gray-2 flex items-center justify-center shrink-0 border border-gray-4/20">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-black-2 block leading-snug">
                      {rep.name}
                    </span>
                    <div className="flex items-center gap-s2 text-xs text-gray-3 font-semibold mt-s1">
                      <span className="px-1.5 py-0.5 rounded bg-gray-5 text-gray-1 border border-gray-4/20 uppercase tracking-wider text-[9px]">
                        {rep.type}
                      </span>
                      <span>{rep.date}</span>
                      <span>•</span>
                      <span>{rep.size}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-s1 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    title="Descargar PDF"
                    className="press focus-ring h-10 px-s2 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 font-bold text-xs flex items-center gap-s1 transition-colors"
                  >
                    <Download size={14} />
                    PDF
                  </button>
                  <button
                    type="button"
                    title="Exportar CSV"
                    className="press focus-ring h-10 px-s2 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 font-bold text-xs flex items-center gap-s1 transition-colors"
                  >
                    <Download size={14} />
                    CSV
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="p-s2 rounded-xl bg-gray-5/50 border border-gray-5 flex gap-s1 items-start text-xs text-gray-2 leading-relaxed">
            <Info size={16} className="shrink-0 text-gray-3 mt-s1" />
            <span>
              Los reportes generados con la opción de{" "}
              <strong>Anonimización</strong> cumplen con las directrices de
              SENASA respecto al levantamiento de alertas colectivas sin
              vulnerar datos privados de parcelas individuales.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
