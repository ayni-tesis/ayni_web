"use client";

import {
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ModalShell } from "@/components/ui/modal-shell";
import { StatCell, StatStrip } from "@/components/ui/stat-strip";
import {
  type AlertRule,
  type AlertRuleInput,
  PEST_FILTER_OPTIONS,
} from "@/lib/api/alerts";
import {
  useAlertRules,
  useCreateRule,
  useDeleteRule,
  useUpdateRule,
} from "@/lib/hooks/use-alerts";
import { toast } from "@/lib/hooks/use-toast";
import { t } from "@/lib/i18n/es";

export default function AlertsPage() {
  const { data, isLoading, isError } = useAlertRules();
  const createRule = useCreateRule();
  const updateRule = useUpdateRule();
  const deleteRule = useDeleteRule();
  const [showForm, setShowForm] = useState(false);
  const [deleteRuleTarget, setDeleteRuleTarget] = useState<AlertRule | null>(
    null,
  );

  const rules = data?.content ?? [];
  const active = rules.filter((r) => r.status === "ACTIVE").length;

  function toggle(rule: AlertRule) {
    const nextActive = rule.status !== "ACTIVE";
    updateRule.mutate(
      { id: rule.id, input: { status: nextActive ? "ACTIVE" : "PAUSED" } },
      {
        onSuccess: () => {
          toast({
            title: t.alertsPage.toasts.toggled(nextActive),
            tone: "success",
          });
        },
      },
    );
  }

  function remove(rule: AlertRule) {
    setDeleteRuleTarget(rule);
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

      <StatStrip className="grid-cols-1 md:grid-cols-3">
        <StatCell
          icon={CheckCircle}
          iconClass="text-success"
          label={t.alertsPage.stats.active}
          value={`${active} de ${rules.length}`}
        />
        <StatCell
          icon={Pause}
          label={t.alertsPage.stats.paused}
          value={String(rules.length - active)}
        />
        <StatCell
          icon={AlertTriangle}
          label={t.alertsPage.stats.total}
          value={String(rules.length)}
        />
      </StatStrip>

      {showForm && (
        <CreateRuleModal
          onClose={() => setShowForm(false)}
          onCreate={(input) => {
            createRule.mutate(input, {
              onSuccess: () => {
                setShowForm(false);
                toast({ title: t.alertsPage.toasts.created, tone: "success" });
              },
            });
          }}
          pending={createRule.isPending}
          error={createRule.isError}
        />
      )}

      <ConfirmDialog
        open={!!deleteRuleTarget}
        title={t.alertsPage.confirmDeleteTitle}
        body={t.alertsPage.confirmDeleteBody(deleteRuleTarget?.name ?? "")}
        confirmLabel={t.common.delete}
        tone="danger"
        onConfirm={() => {
          if (!deleteRuleTarget) return;
          deleteRule.mutate(deleteRuleTarget.id, {
            onSuccess: () => {
              setDeleteRuleTarget(null);
              toast({ title: t.alertsPage.toasts.deleted, tone: "success" });
            },
          });
        }}
        onCancel={() => setDeleteRuleTarget(null)}
        pending={deleteRule.isPending}
      />

      <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
        <h6 className="text-base font-bold text-black-2">
          {t.alertsPage.rulesList}
        </h6>
        {isLoading ? (
          <p className="py-s2 text-sm text-gray-3">{t.alertsPage.loading}</p>
        ) : isError ? (
          <p className="py-s2 text-sm text-error">{t.alertsPage.error}</p>
        ) : rules.length === 0 ? (
          <p className="py-s2 text-sm text-gray-3">{t.alertsPage.empty}</p>
        ) : (
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
                        ? "bg-error/10 text-error border-error/25"
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
                        className={`px-2.5 py-1 rounded-full text-2xs font-bold border ${
                          rule.status === "ACTIVE"
                            ? "bg-error/10 text-error border-error/20"
                            : "bg-gray-5 text-gray-3 border-gray-4/30"
                        }`}
                      >
                        {rule.status === "ACTIVE" ? "Activa" : "Pausada"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-2 font-normal mt-s1 leading-relaxed">
                      Si <strong>{rule.pestType ?? "cualquier plaga"}</strong>{" "}
                      supera el{" "}
                      <strong>
                        {(rule.severityThreshold * 100).toFixed(0)}%
                      </strong>{" "}
                      de severidad
                      {rule.zone ? (
                        <>
                          {" "}
                          en <strong>{rule.zone}</strong>
                        </>
                      ) : null}
                      .
                    </p>
                    <div className="flex flex-wrap items-center gap-x-s2 gap-y-s1 text-xs text-gray-3 font-semibold mt-s2">
                      <span>Canal: {rule.channel}</span>
                      {rule.recipients && (
                        <>
                          <span className="text-gray-4">•</span>
                          <span>Destinatarios: {rule.recipients}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-s2 shrink-0 self-end lg:self-center">
                  <button
                    type="button"
                    onClick={() => toggle(rule)}
                    disabled={updateRule.isPending}
                    className={`press focus-ring h-10 px-s2 rounded-full border text-xs font-bold flex items-center gap-s1 transition-colors disabled:opacity-50 ${
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
                    onClick={() => remove(rule)}
                    disabled={deleteRule.isPending}
                    aria-label="Eliminar regla"
                    className="press focus-ring h-10 w-10 rounded-full border border-gray-5 text-gray-3 hover:text-error hover:bg-error/5 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
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

function CreateRuleModal({
  onClose,
  onCreate,
  pending,
  error,
}: {
  onClose: () => void;
  onCreate: (input: AlertRuleInput) => void;
  pending: boolean;
  error: boolean;
}) {
  const [name, setName] = useState("");
  const [pestType, setPestType] = useState("");
  const [thresholdPct, setThresholdPct] = useState(50);
  const [zone, setZone] = useState("");
  const [recipients, setRecipients] = useState("");

  return (
    <ModalShell title={t.alertsPage.form.title} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCreate({
            name,
            pestType: pestType || null,
            severityThreshold: thresholdPct / 100,
            zone: zone || null,
            recipients: recipients || null,
            status: "ACTIVE",
          });
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-s2"
      >
        <Field label={t.alertsPage.form.name}>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
            placeholder={t.alertsPage.form.namePlaceholder}
          />
        </Field>
        <Field label={t.alertsPage.form.pest}>
          <select
            value={pestType}
            onChange={(e) => setPestType(e.target.value)}
            className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          >
            {PEST_FILTER_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t.alertsPage.form.threshold(thresholdPct)}>
          <input
            type="range"
            min={0}
            max={100}
            value={thresholdPct}
            onChange={(e) => setThresholdPct(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-2"
          />
        </Field>
        <Field label={t.alertsPage.form.zone}>
          <input
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
            placeholder={t.alertsPage.form.zonePlaceholder}
          />
        </Field>
        <Field label={t.alertsPage.form.recipients}>
          <input
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
            placeholder={t.alertsPage.form.recipientsPlaceholder}
          />
        </Field>
        <div className="md:col-span-2 flex items-center gap-s2">
          <button
            type="submit"
            disabled={pending}
            className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-sm disabled:opacity-50"
          >
            {pending ? t.alertsPage.form.creating : t.alertsPage.form.submit}
          </button>
          {error && (
            <span className="text-sm text-error">
              {t.alertsPage.form.error}
            </span>
          )}
        </div>
      </form>
    </ModalShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-s1">
      <span className="text-sm font-bold text-gray-2">{label}</span>
      {children}
    </div>
  );
}
