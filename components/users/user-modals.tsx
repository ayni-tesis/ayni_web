"use client";

import { X } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/ui/avatar";
import type { User, UserRole, UserStatus } from "@/lib/api/types";
import { ROLE_LABELS } from "@/lib/api/users";
import { formatRelativeTime } from "@/lib/format";
import { useCreateUser, useUpdateUser } from "@/lib/hooks/use-users";
import { t } from "@/lib/i18n/es";
import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";

const inputClass =
  "h-11 w-full rounded-xl border border-gray-5 bg-white px-4 text-base text-black-2 outline-none focus-ring placeholder:text-gray-3";
const labelClass = "text-sm font-bold text-black-2";

const ROLE_OPTIONS: UserRole[] = ["FARMER", "AGRONOMIST", "ADMIN"];
const STATUS_OPTIONS: UserStatus[] = ["ACTIVE", "INACTIVE"];

const f = t.users.form;

// ─── Shell reutilizable (portal + backdrop + Escape), igual patrón que ShortcutsOverlay ───

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black-2/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-h5 font-bold text-black-2 leading-none">
              {title}
            </h2>
            {subtitle ? (
              <p className="text-sm text-gray-2 mt-1">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="press focus-ring h-9 w-9 rounded-full hover:bg-gray-5 inline-flex items-center justify-center text-gray-2"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

function Field({
  htmlFor,
  label,
  error,
  hint,
  children,
}: {
  htmlFor: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      {children}
      {error ? (
        <span className="text-sm text-error">{error}</span>
      ) : hint ? (
        <span className="text-sm text-gray-2">{hint}</span>
      ) : null}
    </label>
  );
}

function FormFooter({
  onCancel,
  submitLabel,
  pending,
  pendingLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
  pending: boolean;
  pendingLabel: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 mt-2">
      <button
        type="button"
        onClick={onCancel}
        className="press focus-ring h-11 px-5 rounded-full border border-gray-5 text-gray-1 font-bold text-base hover:bg-gray-5 transition-colors"
      >
        {t.common.cancel}
      </button>
      <button
        type="submit"
        disabled={pending}
        className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-base hover:opacity-85 transition-opacity disabled:opacity-50 inline-flex items-center justify-center"
      >
        {pending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}

// ─── Crear usuario ───────────────────────────────────────────────────────────

export function CreateUserModal({ onClose }: { onClose: () => void }) {
  const createUser = useCreateUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("FARMER");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = f.required;
    if (!email.trim()) next.email = f.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      next.email = f.invalidEmail;
    if (!password) next.password = f.required;
    else if (password.length < 8) next.password = f.passwordTooShort;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    createUser.mutate(
      { email: email.trim(), fullName: fullName.trim(), password, role },
      { onSuccess: onClose },
    );
  };

  return (
    <ModalShell
      title={f.createTitle}
      subtitle={f.createSubtitle}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Field htmlFor="cu-fullName" label={f.fullName} error={errors.fullName}>
          <input
            id="cu-fullName"
            className={inputClass}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={f.fullNamePlaceholder}
          />
        </Field>
        <Field
          htmlFor="cu-email"
          label={f.email}
          error={errors.email}
          hint={f.emailHint}
        >
          <input
            id="cu-email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={f.emailPlaceholder}
          />
        </Field>
        <Field
          htmlFor="cu-password"
          label={f.password}
          error={errors.password}
          hint={f.passwordHint}
        >
          <input
            id="cu-password"
            type="text"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={f.passwordPlaceholder}
            autoComplete="new-password"
          />
        </Field>
        <Field htmlFor="cu-role" label={f.role}>
          <select
            id="cu-role"
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </Field>
        {createUser.isError ? (
          <p className="text-sm text-error">{f.createError}</p>
        ) : null}
        <FormFooter
          onCancel={onClose}
          submitLabel={f.submitCreate}
          pending={createUser.isPending}
          pendingLabel={f.creating}
        />
      </form>
    </ModalShell>
  );
}

// ─── Editar usuario (rol / estado) ───────────────────────────────────────────

export function EditUserModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  const updateUser = useUpdateUser();
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus>(user.status);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const input: { role?: UserRole; status?: UserStatus } = {};
    if (role !== user.role) input.role = role;
    if (status !== user.status) input.status = status;
    if (!input.role && !input.status) {
      onClose();
      return;
    }
    updateUser.mutate({ id: user.id, input }, { onSuccess: onClose });
  };

  return (
    <ModalShell title={f.editTitle} subtitle={f.editSubtitle} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-xl border border-gray-5 bg-gray-5/30 p-3">
          <Avatar fullName={user.fullName} src={user.avatarUrl} />
          <div className="min-w-0">
            <p className="text-base font-bold text-black-2 truncate">
              {user.fullName}
            </p>
            <p className="text-sm text-gray-2 truncate">{user.email}</p>
          </div>
        </div>
        <Field htmlFor="eu-role" label={f.role}>
          <select
            id="eu-role"
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field htmlFor="eu-status" label={f.status}>
          <select
            id="eu-status"
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as UserStatus)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {t.status[s]}
              </option>
            ))}
          </select>
        </Field>
        {updateUser.isError ? (
          <p className="text-sm text-error">{f.updateError}</p>
        ) : null}
        <FormFooter
          onCancel={onClose}
          submitLabel={f.submitEdit}
          pending={updateUser.isPending}
          pendingLabel={f.saving}
        />
      </form>
    </ModalShell>
  );
}

// ─── Ver perfil (solo lectura) ───────────────────────────────────────────────

function InfoCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-5 p-3">
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-3 mb-1.5">
        {label}
      </p>
      {children}
    </div>
  );
}

export function ViewUserModal({
  user,
  onClose,
}: {
  user: User;
  onClose: () => void;
}) {
  return (
    <ModalShell title={f.viewTitle} onClose={onClose}>
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar fullName={user.fullName} src={user.avatarUrl} size={56} />
          <div className="min-w-0">
            <p className="text-lg font-bold text-black-2 truncate">
              {user.fullName}
            </p>
            <p className="text-sm text-gray-2 truncate">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <InfoCell label={t.users.columns.role}>
            <RoleBadge role={user.role} />
          </InfoCell>
          <InfoCell label={t.users.columns.status}>
            <StatusBadge status={user.status} />
          </InfoCell>
          <InfoCell label={t.users.profile.community}>
            <span className="text-base text-black-2">
              {user.community || t.users.profile.noCommunity}
            </span>
          </InfoCell>
          <InfoCell label={t.users.profile.lastActivity}>
            <span className="text-base text-black-2">
              {formatRelativeTime(user.lastActivityAt)}
            </span>
          </InfoCell>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="press focus-ring h-11 px-5 rounded-full border border-gray-5 text-gray-1 font-bold text-base hover:bg-gray-5 transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
