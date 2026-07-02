"use client";

import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState } from "@/components/ui/error-state";
import { PanelSkeleton } from "@/components/ui/panel-skeleton";
import { RoleBadge } from "@/components/users/role-badge";
import type { UserRole } from "@/lib/api/types";
import { ROLE_LABELS } from "@/lib/api/users";
import {
  useAccount,
  useChangePassword,
  useUpdateProfile,
} from "@/lib/hooks/use-account";
import { toast } from "@/lib/hooks/use-toast";
import { t } from "@/lib/i18n/es";

export default function ConfiguracionPage() {
  const { data: account, isLoading, isError } = useAccount();

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.configuracionPage.title}
        description={t.configuracionPage.description}
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-s3">
          <PanelSkeleton rows={4} />
        </div>
      ) : isError || !account ? (
        <div className="bg-white rounded-2xl border border-gray-5">
          <ErrorState />
        </div>
      ) : (
        <div className="grid gap-s3 grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 flex flex-col gap-s3">
            <ProfileCard
              fullName={account.fullName}
              email={account.email}
              role={account.role}
            />
            <PasswordCard />
          </div>
          <div className="lg:col-span-5">
            <AccountStatusCard
              active={account.active}
              consentGiven={account.consentGiven}
              consentDate={account.consentDate}
              createdAt={account.createdAt}
              role={account.role}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileCard({
  fullName,
  email,
  role,
}: {
  fullName: string;
  email: string;
  role: string;
}) {
  const update = useUpdateProfile();
  const [name, setName] = useState(fullName);

  useEffect(() => setName(fullName), [fullName]);

  const dirty = name.trim() !== fullName && name.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    update.mutate(name.trim(), {
      onSuccess: () =>
        toast({
          title: t.configuracionPage.toasts.profileSaved,
          tone: "success",
        }),
      onError: () =>
        toast({
          title: t.configuracionPage.toasts.profileError,
          tone: "error",
        }),
    });
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && dirty) {
        e.preventDefault();
        update.mutate(name.trim(), {
          onSuccess: () =>
            toast({
              title: t.configuracionPage.toasts.profileSaved,
              tone: "success",
            }),
          onError: () =>
            toast({
              title: t.configuracionPage.toasts.profileError,
              tone: "error",
            }),
        });
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [dirty, name, update]);

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2"
    >
      <div className="flex items-center gap-s2 border-b border-gray-5 pb-s2">
        <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
          <UserIcon size={20} />
        </div>
        <div>
          <h6 className="text-base font-bold text-black-2">
            {t.configuracionPage.profileCard.title}
          </h6>
          <p className="text-xs text-gray-3">
            {t.configuracionPage.profileCard.subtitle}
          </p>
        </div>
      </div>

      <Field label="Nombre completo">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          maxLength={255}
          className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          placeholder="Tu nombre"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        <Field label={t.configuracionPage.profileCard.emailLabel}>
          <div className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/30 text-sm font-semibold text-gray-2 flex items-center gap-s1">
            <Mail size={15} className="text-gray-3" />
            <span className="truncate">{email}</span>
          </div>
        </Field>
        <Field label={t.configuracionPage.profileCard.roleLabel}>
          <div className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/30 flex items-center">
            <RoleBadge role={role as UserRole} />
          </div>
        </Field>
      </div>

      <div className="flex items-center gap-s2 border-t border-gray-5 pt-s2 mt-s1">
        <button
          type="submit"
          disabled={!dirty || update.isPending}
          className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-s1 disabled:opacity-50 hover:opacity-85 transition-opacity"
        >
          <Save size={16} />
          {update.isPending
            ? t.configuracionPage.profileCard.saving
            : t.configuracionPage.profileCard.save}
        </button>
        {update.isError && (
          <span className="text-sm text-error">
            {t.configuracionPage.toasts.profileError}
          </span>
        )}
      </div>
    </form>
  );
}

function PasswordCard() {
  const change = useChangePassword();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (next.length < 8) {
      setLocalError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (next !== confirm) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }
    change.mutate(
      { currentPassword: current, newPassword: next },
      {
        onSuccess: () => {
          toast({
            title: t.configuracionPage.toasts.passwordChanged,
            tone: "success",
          });
          setCurrent("");
          setNext("");
          setConfirm("");
        },
        onError: () => {
          toast({
            title: t.configuracionPage.toasts.passwordError,
            tone: "error",
          });
        },
      },
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2"
    >
      <div className="flex items-center gap-s2 border-b border-gray-5 pb-s2">
        <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
          <Lock size={20} />
        </div>
        <div>
          <h6 className="text-base font-bold text-black-2">
            {t.configuracionPage.passwordCard.title}
          </h6>
          <p className="text-xs text-gray-3">
            {t.configuracionPage.passwordCard.subtitle}
          </p>
        </div>
      </div>

      <Field label={t.configuracionPage.passwordCard.currentLabel}>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            className="h-11 w-full px-4 pr-12 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            aria-label={
              showCurrent
                ? t.configuracionPage.passwordCard.hideCurrent
                : t.configuracionPage.passwordCard.showCurrent
            }
            className="press focus-ring absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
          >
            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        <Field label={t.configuracionPage.passwordCard.newLabel}>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              className="h-11 w-full px-4 pr-12 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              aria-label={
                showNew
                  ? t.configuracionPage.passwordCard.hideNew
                  : t.configuracionPage.passwordCard.showNew
              }
              className="press focus-ring absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
        <Field label={t.configuracionPage.passwordCard.confirmLabel}>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="h-11 w-full px-4 pr-12 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={
                showConfirm
                  ? t.configuracionPage.passwordCard.hideConfirm
                  : t.configuracionPage.passwordCard.showConfirm
              }
              className="press focus-ring absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </Field>
      </div>

      <div className="flex items-center gap-s2 border-t border-gray-5 pt-s2 mt-s1">
        <button
          type="submit"
          disabled={!current || !next || !confirm || change.isPending}
          className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-s1 disabled:opacity-50 hover:opacity-85 transition-opacity"
        >
          <Lock size={16} />
          {change.isPending
            ? t.configuracionPage.passwordCard.changing
            : t.configuracionPage.passwordCard.change}
        </button>
        {(localError || change.isError) && (
          <span className="text-sm text-error">
            {localError ?? t.configuracionPage.toasts.passwordError}
          </span>
        )}
      </div>
    </form>
  );
}

function AccountStatusCard({
  active,
  consentGiven,
  consentDate,
  createdAt,
  role,
}: {
  active: boolean;
  consentGiven: boolean;
  consentDate: string | null;
  createdAt: string | null;
  role: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
      <div className="flex items-center gap-s2 border-b border-gray-5 pb-s2">
        <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
          <ShieldCheck size={20} />
        </div>
        <h6 className="text-base font-bold text-black-2">
          {t.configuracionPage.statusCard.title}
        </h6>
      </div>

      <StatusRow
        icon={
          active ? (
            <CheckCircle2 size={18} className="text-success" />
          ) : (
            <XCircle size={18} className="text-error" />
          )
        }
        label={t.configuracionPage.statusCard.statusLabel}
        value={
          active
            ? t.configuracionPage.statusCard.statusActive
            : t.configuracionPage.statusCard.statusInactive
        }
        valueClass={active ? "text-success" : "text-error"}
      />
      <StatusRow
        icon={
          consentGiven ? (
            <BadgeCheck size={18} className="text-success" />
          ) : (
            <XCircle size={18} className="text-warning" />
          )
        }
        label={t.configuracionPage.statusCard.consentLabel}
        value={
          consentGiven
            ? consentDate
              ? t.configuracionPage.statusCard.consentGrantedDate(
                  new Date(consentDate).toLocaleDateString("es-PE"),
                )
              : t.configuracionPage.statusCard.consentGranted
            : t.configuracionPage.statusCard.consentNotGranted
        }
        valueClass={consentGiven ? "text-success" : "text-warning"}
      />
      <StatusRow
        icon={<BadgeCheck size={18} className="text-gray-3" />}
        label={t.configuracionPage.statusCard.roleLabel}
        value={ROLE_LABELS[role as UserRole] ?? role}
        valueClass="text-black-2"
      />
      <StatusRow
        icon={<CalendarDays size={18} className="text-gray-3" />}
        label={t.configuracionPage.statusCard.memberSince}
        value={
          createdAt ? new Date(createdAt).toLocaleDateString("es-PE") : "—"
        }
        valueClass="text-black-2"
      />

      <p className="text-xs text-gray-3 leading-relaxed border-t border-gray-5 pt-s2 mt-s1">
        {t.configuracionPage.statusCard.adminNote}
      </p>
    </div>
  );
}

function StatusRow({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass: string;
}) {
  return (
    <div className="flex items-start gap-s2 py-s1">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-gray-3">{label}</span>
        <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
      </div>
    </div>
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
