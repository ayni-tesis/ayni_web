"use client";

import {
  ChevronRight,
  Download,
  Info,
  List,
  Map as MapIcon,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { t } from "@/lib/i18n/es";

const MOCK_DIAGNOSES = [
  {
    id: "d1",
    pestName: "Roya del cafeto",
    scientificName: "Hemileia vastatrix",
    farmer: "Mateo Quispe",
    farm: "Finca La Flor",
    confidence: 0.96,
    severity: 0.85,
    location: "Villa Rica - Sector San Miguel",
    date: "13 Jun 2026, 00:32",
    status: "CONFIRMED", // Validado por agrónomo
  },
  {
    id: "d2",
    pestName: "Minador de la hoja",
    scientificName: "Leucoptera coffeella",
    farmer: "Elena Valdivia",
    farm: "Finca El Pino",
    confidence: 0.89,
    severity: 0.4,
    location: "Villa Rica - Sector Cedropampa",
    date: "12 Jun 2026, 23:55",
    status: "PENDING",
  },
  {
    id: "d3",
    pestName: "Hoja sana",
    scientificName: "Coffea arabica",
    farmer: "Carlos Mendoza",
    farm: "Finca Vista Alegre",
    confidence: 0.98,
    severity: 0.0,
    location: "Villa Rica - Sector Prado",
    date: "12 Jun 2026, 22:15",
    status: "CONFIRMED",
  },
  {
    id: "d4",
    pestName: "Phoma o quema",
    scientificName: "Phyllasticta coffeicola",
    farmer: "Julia Ruiz",
    farm: "Finca Santa Rosa",
    confidence: 0.76,
    severity: 0.65,
    location: "Villa Rica - Sector Canal",
    date: "12 Jun 2026, 20:20",
    status: "REJECTED",
  },
  {
    id: "d5",
    pestName: "Cercosporiosis",
    scientificName: "Cercospora coffeicola",
    farmer: "Andrés Quispe",
    farm: "Finca Las Delicias",
    confidence: 0.91,
    severity: 0.75,
    location: "Villa Rica - Sector San Miguel",
    date: "12 Jun 2026, 18:10",
    status: "PENDING",
  },
];

export default function DiagnosesPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.diagnosesPage.title}
        description={t.diagnosesPage.description}
        actions={
          <div className="flex items-center gap-s2">
            {/* View Mode Toggle */}
            <div className="bg-white rounded-full border border-gray-5 p-s1 flex">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`press h-9 px-s2 rounded-full text-sm font-bold flex items-center gap-s1 transition-colors ${
                  viewMode === "list"
                    ? "bg-secondary text-primary"
                    : "text-gray-2 hover:bg-gray-5"
                }`}
              >
                <List size={16} />
                Lista
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`press h-9 px-s2 rounded-full text-sm font-bold flex items-center gap-s1 transition-colors ${
                  viewMode === "map"
                    ? "bg-secondary text-primary"
                    : "text-gray-2 hover:bg-gray-5"
                }`}
              >
                <MapIcon size={16} />
                Mapa
              </button>
            </div>

            {/* Export Button */}
            <button
              type="button"
              className="press focus-ring h-11 px-s2 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 font-bold text-base flex items-center gap-s1 transition-colors"
            >
              <Download size={18} />
              {t.diagnosesPage.exportData}
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex flex-col md:flex-row gap-s2 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-3"
          />
          <input
            type="text"
            placeholder={t.diagnosesPage.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-gray-5 rounded-full text-[#1D1D1D] font-bold text-base placeholder:text-[#828282] placeholder:font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-s2 w-full md:w-auto justify-end">
          <select className="press h-11 px-s2 rounded-full border border-gray-5 bg-white text-gray-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none">
            <option>Todas las plagas</option>
            <option>Roya del cafeto</option>
            <option>Minador de la hoja</option>
            <option>Cercosporiosis</option>
            <option>Phoma</option>
            <option>Hoja sana</option>
          </select>
          <select className="press h-11 px-s2 rounded-full border border-gray-5 bg-white text-gray-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none">
            <option>Todos los sectores</option>
            <option>Sector San Miguel</option>
            <option>Sector Cedropampa</option>
            <option>Sector Prado</option>
            <option>Sector Canal</option>
          </select>
          <button
            type="button"
            className="press h-11 px-s2 rounded-full border border-gray-5 bg-white text-gray-2 text-sm font-bold flex items-center gap-s1 hover:bg-gray-5 transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filtros avanzados
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        /* List View */
        <div className="bg-white rounded-2xl border border-gray-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-5/50 border-b border-gray-5 text-gray-2 text-xs font-bold uppercase tracking-wider">
                  <th className="py-s2 px-s3">Diagnóstico</th>
                  <th className="py-s2 px-s3">Caficultor / Finca</th>
                  <th className="py-s2 px-s3">Severidad</th>
                  <th className="py-s2 px-s3">Ubicación</th>
                  <th className="py-s2 px-s3">Fecha</th>
                  <th className="py-s2 px-s3">Estado</th>
                  <th className="py-s2 px-s3 text-right">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-5 text-black-2">
                {MOCK_DIAGNOSES.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-5/30 transition-colors"
                  >
                    <td className="py-s2 px-s3">
                      <div className="flex flex-col">
                        <span className="font-bold">{d.pestName}</span>
                        <span className="text-xs text-gray-3 italic font-normal mt-s1">
                          {d.scientificName}
                        </span>
                      </div>
                    </td>
                    <td className="py-s2 px-s3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-black-2">
                          {d.farmer}
                        </span>
                        <span className="text-xs text-gray-3 font-normal mt-s1">
                          {d.farm}
                        </span>
                      </div>
                    </td>
                    <td className="py-s2 px-s3">
                      <div className="flex items-center gap-s1">
                        <div className="w-16 bg-gray-5 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              d.severity === 0
                                ? "bg-success"
                                : d.severity > 0.7
                                  ? "bg-error"
                                  : "bg-warning"
                            }`}
                            style={{ width: `${d.severity * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-1">
                          {d.severity === 0
                            ? "0%"
                            : `${(d.severity * 100).toFixed(0)}%`}
                        </span>
                      </div>
                    </td>
                    <td className="py-s2 px-s3 text-sm text-gray-2 font-normal">
                      <span className="flex items-center gap-s1">
                        <MapPin size={14} className="text-gray-3" />
                        {d.location}
                      </span>
                    </td>
                    <td className="py-s2 px-s3 text-sm text-gray-3 font-normal">
                      {d.date}
                    </td>
                    <td className="py-s2 px-s3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${
                          d.status === "CONFIRMED"
                            ? "bg-success/10 text-success border-success/20"
                            : d.status === "REJECTED"
                              ? "bg-error/10 text-error border-error/20"
                              : "bg-warning/10 text-warning border-warning/20"
                        }`}
                      >
                        {d.status === "CONFIRMED"
                          ? "Validado"
                          : d.status === "REJECTED"
                            ? "Rechazado"
                            : "Pendiente"}
                      </span>
                    </td>
                    <td className="py-s2 px-s3 text-right">
                      <button
                        type="button"
                        className="press h-8 w-8 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 inline-flex items-center justify-center transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Heatmap View Placeholder */
        <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div className="flex items-center justify-between border-b border-gray-5 pb-s2">
            <div>
              <h6 className="text-h6 font-bold text-black-2">
                Mapa de Calor Fitosanitario
              </h6>
              <p className="text-sm text-gray-3 font-normal mt-s1">
                Visualización geográfica de brotes en Villa Rica, Oxapampa.
              </p>
            </div>
            <div className="flex items-center gap-s2 text-xs font-semibold text-gray-2 bg-gray-5 px-3 py-1.5 rounded-lg border border-gray-4/40">
              <span className="flex items-center gap-s1">
                <span className="h-2.5 w-2.5 rounded-full bg-error" /> Roya
                Crítica
              </span>
              <span className="flex items-center gap-s1">
                <span className="h-2.5 w-2.5 rounded-full bg-warning" /> Minador
                Moderado
              </span>
              <span className="flex items-center gap-s1">
                <span className="h-2.5 w-2.5 rounded-full bg-success" /> Hoja
                Sana
              </span>
            </div>
          </div>

          {/* Interactive Heatmap Canvas Mock */}
          <div className="bg-[#FAF9F5] border border-gray-5 rounded-xl h-[450px] relative overflow-hidden flex items-center justify-center">
            {/* Topographical Grid background representation */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#04A033_1.5px,transparent_1.5px)] [background-size:24px_24px]" />

            {/* Map Contours Mockup */}
            <svg
              className="absolute inset-0 w-full h-full text-primary/15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 800 450"
            >
              <title>Curvas de nivel de mapa fitosanitario</title>
              <path
                d="M50 150 C 150 200, 250 100, 350 250 C 450 400, 550 250, 750 350"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d="M100 300 C 250 200, 350 400, 550 300 C 650 200, 700 150, 780 220"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              {/* Concentric waves symbolizing sectors */}
              <circle
                cx="300"
                cy="220"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
              <circle
                cx="550"
                cy="180"
                r="100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>

            {/* Heatmap Heat-circles */}
            <div className="absolute top-[180px] left-[280px] h-32 w-32 rounded-full bg-error/20 blur-xl animate-pulse" />
            <div className="absolute top-[200px] left-[320px] h-16 w-16 rounded-full bg-error/45 blur-lg" />

            <div className="absolute top-[140px] left-[520px] h-24 w-24 rounded-full bg-warning/20 blur-xl" />
            <div className="absolute top-[160px] left-[540px] h-12 w-12 rounded-full bg-warning/45 blur-lg" />

            <div className="absolute top-[280px] left-[420px] h-20 w-20 rounded-full bg-success/20 blur-xl" />

            {/* Map Pins */}
            <div className="absolute top-[200px] left-[320px] flex flex-col items-center group cursor-pointer z-10">
              <div className="bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm mb-1 opacity-90">
                Roya: 85%
              </div>
              <MapPin size={24} className="text-error fill-error/20" />
            </div>

            <div className="absolute top-[160px] left-[540px] flex flex-col items-center group cursor-pointer z-10">
              <div className="bg-warning text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm mb-1 opacity-90">
                Minador: 40%
              </div>
              <MapPin size={24} className="text-warning fill-warning/20" />
            </div>

            <div className="absolute top-[280px] left-[420px] flex flex-col items-center group cursor-pointer z-10">
              <div className="bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm mb-1 opacity-90">
                Hoja Sana
              </div>
              <MapPin size={24} className="text-success fill-success/20" />
            </div>

            {/* Geographical details floating card */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-4 border border-gray-5 shadow-lg max-w-xs z-10 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-primary">
                <Info size={16} />
                <span className="text-sm font-bold">
                  Foco crítico detectado
                </span>
              </div>
              <p className="text-xs text-gray-2 leading-relaxed">
                El <strong>Sector San Miguel</strong> registra el mayor índice
                de severidad de Roya del Cafeto en los últimos 7 días. Se
                recomienda emitir alerta fitosanitaria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
