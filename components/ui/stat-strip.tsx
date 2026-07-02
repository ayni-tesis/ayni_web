import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Franja de métricas: un solo panel con celdas divididas por hairlines
 * (gap-px sobre gray-5). Jerarquía por peso tipográfico, no por color;
 * el ícono lleva color de estado solo cuando es semántico.
 */
export function StatStrip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-px bg-gray-5 rounded-2xl border border-gray-5 overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

type StatCellProps = {
  icon: LucideIcon;
  iconClass?: string;
  label: string;
  value: string;
  hint?: string;
};

export function StatCell({
  icon: Icon,
  iconClass = "text-gray-3",
  label,
  value,
  hint,
}: StatCellProps) {
  return (
    <div className="bg-white p-s3 flex flex-col">
      <div className="flex items-center gap-2">
        <Icon size={16} className={iconClass} aria-hidden />
        <span className="text-sm font-normal text-gray-2">{label}</span>
      </div>
      <span className="text-4xl font-bold text-black-2 tabular-nums leading-none mt-s2">
        {value}
      </span>
      {hint && (
        <span className="text-xs font-normal text-gray-3 mt-s1">{hint}</span>
      )}
    </div>
  );
}
