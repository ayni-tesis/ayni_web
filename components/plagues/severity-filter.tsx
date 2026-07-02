"use client";

import { Check, ListFilter, X } from "lucide-react";
import { Popover } from "@/components/ui/popover";
import { SEVERITY_ORDER } from "@/lib/api/plagues";
import type { Severity } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

const SEVERITY_DOTS: Record<Severity, string> = {
  CRITICAL: "bg-error",
  HIGH_RISK: "bg-severity-high",
  MODERATE: "bg-warning",
  LOW: "bg-primary",
};

type SeverityFilterProps = {
  value: Severity[];
  onChange: (next: Severity[]) => void;
};

export function SeverityFilter({ value, onChange }: SeverityFilterProps) {
  const isFiltered = value.length > 0;

  const toggle = (severity: Severity) => {
    if (value.includes(severity)) {
      onChange(value.filter((s) => s !== severity));
    } else {
      onChange([...value, severity]);
    }
  };

  const clear = () => onChange([]);

  return (
    <Popover
      align="end"
      minWidth={260}
      trigger={
        <button
          type="button"
          className={cn(
            "press focus-ring h-11 px-4 inline-flex items-center gap-2 rounded-xl border text-base transition-colors",
            isFiltered
              ? "border-primary bg-secondary text-primary font-bold"
              : "border-gray-5 text-gray-1 hover:bg-gray-5",
          )}
        >
          <ListFilter size={18} />
          <span>{t.catalog.filterBySeverity}</span>
          {isFiltered && (
            <span
              aria-label={`${value.length} filtros activos`}
              className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-white text-xs font-bold tabular-nums"
            >
              {value.length}
            </span>
          )}
        </button>
      }
    >
      {(close) => (
        <div className="p-1.5 flex flex-col">
          <ul aria-multiselectable className="flex flex-col">
            {SEVERITY_ORDER.map((severity) => {
              const selected = value.includes(severity);
              return (
                <li key={severity}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => toggle(severity)}
                    className="press w-full h-10 px-3 rounded-lg flex items-center gap-3 text-sm font-bold text-black-2 hover:bg-gray-5 transition-colors"
                  >
                    <span
                      className={cn(
                        "h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                        selected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-4",
                      )}
                    >
                      {selected && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        SEVERITY_DOTS[severity],
                      )}
                    />
                    <span>{t.severity[severity]}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {isFiltered && (
            <>
              <div className="h-px bg-gray-5 my-1" />
              <button
                type="button"
                onClick={() => {
                  clear();
                  close();
                }}
                className="press w-full h-10 px-3 rounded-lg flex items-center gap-2 text-sm font-bold text-gray-2 hover:bg-gray-5 transition-colors"
              >
                <X size={14} />
                {t.catalog.clearFilter}
              </button>
            </>
          )}
        </div>
      )}
    </Popover>
  );
}
