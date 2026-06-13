"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckSquare,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { t } from "@/lib/i18n/es";

// Mock data following the domain models in CLAUDE.md
const MOCK_STATS = [
  {
    label: t.home.stats.activeFarmers,
    value: "142",
    change: "+12% este mes",
    icon: Users,
    color: "text-primary bg-secondary border border-primary/20",
  },
  {
    label: t.home.stats.pendingValidation,
    value: "28",
    change: "Requiere atención",
    icon: CheckSquare,
    color: "text-warning bg-warning/10 border border-warning/20",
  },
  {
    label: t.home.stats.activeAlerts,
    value: "3",
    change: "2 críticas en Villa Rica",
    icon: AlertTriangle,
    color: "text-error bg-error/10 border border-error/20",
  },
  {
    label: t.home.stats.modelAccuracy,
    value: "94.2%",
    change: "v2.1 · YOLOv8",
    icon: Sparkles,
    color: "text-primary bg-secondary border border-primary/20",
  },
];

const MOCK_DIAGNOSES = [
  {
    id: "d1",
    pest: "RUST",
    pestName: "Roya del cafeto (Hemileia vastatrix)",
    farmer: "Mateo Quispe",
    farm: "Finca La Flor",
    confidence: 0.96,
    severity: 0.85,
    location: "Villa Rica - Sector San Miguel",
    date: "Hace 10 min",
    source: "OFFLINE_SYNCED",
  },
  {
    id: "d2",
    pest: "MINER",
    pestName: "Minador de la hoja (Leucoptera coffeella)",
    farmer: "Elena Valdivia",
    farm: "Finca El Pino",
    confidence: 0.89,
    severity: 0.4,
    location: "Villa Rica - Sector Cedropampa",
    date: "Hace 45 min",
    source: "ONLINE",
  },
  {
    id: "d3",
    pest: "HEALTHY",
    pestName: "Hoja sana",
    farmer: "Carlos Mendoza",
    farm: "Finca Vista Alegre",
    confidence: 0.98,
    severity: 0.0,
    location: "Villa Rica - Sector Prado",
    date: "Hace 2 horas",
    source: "OFFLINE_SYNCED",
  },
  {
    id: "d4",
    pest: "PHOMA",
    pestName: "Phoma o quema (Phyllasticta coffeicola)",
    farmer: "Julia Ruiz",
    farm: "Finca Santa Rosa",
    confidence: 0.76,
    severity: 0.65,
    location: "Villa Rica - Sector Canal",
    date: "Hace 4 horas",
    source: "ONLINE",
  },
];

const MOCK_SERVICES = [
  { name: "API Gateway", status: "HEALTHY", latency: "14ms" },
  { name: "Auth Service", status: "HEALTHY", latency: "8ms" },
  { name: "User Service", status: "HEALTHY", latency: "12ms" },
  { name: "Diagnosis Service", status: "HEALTHY", latency: "25ms" },
  { name: "History & Sync Service", status: "HEALTHY", latency: "18ms" },
  { name: "ML Model Service (YOLOv8)", status: "HEALTHY", latency: "110ms" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-s3">
      <PageHeader title={t.home.title} description={t.home.description} />

      {/* Stats Grid */}
      <div className="grid gap-s2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {MOCK_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-start justify-between"
            >
              <div className="flex flex-col gap-s1">
                <span className="text-sm font-normal text-gray-2">
                  {stat.label}
                </span>
                <span className="text-3xl font-bold text-black-2">
                  {stat.value}
                </span>
                <span className="text-xs font-normal text-gray-3">
                  {stat.change}
                </span>
              </div>
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}
              >
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Sections */}
      <div className="grid gap-s3 grid-cols-1 xl:grid-cols-3">
        {/* Left Column: Recent Diagnoses */}
        <div className="xl:col-span-2 flex flex-col gap-s2">
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-h6 font-bold text-black-2">
                  {t.home.recentDiagnoses}
                </h6>
                <p className="text-sm text-gray-3 font-normal mt-s1">
                  {t.home.recentDiagnosesDesc}
                </p>
              </div>
              <Link
                href="/diagnoses"
                className="press focus-ring h-10 px-s2 rounded-full border border-gray-5 text-sm font-bold text-primary hover:bg-secondary flex items-center gap-s1 transition-colors"
              >
                Ver todo
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <ul className="flex flex-col divide-y divide-gray-5 border-t border-gray-5">
              {MOCK_DIAGNOSES.map((d) => (
                <li
                  key={d.id}
                  className="py-s2 flex flex-col md:flex-row md:items-center justify-between gap-s2"
                >
                  <div className="flex items-start gap-s1">
                    <span
                      className={`h-2.5 w-2.5 rounded-full mt-2 shrink-0 ${
                        d.pest === "HEALTHY"
                          ? "bg-success"
                          : d.severity > 0.7
                            ? "bg-error"
                            : "bg-warning"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-base font-bold text-black-2 leading-snug">
                        {d.pestName}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-s2 gap-y-s1 text-sm text-gray-2 mt-s1">
                        <span className="font-semibold text-black-3">
                          {d.farmer}
                        </span>
                        <span className="text-gray-4">•</span>
                        <span>{d.farm}</span>
                        <span className="text-gray-4">•</span>
                        <span className="flex items-center gap-s1">
                          <MapPin size={14} className="text-gray-3" />
                          {d.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-s2 shrink-0 self-end md:self-center">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-black-2">
                        {d.pest === "HEALTHY"
                          ? "Sana"
                          : `Confianza: ${(d.confidence * 100).toFixed(0)}%`}
                      </span>
                      <span className="text-xs text-gray-3 mt-s1">
                        {d.date}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        d.source === "OFFLINE_SYNCED"
                          ? "bg-secondary text-primary border border-primary/10"
                          : "bg-gray-5 text-gray-1 border border-gray-4/20"
                      }`}
                    >
                      {d.source === "OFFLINE_SYNCED" ? "Offline" : "En vivo"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: System status and alerts */}
        <div className="flex flex-col gap-s3">
          {/* Services Health */}
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <div>
              <h6 className="text-h6 font-bold text-black-2">
                {t.home.systemStatus}
              </h6>
              <p className="text-sm text-gray-3 font-normal mt-s1">
                {t.home.systemStatusDesc}
              </p>
            </div>

            <ul className="flex flex-col gap-s2">
              {MOCK_SERVICES.map((srv) => (
                <li
                  key={srv.name}
                  className="flex items-center justify-between p-s2 rounded-xl bg-gray-5/40 border border-gray-5"
                >
                  <div className="flex items-center gap-s2">
                    <span className="h-2 w-2 rounded-full bg-success dot-pulse" />
                    <span className="text-sm font-bold text-black-2">
                      {srv.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-s2">
                    <span className="text-xs text-gray-3 font-normal">
                      {srv.latency}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold border border-success/20">
                      ONLINE
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href="/monitoring"
              className="press focus-ring h-11 w-full rounded-full border border-gray-5 text-sm font-bold text-gray-1 hover:bg-gray-5 flex items-center justify-center gap-s1 mt-s1 transition-colors"
            >
              <Activity size={16} />
              Ir a Monitoreo
            </Link>
          </div>

          {/* Prompt to validate dataset */}
          <div className="bg-black-3 rounded-2xl p-s3 text-white flex flex-col gap-s2 relative overflow-hidden border border-gray-4/20 shadow-sm">
            <div className="flex flex-col gap-s1 relative z-10">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                COLA DE ETIQUETADO
              </span>
              <h5 className="text-xl font-bold mt-s1">
                Mejora el Dataset del Modelo
              </h5>
              <p className="text-sm text-white/80 font-normal mt-s2 leading-relaxed">
                Hay 28 diagnósticos reportados por agricultores que tienen baja
                confianza (&lt; 60%) y requieren validación fitosanitaria
                experta.
              </p>
            </div>

            <Link
              href="/validation"
              className="press focus-ring h-11 w-full bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-s1 relative z-10 shadow-sm hover:opacity-85 transition-opacity"
            >
              <CheckSquare size={16} />
              Validar Imágenes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
