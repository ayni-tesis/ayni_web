"use client";

import { Activity, Boxes, Server, Timer } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { useInfrastructure, useServices } from "@/lib/hooks/use-monitoring";
import { t } from "@/lib/i18n/es";

export default function MonitoringPage() {
  const { data: services, isLoading, isError } = useServices();
  const { data: infra } = useInfrastructure();

  const list = services ?? [];
  const up = list.filter((s) => s.status === "UP").length;
  const lats = list.map((s) => s.latencyMs).filter((l): l is number => l != null);
  const avgLat = lats.length ? Math.round(lats.reduce((a, b) => a + b, 0) / lats.length) : null;
  const infraOk = (infra ?? []).filter((i) => i.status === "UP").length;

  const summary = [
    { label: "Servicios", value: String(list.length), hint: "registrados en Eureka", icon: Server },
    { label: "En línea", value: `${up}/${list.length}`, hint: "estado UP", icon: Activity },
    { label: "Latencia media", value: avgLat != null ? `${avgLat}ms` : "—", hint: "health-check", icon: Timer },
    { label: "Infraestructura", value: `${infraOk}/${(infra ?? []).length}`, hint: "MySQL/Kafka/Eureka", icon: Boxes },
  ];

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader title={t.monitoringPage.title} description={t.monitoringPage.description} />

      <div className="grid gap-s2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center justify-between">
              <div className="flex flex-col gap-s1">
                <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">{c.label}</span>
                <span className="text-2xl font-bold text-black-2">{c.value}</span>
                <span className="text-[10px] text-gray-3 font-normal mt-s1">{c.hint}</span>
              </div>
              <div className="h-10 w-10 rounded-lg bg-secondary text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

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
                  <tr><td colSpan={5} className="py-s3 px-s3 text-center text-gray-3">Cargando…</td></tr>
                ) : isError ? (
                  <tr><td colSpan={5} className="py-s3 px-s3 text-center text-error">No se pudo cargar el estado.</td></tr>
                ) : (
                  list.map((srv) => (
                    <tr key={srv.name} className="hover:bg-gray-5/30 transition-colors">
                      <td className="py-s2 px-s3 font-bold">{srv.name}</td>
                      <td className="py-s2 px-s3 text-sm font-semibold">{srv.instances}</td>
                      <td className="py-s2 px-s3 text-sm text-gray-3 font-mono">—</td>
                      <td className="py-s2 px-s3 text-sm text-gray-3 font-mono">
                        {srv.latencyMs != null ? `${srv.latencyMs}ms` : "—"}
                      </td>
                      <td className="py-s2 px-s3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          srv.status === "UP"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-error/10 text-error border-error/20"
                        }`}>
                          {srv.status === "UP" ? "EN LÍNEA" : "CAÍDO"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-gray-3">CPU/RAM por servicio: no expuesto en esta versión.</p>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-s3">
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">{t.monitoringPage.sections.infrastructure}</h6>
            <ul className="flex flex-col gap-s2">
              {(infra ?? []).map((inf) => (
                <li key={inf.name} className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex items-center justify-between">
                  <span className="text-sm font-bold text-black-2">{inf.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    inf.status === "UP"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-error/10 text-error border-error/20"
                  }`}>
                    {inf.status === "UP" ? "ONLINE" : "OFFLINE"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">{t.monitoringPage.sections.actions}</h6>
            <p className="text-xs text-gray-3">
              Las acciones de control (reiniciar servicios, purgar colas) no están disponibles desde el
              panel; se gestionan en la plataforma de despliegue.
            </p>
            {["Purgar colas de sync", "Reiniciar Brokers de Kafka", "Descargar logs"].map((a) => (
              <button
                key={a}
                type="button"
                disabled
                title="No disponible desde el panel"
                className="h-11 w-full border border-gray-5 text-sm font-bold text-gray-3 rounded-full opacity-50 cursor-not-allowed"
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
