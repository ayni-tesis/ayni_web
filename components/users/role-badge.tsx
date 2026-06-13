import type { LucideIcon } from "lucide-react";
import { FlaskConical, ShieldCheck, Tractor } from "lucide-react";
import type { UserRole } from "@/lib/api/types";
import { ROLE_LABELS } from "@/lib/api/users";

type RoleStyle = {
  icon: LucideIcon;
  bg: string;
  text: string;
};

const ROLE_STYLES: Record<UserRole, RoleStyle> = {
  FARMER: {
    icon: Tractor,
    bg: "bg-secondary",
    text: "text-primary",
  },
  AGRONOMIST: {
    icon: FlaskConical,
    bg: "bg-[#E8F1FF]",
    text: "text-[#3B6FE0]",
  },
  ADMIN: {
    icon: ShieldCheck,
    bg: "bg-black-2",
    text: "text-white",
  },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const style = ROLE_STYLES[role];
  const Icon = style.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-7 rounded-full px-3 text-sm font-bold ${style.bg} ${style.text}`}
    >
      <Icon size={14} strokeWidth={2.25} />
      {ROLE_LABELS[role]}
    </span>
  );
}
