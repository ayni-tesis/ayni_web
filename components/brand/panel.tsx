import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelProps = {
  label: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  labelTone?: "light" | "dark";
};

export function Panel({
  label,
  children,
  className,
  style,
  labelTone = "dark",
}: PanelProps) {
  const labelColor =
    labelTone === "light" ? "text-white/60" : "text-black-2/50";

  return (
    <div
      style={style}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 flex flex-col",
        className,
      )}
    >
      <div
        className={cn(
          "text-[10px] font-bold tracking-[0.25em] uppercase",
          labelColor,
        )}
      >
        {label}
      </div>
      <div className="flex-1 flex">{children}</div>
    </div>
  );
}
