"use client";
import { cn } from "@/lib/utils";

export function TableSkeletonRows({
  rows,
  cols,
  className,
}: {
  rows: number;
  cols: number;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, never reordered
        <tr key={i} className="border-t border-gray-5">
          {Array.from({ length: cols }).map((_, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton cols, never reordered
            <td key={j} className="py-s2 px-s3">
              <div
                className={cn("h-4 rounded bg-gray-5 animate-pulse", className)}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
