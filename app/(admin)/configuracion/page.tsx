"use client";

import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User as UserIcon,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ROLE_LABELS } from "@/lib/api/users";
import type { UserRole } from "@/lib/api/types";
import { useAccount, useChangePassword, useUpdateProfile } from "@/lib/hooks/use-account";

export default function ConfiguracionPage() {
  const { data: account, isLoading, isError } = useAccount();

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title="Configuración"
        description="Gestiona tu perfil y la seguridad de tu cuenta."
      />

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-gray-3">
          Cargando tu perfil…
        </div>
      ) : isError || !account ? (
        <div className="bg-white rounded-2xl border border-gray-5 p-12 text-center text-error">
          No se pudo cargar tu perfil.
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

function ProfileCard({ fullName, email, role }: { fullName: string; email: string; role: string }) {
  const update = useUpdateProfile();
  const [name, setName] = useState(fullName);
  const [done, setDone] = useState(false);

  useEffect(() => setName(fullName), [fullName]);

  const dirty = name.trim() !== fullName && name.trim().length > 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
    update.mutate(name.trim(), { onSuccess: () => setDone(true) });
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
      <div className="flex items-center gap-s2 border-b border-gray-5 pb-s2">
        <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
          <UserIcon size={20} />
        </div>
        <div>
          <h6 className="text-base font-bold text-black-2">Datos personales</h6>
          <p className="text-xs text-gray-3">Tu nombre visible en el panel.</p>
        </div>
      </div>

      <Field label="Nombre completo">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setDone(false);
          }}
          maxLength={255}
          className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          placeholder="Tu nombre"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        <Field label="Correo electrónico (no editable)">
          <div className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/30 text-sm font-semibold text-gray-2 flex items-center gap-s1">
            <Mail size={15} className="text-gray-3" />
            <span className="truncate">{email}</span>
          </div>
        </Field>
        <Field label="Rol (asignado por un administrador)">
          <div className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/30 text-sm font-bold text-primary flex items-center">
            {ROLE_LABELS[role as UserRole] ?? role}
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
          {update.isPending ? "Guardando…" : "Guardar cambios"}
        </button>
        {done && (
          <span className="text-sm font-bold text-success flex items-center gap-s1">
            <CheckCircle2 size={16} /> Perfil actualizado
          </span>
        )}
        {update.isError && <span className="text-sm text-error">No se pudo guardar.</span>}
      </div>
    </form>
  );
}

function PasswordCard() {
  const change = useChangePassword();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(false);
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
          setDone(true);
          setCurrent("");
          setNext("");
          setConfirm("");
        },
      },
    );
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
      <div className="flex items-center gap-s2 border-b border-gray-5 pb-s2">
        <div className="h-10 w-10 rounded-xl bg-secondary text-primary flex items-center justify-center">
          <Lock size={20} />
        </div>
        <div>
          <h6 className="text-base font-bold text-black-2">Seguridad</h6>
          <p className="text-xs text-gray-3">Cambia tu contraseña.</p>
        </div>
      </div>

      <Field label="Contraseña actual">
        <input
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-s2">
        <Field label="Nueva contraseña">
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
        <Field label="Confirmar nueva contraseña">
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            className="h-11 w-full px-4 rounded-xl border border-gray-5 bg-gray-5/50 text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
      </div>

      <div className="flex items-center gap-s2 border-t border-gray-5 pt-s2 mt-s1">
        <button
          type="submit"
          disabled={!current || !next || !confirm || change.isPending}
          className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-s1 disabled:opacity-50 hover:opacity-85 transition-opacity"
        >
          <Lock size={16} />
          {change.isPending ? "Actualizando…" : "Cambiar contraseña"}
        </button>
        {done && (
          <span className="text-sm font-bold text-success flex items-center gap-s1">
            <CheckCircle2 size={16} /> Contraseña actualizada
          </span>
        )}
        {(localError || change.isError) && (
          <span className="text-sm text-error">
            {localError ?? "No se pudo cambiar (¿contraseña actual incorrecta?)."}
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
        <h6 className="text-base font-bold text-black-2">Estado de la cuenta</h6>
      </div>

      <StatusRow
        icon={active ? <CheckCircle2 size={18} className="text-success" /> : <XCircle size={18} className="text-error" />}
        label="Estado"
        value={active ? "Activa" : "Inactiva"}
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
        label="Consentimiento de datos (Ley 29733)"
        value={
          consentGiven
            ? consentDate
              ? `Otorgado el ${new Date(consentDate).toLocaleDateString("es-PE")}`
              : "Otorgado"
            : "No otorgado"
        }
        valueClass={consentGiven ? "text-success" : "text-warning"}
      />
      <StatusRow
        icon={<BadgeCheck size={18} className="text-primary" />}
        label="Rol"
        value={ROLE_LABELS[role as UserRole] ?? role}
        valueClass="text-primary"
      />
      <StatusRow
        icon={<CalendarDays size={18} className="text-gray-3" />}
        label="Miembro desde"
        value={createdAt ? new Date(createdAt).toLocaleDateString("es-PE") : "—"}
        valueClass="text-black-2"
      />

      <p className="text-xs text-gray-3 leading-relaxed border-t border-gray-5 pt-s2 mt-s1">
        El estado y el rol de la cuenta los gestiona un administrador. No existe un paso
        adicional de verificación por correo en esta versión.
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-s1">
      <span className="text-sm font-bold text-gray-2">{label}</span>
      {children}
    </div>
  );
}
