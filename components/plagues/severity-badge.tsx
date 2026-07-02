import type { Severity } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<Severity, string> = {
  CRITICAL: "bg-error text-white",
  HIGH_RISK: "bg-severity-high text-white",
  MODERATE: "bg-warning text-warning-ink",
  LOW: "bg-secondary text-primary",
};

type SeverityBadgeProps = {
  severity: Severity;
  className?: string;
};

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-2xs font-bold whitespace-nowrap",
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {t.severity[severity]}
    </span>
  );
}
