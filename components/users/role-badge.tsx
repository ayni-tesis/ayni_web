import type { LucideIcon } from "lucide-react";
import { FlaskConical, ShieldCheck, Tractor } from "lucide-react";
import type { UserRole } from "@/lib/api/types";
import { ROLE_LABELS } from "@/lib/api/users";

type RoleStyle = {
  icon: LucideIcon;
  bg: string;
  text: string;
  border: string;
};

const ROLE_STYLES: Record<UserRole, RoleStyle> = {
  FARMER: {
    icon: Tractor,
    bg: "bg-secondary",
    text: "text-primary",
    border: "border border-primary/20",
  },
  AGRONOMIST: {
    icon: FlaskConical,
    bg: "bg-agronomist-soft",
    text: "text-agronomist",
    border: "border border-agronomist/20",
  },
  ADMIN: {
    icon: ShieldCheck,
    bg: "bg-black-2",
    text: "text-white",
    border: "border border-white/15",
  },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const style = ROLE_STYLES[role];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-bold ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon size={14} strokeWidth={2.25} />
      {ROLE_LABELS[role]}
    </span>
  );
}
