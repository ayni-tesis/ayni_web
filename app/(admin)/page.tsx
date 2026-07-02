"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckSquare,
  ClipboardCheck,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { LandscapeArt } from "@/components/brand/landscape-art";
import { EmptyState } from "@/components/ui/empty-state";
import { PanelSkeleton } from "@/components/ui/panel-skeleton";
import { StatCell, StatStrip } from "@/components/ui/stat-strip";
import type { AdminDiagnosis } from "@/lib/api/diagnoses";
import { useSession } from "@/lib/auth/use-session";
import { formatRelativeTime } from "@/lib/format";
import { useDashboardStats, useDiagnoses } from "@/lib/hooks/use-diagnoses";
import { t } from "@/lib/i18n/es";

// El estado de salud de los servicios pertenece a Monitoreo (Fase 4 de integración).
const SERVICES_PREVIEW = [
  "API Gateway",
  "Auth Service",
  "Diagnosis Service",
  "History & Sync Service",
  "Report Service",
  "ML Model Service",
];

function pct(value: number | null | undefined, digits = 0): string {
  if (value == null) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

function locationOf(d: AdminDiagnosis): string {
  if (d.latitude && d.longitude) return `${d.latitude}, ${d.longitude}`;
  return "Sin ubicación";
}

export default function HomePage() {
  const { user } = useSession();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recent, isLoading: recentLoading } = useDiagnoses({
    page: 0,
    size: 5,
  });

  const firstName = user?.fullName?.trim().split(/\s+/)[0];
  const pageTitle = firstName
    ? t.home.greeting(firstName, new Date().getHours())
    : t.home.title;

  const cards = [
    {
      label: t.home.stats.activeFarmers,
      value: statsLoading ? "—" : String(stats?.activeFarmers ?? 0),
      change: "Con diagnósticos registrados",
      icon: Users,
      iconClass: "text-gray-3",
    },
    {
      label: t.home.stats.pendingValidation,
      value: statsLoading ? "—" : String(stats?.pendingValidation ?? 0),
      change: "Confianza < 60%",
      icon: CheckSquare,
      iconClass: "text-warning",
    },
    {
      label: t.home.stats.activeAlerts,
      value: statsLoading ? "—" : String(stats?.criticalAlerts ?? 0),
      change: "Severidad > 70%",
      icon: AlertTriangle,
      iconClass: "text-error",
    },
    {
      label: t.home.stats.modelConfidence,
      value: statsLoading ? "—" : pct(stats?.avgConfidence, 1),
      change: stats?.topPest ? `Plaga frecuente: ${stats.topPest}` : "—",
      icon: Sparkles,
      iconClass: "text-gray-3",
    },
  ];

  const recentItems = recent?.content ?? [];

  return (
    <div className="flex flex-col gap-s3">
      <section className="relative overflow-hidden rounded-3xl bg-forest-deep text-white p-s4 md:p-s5">
        <LandscapeArt className="absolute inset-y-0 right-0 w-2/3 md:w-1/2 h-full opacity-70 [mask-image:linear-gradient(to_left,black_30%,transparent)]" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-h5 md:text-h4 font-bold tracking-tight text-balance">
            {pageTitle}
          </h1>
          <p className="text-base text-white/75 mt-s1 max-w-prose">
            {t.home.description}
          </p>
        </div>
      </section>

      <StatStrip className="rise rise-fast grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => (
          <StatCell
            key={stat.label}
            icon={stat.icon}
            iconClass={stat.iconClass}
            label={stat.label}
            value={stat.value}
            hint={stat.change}
          />
        ))}
      </StatStrip>

      <div className="rise rise-fast rise-2 grid gap-s3 grid-cols-1 xl:grid-cols-3">
        {/* Diagnósticos recientes (real) */}
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
                {t.home.viewAll}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {recentLoading ? (
              <PanelSkeleton rows={5} />
            ) : recentItems.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title={t.home.noDiagnoses}
                body=""
              />
            ) : (
              <ul className="flex flex-col divide-y divide-gray-5 border-t border-gray-5">
                {recentItems.map((d) => (
                  <li
                    key={d.id}
                    className="py-s2 flex flex-col md:flex-row md:items-center justify-between gap-s2"
                  >
                    <div className="flex items-start gap-s1">
                      <span
                        className={`h-2.5 w-2.5 rounded-full mt-2 shrink-0 ${
                          d.pestType === "HEALTHY"
                            ? "bg-success"
                            : (d.severity ?? 0) > 0.7
                              ? "bg-error"
                              : "bg-warning"
                        }`}
                      />
                      <span className="sr-only">
                        {d.pestType === "HEALTHY"
                          ? t.home.severityLabel.healthy
                          : (d.severity ?? 0) > 0.7
                            ? t.home.severityLabel.high
                            : t.home.severityLabel.medium}
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-black-2 leading-snug">
                          {d.pestName}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-s2 gap-y-s1 text-sm text-gray-2 mt-s1">
                          <span className="font-semibold text-black-3">
                            {d.farmerLabel}
                          </span>
                          <span className="text-gray-4">•</span>
                          <span className="flex items-center gap-s1">
                            <MapPin size={14} className="text-gray-3" />
                            {locationOf(d)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-s2 shrink-0 self-end md:self-center">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-black-2">
                          {d.pestType === "HEALTHY"
                            ? t.home.healthy
                            : `Confianza: ${pct(d.confidence)}`}
                        </span>
                        <span className="text-xs text-gray-3 mt-s1">
                          {d.capturedAt
                            ? formatRelativeTime(d.capturedAt)
                            : "—"}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          d.source === "OFFLINE_SYNCED"
                            ? "bg-secondary text-primary border border-primary/10"
                            : "bg-gray-5 text-gray-1 border border-gray-4/20"
                        }`}
                      >
                        {d.source === "OFFLINE_SYNCED"
                          ? t.home.sourceSynced
                          : t.home.sourceLive}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-s3">
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <div>
              <h6 className="text-h6 font-bold text-black-2">
                {t.home.systemStatus}
              </h6>
              <p className="text-sm text-gray-3 font-normal mt-s1">
                {t.home.systemStatusPreview}
              </p>
            </div>
            <ul className="flex flex-col gap-s2">
              {SERVICES_PREVIEW.map((name) => (
                <li
                  key={name}
                  className="flex items-center justify-between p-s2 rounded-xl bg-gray-5/40 border border-gray-5"
                >
                  <div className="flex items-center gap-s2">
                    <span
                      role="img"
                      className="h-2 w-2 rounded-full bg-gray-4 dot-pulse"
                      aria-label={t.serviceStatus.up}
                    />
                    <span className="text-sm font-bold text-black-2">
                      {name}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-xl bg-gray-5 text-gray-2 text-2xs font-bold border border-gray-4/20">
                    —
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/monitoring"
              className="press focus-ring h-11 w-full rounded-full border border-gray-5 text-sm font-bold text-gray-1 hover:bg-gray-5 flex items-center justify-center gap-s1 mt-s1 transition-colors"
            >
              <Activity size={16} />
              {t.home.goToMonitoring}
            </Link>
          </div>

          <div className="bg-forest-deep rounded-2xl p-s3 text-white flex flex-col gap-s2 relative overflow-hidden">
            <div className="flex flex-col gap-s1 relative z-10">
              <span className="text-2xs font-bold text-secondary uppercase tracking-[0.25em]">
                {t.home.labelingQueue}
              </span>
              <h5 className="text-xl font-bold mt-s1">{t.home.labelingCta}</h5>
              <p className="text-sm text-white/80 font-normal mt-s2 leading-relaxed">
                {statsLoading
                  ? "…"
                  : t.home.labelingBody(stats?.pendingValidation ?? 0)}
              </p>
            </div>
            <Link
              href="/validation"
              className="press focus-ring h-11 w-full bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-s1 relative z-10 shadow-sm hover:opacity-85 transition-opacity"
            >
              <CheckSquare size={16} />
              {t.home.validateImages}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
