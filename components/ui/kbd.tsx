import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tecla visual estilo macOS keyboard hint.
 * Usar para señalizar atajos visibles en la UI (placeholder search, tooltips, overlay de ayuda).
 */
export function Kbd({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded border border-gray-4 bg-white text-2xs font-mono font-bold text-gray-2 leading-none shadow-[inset_0_-1px_0_var(--color-gray-5)]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
