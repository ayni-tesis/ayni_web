import type { UserStatus } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";

const STATUS_STYLES: Record<
  UserStatus,
  { bg: string; text: string; dot: string; border: string }
> = {
  ACTIVE: {
    bg: "bg-secondary",
    text: "text-primary",
    dot: "bg-primary",
    border: "border border-primary/20",
  },
  INACTIVE: {
    bg: "bg-gray-5",
    text: "text-gray-2",
    dot: "bg-gray-3",
    border: "border border-gray-4/30",
  },
};

export function StatusBadge({ status }: { status: UserStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-bold ${style.bg} ${style.text} ${style.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {t.status[status]}
    </span>
  );
}
