"use client";

import { Activity, Boxes, Server, Timer } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCell, StatStrip } from "@/components/ui/stat-strip";
import { TableErrorState } from "@/components/ui/table-error-state";
import { TableSkeletonRows } from "@/components/ui/table-skeleton";
import { useInfrastructure, useServices } from "@/lib/hooks/use-monitoring";
import { t } from "@/lib/i18n/es";

export default function MonitoringPage() {
  const { data: services, isLoading, isError, refetch } = useServices();
  const { data: infra } = useInfrastructure();

  const list = services ?? [];
  const up = list.filter((s) => s.status === "UP").length;
  const lats = list.map((s) => s.latencyMs).filter((l): l is number => l != null);
  const avgLat = lats.length ? Math.round(lats.reduce((a, b) => a + b, 0) / lats.length) : null;
  const infraOk = (infra ?? []).filter((i) => i.status === "UP").length;

  const summary = [
    { label: t.monitoringPage.summary.services, value: String(list.length), hint: t.monitoringPage.summary.servicesHint, icon: Server },
    { label: t.monitoringPage.summary.online, value: `${up}/${list.length}`, hint: t.monitoringPage.summary.onlineHint, icon: Activity },
    { label: t.monitoringPage.summary.latency, value: avgLat != null ? `${avgLat}ms` : "—", hint: t.monitoringPage.summary.latencyHint, icon: Timer },
    { label: t.monitoringPage.summary.infrastructure, value: `${infraOk}/${(infra ?? []).length}`, hint: t.monitoringPage.summary.infrastructureHint, icon: Boxes },
  ];

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader title={t.monitoringPage.title} description={t.monitoringPage.description} />

      <StatStrip className="grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((c) => (
          <StatCell
            key={c.label}
            icon={c.icon}
            label={c.label}
            value={c.value}
            hint={c.hint}
          />
        ))}
      </StatStrip>

      <div className="grid gap-s3 grid-cols-1 xl:grid-cols-12">
        <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div className="flex items-center justify-between border-b border-gray-5 pb-s2">
            <h6 className="text-base font-bold text-black-2">{t.monitoringPage.sections.microservices}</h6>
            <span className="text-xs text-gray-3 font-semibold">Eureka + Actuator (en vivo)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-5/50 border-b border-gray-5 text-gray-2 text-xs font-bold uppercase tracking-wider">
                  <th className="py-s2 px-s3">Servicio</th>
                  <th className="py-s2 px-s3">Réplicas</th>
                  <th className="py-s2 px-s3">CPU / RAM</th>
                  <th className="py-s2 px-s3">Latencia</th>
                  <th className="py-s2 px-s3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-5 text-black-2">
                {isLoading ? (
                  <TableSkeletonRows rows={6} cols={5} />
                ) : isError ? (
                  <TableErrorState colSpan={5} onRetry={() => refetch()} retrying={false} />
                ) : (
                  list.map((srv) => (
                    <tr key={srv.name} className="hover:bg-cream-2/60 transition-colors">
                      <td className="py-s2 px-s3 font-bold">{srv.name}</td>
                      <td className="py-s2 px-s3 text-sm font-semibold">{srv.instances}</td>
                      <td className="py-s2 px-s3 text-sm text-gray-3 font-mono">—</td>
                      <td className="py-s2 px-s3 text-sm text-gray-3 font-mono">
                        {srv.latencyMs != null ? `${srv.latencyMs}ms` : "—"}
                      </td>
                      <td className="py-s2 px-s3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-2xs font-bold border ${
                          srv.status === "UP"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-error/10 text-error border-error/20"
                        }`}>
                          {srv.status === "UP" ? t.serviceStatus.up : t.serviceStatus.down}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-2xs text-gray-3">{t.monitoringPage.cpuNote}</p>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-s3">
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">{t.monitoringPage.sections.infrastructure}</h6>
            <ul className="flex flex-col gap-s2">
              {(infra ?? []).map((inf) => (
                <li key={inf.name} className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-black-2">{inf.name}</span>
                  <span className={`px-2.5 py-1 rounded-full text-2xs font-bold border ${
                    inf.status === "UP"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-error/10 text-error border-error/20"
                  }`}>
                    {inf.status === "UP" ? t.serviceStatus.up : t.serviceStatus.down}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">{t.monitoringPage.sections.actions}</h6>
            <p className="text-xs text-gray-3">
              {t.monitoringPage.actionsNote}
            </p>
            {[
              t.monitoringPage.actions.purge,
              t.monitoringPage.actions.restartKafka,
              t.monitoringPage.actions.downloadLogs,
            ].map((a) => (
              <button
                key={a}
                type="button"
                disabled
                title={t.monitoringPage.actions.notAvailable}
                className="focus-ring h-11 w-full border border-gray-5 text-sm font-bold text-gray-3 rounded-full opacity-50 cursor-not-allowed"
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
