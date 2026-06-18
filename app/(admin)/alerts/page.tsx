"use client";

import { AlertTriangle, CheckCircle, Pause, Play, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { type AlertRule, PEST_FILTER_OPTIONS } from "@/lib/api/alerts";
import {
  useAlertRules,
  useCreateRule,
  useDeleteRule,
  useUpdateRule,
} from "@/lib/hooks/use-alerts";
import { t } from "@/lib/i18n/es";

export default function AlertsPage() {
  const { data, isLoading, isError } = useAlertRules();
  const createRule = useCreateRule();
  const updateRule = useUpdateRule();
  const deleteRule = useDeleteRule();
  const [showForm, setShowForm] = useState(false);

  const rules = data?.content ?? [];
  const active = rules.filter((r) => r.status === "ACTIVE").length;

  function toggle(rule: AlertRule) {
    updateRule.mutate({ id: rule.id, input: { status: rule.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } });
  }
  function remove(rule: AlertRule) {
    if (window.confirm(`¿Eliminar la regla "${rule.name}"?`)) deleteRule.mutate(rule.id);
  }

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.alertsPage.title}
        description={t.alertsPage.description}
        actions={
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="press focus-ring h-11 px-s2 rounded-full bg-primary text-white font-bold text-base hover:opacity-85 transition-opacity inline-flex items-center gap-s1"
          >
            <Plus size={18} strokeWidth={2.25} />
            {t.alertsPage.createRule}
          </button>
        }
      />

      <div className="grid gap-s2 grid-cols-1 md:grid-cols-3">
        <SummaryCard icon={<CheckCircle size={20} />} cls="bg-success/10 text-success border-success/20"
          label="Reglas activas" value={`${active} de ${rules.length}`} />
        <SummaryCard icon={<AlertTriangle size={20} />} cls="bg-warning/10 text-warning border-warning/20"
          label="Reglas pausadas" value={String(rules.length - active)} />
        <SummaryCard icon={<AlertTriangle size={20} />} cls="bg-secondary text-primary border-primary/20"
          label="Total de reglas" value={String(rules.length)} />
      </div>

      {showForm && <CreateRuleForm onClose={() => setShowForm(false)} onCreate={(input) => {
        createRule.mutate(input, { onSuccess: () => setShowForm(false) });
      }} pending={createRule.isPending} error={createRule.isError} />}

      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <h6 className="text-base font-bold text-black-2">{t.alertsPage.rulesList}</h6>
        {isLoading ? (
          <p className="py-s2 text-sm text-gray-3">Cargando…</p>
        ) : isError ? (
          <p className="py-s2 text-sm text-error">No se pudieron cargar las reglas.</p>
        ) : rules.length === 0 ? (
          <p className="py-s2 text-sm text-gray-3">Aún no hay reglas de alerta. Crea la primera.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-5 border-t border-gray-5">
            {rules.map((rule) => (
              <li key={rule.id} className="py-s2 flex flex-col lg:flex-row lg:items-center justify-between gap-s2">
                <div className="flex items-start gap-s2">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border ${
                    rule.status === "ACTIVE" ? "bg-error/10 text-error border-error/25" : "bg-gray-5 text-gray-3 border-gray-4/30"
                  }`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-s2">
                      <span className="text-base font-bold text-black-2">{rule.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rule.status === "ACTIVE" ? "bg-error/10 text-error border-error/20" : "bg-gray-5 text-gray-3 border-gray-4/30"
                      }`}>
                        {rule.status === "ACTIVE" ? "ACTIVA" : "PAUSADA"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-2 font-normal mt-s1 leading-relaxed">
                      Si <strong>{rule.pestType ?? "cualquier plaga"}</strong> supera el{" "}
                      <strong>{(rule.severityThreshold * 100).toFixed(0)}%</strong> de severidad
                      {rule.zone ? <> en <strong>{rule.zone}</strong></> : null}.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-s2 gap-y-s1 text-xs text-gray-3 font-semibold mt-s2">
                      <span>Canal: {rule.channel}</span>
                      {rule.recipients && (<><span className="text-gray-4">•</span><span>Destinatarios: {rule.recipients}</span></>)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-s2 shrink-0 self-end lg:self-center">
                  <button type="button" onClick={() => toggle(rule)} disabled={updateRule.isPending}
                    className={`press focus-ring h-10 px-s2 rounded-full border text-xs font-bold flex items-center gap-s1 transition-colors disabled:opacity-50 ${
                      rule.status === "ACTIVE" ? "border-gray-5 text-gray-1 hover:bg-gray-5" : "border-primary/20 text-primary bg-secondary/35 hover:bg-secondary"
                    }`}>
                    {rule.status === "ACTIVE" ? <><Pause size={14} />Pausar</> : <><Play size={14} fill="currentColor" />Activar</>}
                  </button>
                  <button type="button" onClick={() => remove(rule)} disabled={deleteRule.isPending} aria-label="Eliminar regla"
                    className="press focus-ring h-10 w-10 rounded-full border border-gray-5 text-gray-3 hover:text-error hover:bg-error/5 flex items-center justify-center transition-colors disabled:opacity-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ icon, cls, label, value }: { icon: React.ReactNode; cls: string; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-5 p-s2 flex items-center gap-s2">
      <div className={`h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${cls}`}>{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-3 font-normal uppercase tracking-wider">{label}</span>
        <span className="text-xl font-bold text-black-2">{value}</span>
      </div>
    </div>
  );
}

function CreateRuleForm({ onClose, onCreate, pending, error }: {
  onClose: () => void;
  onCreate: (input: { name: string; pestType: string | null; severityThreshold: number; zone: string | null; recipients: string | null; status: string }) => void;
  pending: boolean;
  error: boolean;
}) {
  const [name, setName] = useState("");
  const [pestType, setPestType] = useState("");
  const [thresholdPct, setThresholdPct] = useState(50);
  const [zone, setZone] = useState("");
  const [recipients, setRecipients] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
      <div className="flex items-center justify-between">
        <h6 className="text-base font-bold text-black-2">Nueva regla de alerta</h6>
        <button type="button" onClick={onClose} className="press h-8 w-8 rounded-full hover:bg-gray-5 flex items-center justify-center text-gray-3"><X size={16} /></button>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); onCreate({ name, pestType: pestType || null, severityThreshold: thresholdPct / 100, zone: zone || null, recipients: recipients || null, status: "ACTIVE" }); }}
        className="grid grid-cols-1 md:grid-cols-2 gap-s2"
      >
        <Field label="Nombre"><input required value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="Roya severa sector norte" /></Field>
        <Field label="Plaga"><select value={pestType} onChange={(e) => setPestType(e.target.value)} className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary">{PEST_FILTER_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select></Field>
        <Field label={`Umbral de severidad: ${thresholdPct}%`}><input type="range" min={0} max={100} value={thresholdPct} onChange={(e) => setThresholdPct(Number(e.target.value))} className="w-full" /></Field>
        <Field label="Zona (opcional)"><input value={zone} onChange={(e) => setZone(e.target.value)} className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="Sector San Miguel" /></Field>
        <Field label="Destinatarios (correos, separados por coma)"><input value={recipients} onChange={(e) => setRecipients(e.target.value)} className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary" placeholder="agronomo@ayni.pe" /></Field>
        <div className="md:col-span-2 flex items-center gap-s2">
          <button type="submit" disabled={pending} className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-sm disabled:opacity-50">{pending ? "Creando…" : "Crear regla"}</button>
          {error && <span className="text-sm text-error">No se pudo crear (¿permisos de admin/agrónomo?).</span>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-s1">
      <span className="text-sm font-bold text-gray-2">{label}</span>
      {children}
    </div>
  );
}
