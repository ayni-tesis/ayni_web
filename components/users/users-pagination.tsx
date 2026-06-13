"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

type UsersPaginationProps = {
  page: number; // 0-indexed
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPageWindow(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i);
  }
  const pages: Array<number | "ellipsis"> = [0];
  const start = Math.max(1, current - 1);
  const end = Math.min(total - 2, current + 1);

  if (start > 1) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 2) pages.push("ellipsis");

  pages.push(total - 1);
  return pages;
}

export function UsersPagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
}: UsersPaginationProps) {
  const from = totalElements === 0 ? 0 : page * size + 1;
  const to = Math.min(totalElements, (page + 1) * size);
  const window = buildPageWindow(page, totalPages);

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap px-6 py-4">
      <p className="text-base text-gray-2 tabular-nums">
        {t.users.pagination.summary(from, to, totalElements)}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label={t.users.pagination.prev}
          className="press focus-ring h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gray-5 text-gray-1 hover:bg-gray-5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {window.map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="h-10 px-2 inline-flex items-center text-gray-2"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                "press focus-ring h-10 min-w-10 px-3 rounded-xl text-base font-bold tabular-nums transition-colors",
                item === page
                  ? "bg-secondary border border-primary text-primary"
                  : "border border-gray-5 text-gray-1 hover:bg-gray-5",
              )}
            >
              {item + 1}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label={t.users.pagination.next}
          className="press focus-ring h-10 w-10 inline-flex items-center justify-center rounded-xl border border-gray-5 text-gray-1 hover:bg-gray-5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
