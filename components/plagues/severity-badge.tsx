import type { Severity } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<Severity, string> = {
  CRITICAL: "bg-error text-white",
  HIGH_RISK: "bg-[#A02323] text-white",
  MODERATE: "bg-warning text-[#4D3D0C]",
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
        "inline-flex items-center h-7 rounded-full px-3 text-sm font-bold whitespace-nowrap",
        SEVERITY_STYLES[severity],
        className,
      )}
    >
      {t.severity[severity]}
    </span>
  );
}
