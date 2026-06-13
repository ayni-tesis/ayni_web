"use client";

import {
  Cpu,
  HardDrive,
  RefreshCw,
  RotateCw,
  Terminal,
  Timer,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { t } from "@/lib/i18n/es";

const INITIAL_SERVICES = [
  {
    name: "API Gateway",
    status: "HEALTHY",
    cpu: "0.8%",
    memory: "112 MB",
    replicas: "2/2",
    latency: "14ms",
  },
  {
    name: "Eureka Server",
    status: "HEALTHY",
    cpu: "0.4%",
    memory: "180 MB",
    replicas: "1/1",
    latency: "4ms",
  },
  {
    name: "Auth Service",
    status: "HEALTHY",
    cpu: "1.2%",
    memory: "145 MB",
    replicas: "2/2",
    latency: "8ms",
  },
  {
    name: "User Service",
    status: "HEALTHY",
    cpu: "0.9%",
    memory: "128 MB",
    replicas: "2/2",
    latency: "12ms",
  },
  {
    name: "Diagnosis Service",
    status: "HEALTHY",
    cpu: "3.4%",
    memory: "310 MB",
    replicas: "3/3",
    latency: "25ms",
  },
  {
    name: "History & Sync Service",
    status: "HEALTHY",
    cpu: "2.1%",
    memory: "215 MB",
    replicas: "2/2",
    latency: "18ms",
  },
  {
    name: "Report Service",
    status: "DEGRADED",
    cpu: "5.8%",
    memory: "450 MB",
    replicas: "1/2",
    latency: "115ms",
  },
  {
    name: "Notification Service",
    status: "HEALTHY",
    cpu: "0.6%",
    memory: "98 MB",
    replicas: "1/1",
    latency: "6ms",
  },
  {
    name: "ML Model Service (YOLOv8)",
    status: "HEALTHY",
    cpu: "18.4%",
    memory: "1.4 GB",
    replicas: "2/2",
    latency: "110ms",
  },
];

const INITIAL_INFRA = [
  {
    name: "PostgreSQL (Neon Serverless)",
    status: "HEALTHY",
    detail: "45 conexiones activas",
    metrics: "Storage: 4.2 GB / 10 GB",
  },
  {
    name: "Apache Kafka Cluster",
    status: "HEALTHY",
    detail: "Lag de colas: 0 msgs",
    metrics: "Tasa: 145 msgs/seg",
  },
  {
    name: "Azure Blob Storage",
    status: "HEALTHY",
    detail: "18.5k imágenes almacenadas",
    metrics: "Quota: 8.5 GB usados",
  },
  {
    name: "Firebase Cloud Messaging (FCM)",
    status: "HEALTHY",
    detail: "Servicio push activo",
    metrics: "Entrega: 99.9% success",
  },
];

export default function MonitoringPage() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [infra, _setInfra] = useState(INITIAL_INFRA);
  const [actionLog, setActionLog] = useState<string | null>(null);

  const triggerAction = (actionName: string) => {
    setActionLog(
      `Comando [${actionName}] ejecutado correctamente. Verificando estado...`,
    );
    setTimeout(() => {
      setActionLog(null);
    }, 2000);
  };

  const restartService = (serviceName: string) => {
    setActionLog(`Reiniciando contenedor de microservicio: ${serviceName}...`);
    // Simulate degrade state during restart
    setServices((prev) =>
      prev.map((s) =>
        s.name === serviceName
          ? { ...s, status: "RESTARTING", cpu: "0.0%", memory: "10 MB" }
          : s,
      ),
    );

    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) =>
          s.name === serviceName
            ? { ...s, status: "HEALTHY", cpu: "0.8%", memory: "125 MB" }
            : s,
        ),
      );
      setActionLog(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.monitoringPage.title}
        description={t.monitoringPage.description}
      />

      {actionLog && (
        <div className="bg-warning/10 border border-warning/30 text-gray-1 p-s2 rounded-xl flex items-center gap-s2 animate-pulse">
          <Terminal size={18} className="text-warning shrink-0" />
          <span className="text-sm font-mono">{actionLog}</span>
        </div>
      )}

      {/* Resource metrics overview row */}
      <div className="grid gap-s2 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center justify-between">
          <div className="flex flex-col gap-s1">
            <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
              {t.monitoringPage.metrics.cpu}
            </span>
            <span className="text-2xl font-bold text-black-2">34.2%</span>
            <span className="text-[10px] text-gray-3 font-normal mt-s1">
              Promedio de cluster AKS
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-secondary text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <Cpu size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center justify-between">
          <div className="flex flex-col gap-s1">
            <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
              {t.monitoringPage.metrics.memory}
            </span>
            <span className="text-2xl font-bold text-black-2">68.5%</span>
            <span className="text-[10px] text-gray-3 font-normal mt-s1">
              3.1 GB de 4.5 GB totales
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-secondary text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <HardDrive size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center justify-between">
          <div className="flex flex-col gap-s1">
            <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
              {t.monitoringPage.metrics.rps}
            </span>
            <span className="text-2xl font-bold text-black-2">32.8 RPS</span>
            <span className="text-[10px] text-gray-3 font-normal mt-s1">
              p95 latencia: 42ms
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-secondary text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <Zap size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center justify-between">
          <div className="flex flex-col gap-s1">
            <span className="text-xs text-gray-3 font-semibold uppercase tracking-wider">
              {t.monitoringPage.metrics.syncSuccess}
            </span>
            <span className="text-2xl font-bold text-black-2">99.8%</span>
            <span className="text-[10px] text-gray-3 font-normal mt-s1">
              1.4k colas sync exitosas
            </span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success border border-success/20 flex items-center justify-center shrink-0">
            <Timer size={20} />
          </div>
        </div>
      </div>

      {/* Main Monitoring Sections */}
      <div className="grid gap-s3 grid-cols-1 xl:grid-cols-12">
        {/* Left column: Microservices status list (Col-span 7) */}
        <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div className="flex items-center justify-between border-b border-gray-5 pb-s2">
            <h6 className="text-base font-bold text-black-2">
              {t.monitoringPage.sections.microservices}
            </h6>
            <span className="text-xs text-gray-3 font-semibold">
              AKS Cluster: Villa Rica Hub
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-5/50 border-b border-gray-5 text-gray-2 text-xs font-bold uppercase tracking-wider">
                  <th className="py-s2 px-s3">Servicio</th>
                  <th className="py-s2 px-s3">Replicas</th>
                  <th className="py-s2 px-s3">Recursos CPU/RAM</th>
                  <th className="py-s2 px-s3">Latencia</th>
                  <th className="py-s2 px-s3">Estado</th>
                  <th className="py-s2 px-s3 text-right">Controles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-5 text-black-2">
                {services.map((srv) => (
                  <tr
                    key={srv.name}
                    className="hover:bg-gray-5/30 transition-colors"
                  >
                    <td className="py-s2 px-s3 font-bold">{srv.name}</td>
                    <td className="py-s2 px-s3 text-sm font-semibold">
                      {srv.replicas}
                    </td>
                    <td className="py-s2 px-s3 text-sm text-gray-2 font-mono">
                      {srv.cpu} / {srv.memory}
                    </td>
                    <td className="py-s2 px-s3 text-sm text-gray-3 font-mono">
                      {srv.latency}
                    </td>
                    <td className="py-s2 px-s3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${
                          srv.status === "HEALTHY"
                            ? "bg-success/10 text-success border-success/20"
                            : srv.status === "DEGRADED"
                              ? "bg-warning/10 text-warning border-warning/20 animate-pulse"
                              : "bg-gray-5 text-gray-3 border-gray-4/30"
                        }`}
                      >
                        {srv.status === "HEALTHY"
                          ? "SALUDABLE"
                          : srv.status === "DEGRADED"
                            ? "DEGRADADO"
                            : "REINICIANDO"}
                      </span>
                    </td>
                    <td className="py-s2 px-s3 text-right">
                      <button
                        type="button"
                        onClick={() => restartService(srv.name)}
                        disabled={srv.status === "RESTARTING"}
                        aria-label={`Reiniciar ${srv.name}`}
                        className="press focus-ring h-8 w-8 rounded-full border border-gray-5 text-gray-3 hover:text-primary hover:bg-secondary inline-flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        <RefreshCw
                          size={14}
                          className={
                            srv.status === "RESTARTING" ? "animate-spin" : ""
                          }
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Infrastructure status and controls (Col-span 5) */}
        <div className="xl:col-span-4 flex flex-col gap-s3">
          {/* Infrastructure status */}
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">
              {t.monitoringPage.sections.infrastructure}
            </h6>

            <ul className="flex flex-col gap-s2">
              {infra.map((inf) => (
                <li
                  key={inf.name}
                  className="p-s2 rounded-xl bg-gray-5/40 border border-gray-5 flex flex-col gap-s1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-black-2">
                      {inf.name}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold border border-success/20">
                      ONLINE
                    </span>
                  </div>
                  <span className="text-xs text-gray-1 mt-s1 font-medium leading-normal">
                    {inf.detail}
                  </span>
                  <span className="text-[10px] text-gray-3 font-mono mt-0.5">
                    {inf.metrics}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
            <h6 className="text-base font-bold text-black-2">
              {t.monitoringPage.sections.actions}
            </h6>

            <div className="flex flex-col gap-s2">
              <button
                type="button"
                onClick={() => triggerAction("PURGE_QUEUES")}
                className="press focus-ring h-11 w-full border border-gray-5 text-sm font-bold text-gray-1 hover:bg-gray-5 flex items-center justify-center gap-s1 transition-colors rounded-full"
              >
                <Trash2 size={16} />
                Purgar colas de sync fallidas
              </button>

              <button
                type="button"
                onClick={() => triggerAction("RESTART_KAFKA")}
                className="press focus-ring h-11 w-full border border-gray-5 text-sm font-bold text-gray-1 hover:bg-gray-5 flex items-center justify-center gap-s1 transition-colors rounded-full"
              >
                <RotateCw size={16} />
                Reiniciar Brokers de Kafka
              </button>

              <button
                type="button"
                onClick={() => triggerAction("DOWNLOAD_LOGS")}
                className="press focus-ring h-11 w-full bg-black-3 text-white border border-gray-4/20 text-sm font-bold flex items-center justify-center gap-s1 transition-colors rounded-full hover:opacity-85"
              >
                <Terminal size={16} />
                Descargar logs de errores (.log)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
