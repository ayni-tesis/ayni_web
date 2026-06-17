"use client";

import {
  ArrowRight,
  Download,
  FileText,
  Info,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import {
  type Report,
  type ReportFormat,
  type ReportType,
  REPORT_TYPE_LABELS,
  reportsService,
} from "@/lib/api/reports";
import { useGenerateReport, useReports } from "@/lib/hooks/use-reports";

const SECTORS = [
  "Todos los sectores",
  "Sector San Miguel",
  "Sector Cedropampa",
  "Sector Prado",
  "Sector Canal",
];

function StatusBadge({ status }: { status: Report["status"] }) {
  const map = {
    GENERATING: { label: "Generando", cls: "bg-warning/15 text-warning" },
    READY: { label: "Listo", cls: "bg-success/15 text-success" },
    FAILED: { label: "Error", cls: "bg-error/15 text-error" },
  } as const;
  const s = map[status];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("SENASA_INCIDENT");
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [sector, setSector] = useState(SECTORS[0]);
  const [anonymizeData, setAnonymizeData] = useState(true);

  const { data, isLoading, isError } = useReports();
  const generate = useGenerateReport();

  const reports = data?.content ?? [];

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    generate.mutate({
      type: reportType,
      format,
      periodStart: periodStart || undefined,
      periodEnd: periodEnd || undefined,
      district: sector === SECTORS[0] ? undefined : sector,
    });
  }

  async function handleDownload(report: Report) {
    try {
      await reportsService.download(report);
    } catch {
      window.alert("No se pudo descargar el reporte.");
    }
  }

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title="Reportes Fitosanitarios"
        description="Genera documentos oficiales consolidados para SENASA y exportaciones de incidentes."
      />

      <div className="grid gap-s3 grid-cols-1 lg:grid-cols-12">
        {/* Panel generador */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-5 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2"
        >
          <div className="flex items-center gap-s2 text-primary font-bold">
            <FileText size={20} />
            <span>Configurar Reporte</span>
          </div>

          <div className="flex flex-col gap-s1">
            <label htmlFor="report-type" className="text-sm font-bold text-gray-2">
              Tipo de Reporte
            </label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              className="press h-12 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-base font-bold focus:ring-2 focus:ring-primary outline-none"
            >
              {(Object.keys(REPORT_TYPE_LABELS) as ReportType[]).map((t) => (
                <option key={t} value={t}>
                  {REPORT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-s2">
            <div className="flex flex-col gap-s1">
              <label htmlFor="fmt" className="text-sm font-bold text-gray-2">
                Formato
              </label>
              <select
                id="fmt"
                value={format}
                onChange={(e) => setFormat(e.target.value as ReportFormat)}
                className="h-11 px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
            <div className="flex flex-col gap-s1">
              <label htmlFor="sector" className="text-sm font-bold text-gray-2">
                Zona / Sector
              </label>
              <select
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="h-11 px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-s2">
            <div className="flex flex-col gap-s1">
              <label htmlFor="d-start" className="text-sm font-bold text-gray-2">
                Fecha Inicio
              </label>
              <input
                id="d-start"
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="h-11 px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex flex-col gap-s1">
              <label htmlFor="d-end" className="text-sm font-bold text-gray-2">
                Fecha Fin
              </label>
              <input
                id="d-end"
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="h-11 px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

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
                Anonimizar nombres y coordenadas (SENASA y zona se anonimizan siempre)
              </span>
            </label>
          </div>

          {generate.isError && (
            <p role="alert" className="rounded-xl bg-error/10 px-4 py-2 text-sm text-error">
              No se pudo generar el reporte. ¿Tienes permisos de administrador/agrónomo?
            </p>
          )}

          <button
            type="submit"
            disabled={generate.isPending}
            className="press focus-ring h-12 w-full bg-primary text-white hover:opacity-85 disabled:opacity-50 font-bold text-base flex items-center justify-center gap-s1 transition-all shadow-sm rounded-full"
          >
            {generate.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Solicitando…
              </>
            ) : (
              <>
                Generar Reporte
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Lista de reportes */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div>
            <h6 className="text-base font-bold text-black-2">Documentos Recientes</h6>
            <p className="text-sm text-gray-3 font-normal mt-s1">
              Historial de reportes generados. La descarga se habilita cuando el estado es “Listo”.
            </p>
          </div>

          {isError ? (
            <p className="py-s2 text-sm text-error">No se pudo cargar el historial de reportes.</p>
          ) : isLoading ? (
            <p className="py-s2 text-sm text-gray-3">Cargando…</p>
          ) : reports.length === 0 ? (
            <p className="py-s2 text-sm text-gray-3">Aún no hay reportes generados.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-5 border-t border-gray-5">
              {reports.map((rep) => (
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
                        {REPORT_TYPE_LABELS[rep.type]}
                      </span>
                      <div className="flex items-center gap-s2 text-xs text-gray-3 font-semibold mt-s1">
                        <StatusBadge status={rep.status} />
                        <span>{rep.format}</span>
                        <span>•</span>
                        <span>{new Date(rep.requestedAt).toLocaleString("es-PE")}</span>
                        {rep.rowCount != null && (
                          <>
                            <span>•</span>
                            <span>{rep.rowCount} filas</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-s1 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      title="Descargar reporte"
                      disabled={!rep.downloadAvailable}
                      onClick={() => handleDownload(rep)}
                      className="press focus-ring h-10 px-s2 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-s1 transition-colors"
                    >
                      <Download size={14} />
                      {rep.format}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="p-s2 rounded-xl bg-gray-5/50 border border-gray-5 flex gap-s1 items-start text-xs text-gray-2 leading-relaxed">
            <Info size={16} className="shrink-0 text-gray-3 mt-s1" />
            <span>
              Los reportes SENASA y por zona anonimizan al agricultor (Ley N.º 29733).
              La generación es asíncrona: el estado pasa de “Generando” a “Listo” automáticamente.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
