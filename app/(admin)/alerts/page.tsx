"use client";

import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Flame,
  Pause,
  Play,
  Plus,
  Sliders,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { t } from "@/lib/i18n/es";

const MOCK_RULES = [
  {
    id: "r1",
    name: "Incidencia Crítica de Roya",
    pest: "RUST",
    pestName: "Roya del cafeto (Hemileia vastatrix)",
    threshold: "30% de incidencia",
    sector: "Sector San Miguel",
    channels: ["FCM Push Notification", "SMS Caficultores"],
    recipients: "Todos los agrónomos + Caficultores del sector",
    status: "ACTIVE",
    lastTriggered: "Hace 2 días",
  },
  {
    id: "r2",
    name: "Brote Inicial de Minador",
    pest: "MINER",
    pestName: "Minador de la hoja (Leucoptera coffeella)",
    threshold: "45% de incidencia",
    sector: "Todos los sectores",
    channels: ["FCM Push Notification", "Email Cooperativa"],
    recipients: "Agrónomos asignados",
    status: "ACTIVE",
    lastTriggered: "Hace 5 días",
  },
  {
    id: "r3",
    name: "Umbral Fitosanitario Phoma",
    pest: "PHOMA",
    pestName: "Phoma o quema (Phyllasticta coffeicola)",
    threshold: "20% de incidencia",
    sector: "Sector Canal",
    channels: ["Email Cooperativa"],
    recipients: "Directores de cooperativa",
    status: "PAUSED",
    lastTriggered: "Nunca",
  },
];

export default function AlertsPage() {
  const [rules, setRules] = useState(MOCK_RULES);

  const toggleStatus = (id: string) => {
    setRules(
      rules.map((rule) => {
        if (rule.id === id) {
          return {
            ...rule,
            status: rule.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
          };
        }
        return rule;
      }),
    );
  };

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.alertsPage.title}
        description={t.alertsPage.description}
        actions={
          <button
            type="button"
            className="press focus-ring h-11 px-s2 rounded-full bg-primary text-white font-bold text-base hover:opacity-85 transition-opacity inline-flex items-center gap-s1"
          >
            <Plus size={18} strokeWidth={2.25} />
            {t.alertsPage.createRule}
          </button>
        }
      />

      {/* Quick summary stats */}
      <div className="grid gap-s2 grid-cols-1 md:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center gap-s2">
          <div className="h-10 w-10 rounded-lg bg-success/10 text-success border border-success/20 flex items-center justify-center shrink-0">
            <CheckCircle size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-3 font-normal uppercase tracking-wider">
              Reglas activas
            </span>
            <span className="text-xl font-bold text-black-2">
              {rules.filter((r) => r.status === "ACTIVE").length} de{" "}
              {rules.length}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center gap-s2">
          <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning border border-warning/20 flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-3 font-normal uppercase tracking-wider">
              Disparos esta semana
            </span>
            <span className="text-xl font-bold text-black-2">
              12 notificaciones
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center gap-s2">
          <div className="h-10 w-10 rounded-lg bg-error/10 text-error border border-error/20 flex items-center justify-center shrink-0">
            <Flame size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-3 font-normal uppercase tracking-wider">
              Zona en alerta máxima
            </span>
            <span className="text-xl font-bold text-black-2">
              Sector San Miguel
            </span>
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <h6 className="text-base font-bold text-black-2">
          {t.alertsPage.rulesList}
        </h6>

        <ul className="flex flex-col divide-y divide-gray-5 border-t border-gray-5">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="py-s2 flex flex-col lg:flex-row lg:items-center justify-between gap-s2"
            >
              <div className="flex items-start gap-s2">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border ${
                    rule.status === "ACTIVE"
                      ? "bg-error/10 text-error border-error/25 animate-pulse"
                      : "bg-gray-5 text-gray-3 border-gray-4/30"
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>
                <div className="min-w-0 flex flex-col">
                  <div className="flex items-center gap-s2">
                    <span className="text-base font-bold text-black-2">
                      {rule.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rule.status === "ACTIVE"
                          ? "bg-error/10 text-error border-error/20"
                          : "bg-gray-5 text-gray-3 border-gray-4/30"
                      }`}
                    >
                      {rule.status === "ACTIVE" ? "ACTIVA" : "PAUSADA"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-2 font-normal mt-s1 leading-relaxed">
                    Si <strong>{rule.pestName}</strong> supera el{" "}
                    <strong>{rule.threshold}</strong> en{" "}
                    <strong>{rule.sector}</strong>.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-s2 gap-y-s1 text-xs text-gray-3 font-semibold mt-s2">
                    <span className="flex items-center gap-s1">
                      <Sliders size={12} />
                      Canales: {rule.channels.join(", ")}
                    </span>
                    <span className="text-gray-4">•</span>
                    <span>Destinatarios: {rule.recipients}</span>
                    {rule.status === "ACTIVE" && (
                      <>
                        <span className="text-gray-4">•</span>
                        <span className="text-error">
                          Último disparo: {rule.lastTriggered}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-s2 shrink-0 self-end lg:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(rule.id)}
                  aria-label={
                    rule.status === "ACTIVE" ? "Pausar regla" : "Activar regla"
                  }
                  className={`press focus-ring h-10 px-s2 rounded-full border text-xs font-bold flex items-center gap-s1 transition-colors ${
                    rule.status === "ACTIVE"
                      ? "border-gray-5 text-gray-1 hover:bg-gray-5"
                      : "border-primary/20 text-primary bg-secondary/35 hover:bg-secondary"
                  }`}
                >
                  {rule.status === "ACTIVE" ? (
                    <>
                      <Pause size={14} />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play size={14} fill="currentColor" />
                      Activar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Eliminar regla"
                  className="press focus-ring h-10 w-10 rounded-full border border-gray-5 text-gray-3 hover:text-error hover:bg-error/5 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
