"use client";

import { Bug, Keyboard, Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { PlagueCard } from "@/components/plagues/plague-card";
import { PlagueCardSkeleton } from "@/components/plagues/plague-card-skeleton";
import { SeverityFilter } from "@/components/plagues/severity-filter";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  type ShortcutGroup,
  ShortcutsOverlay,
} from "@/components/ui/shortcuts-overlay";
import { TopProgressBar } from "@/components/ui/top-progress-bar";
import type { Plague, Severity } from "@/lib/api/types";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";
import { usePlagues } from "@/lib/hooks/use-plagues";
import { t } from "@/lib/i18n/es";

const PAGE_SIZE = 9;
const SKELETON_COUNT = 6;

export default function CatalogPage() {
  const [severities, setSeverities] = useState<Severity[]>([]);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } = usePlagues({
    page: 0,
    size: PAGE_SIZE,
    severities,
  });

  const handleEdit = useCallback((plague: Plague) => {
    // TODO: abrir editor cuando exista PATCH /api/diagnoses/plagues/:id
    console.info("edit plague", plague.id);
  }, []);

  const isFiltered = severities.length > 0;
  const plagues = data?.content ?? [];
  const isEmpty = !isLoading && !isError && plagues.length === 0;

  useHotkeys(
    useMemo(() => [{ key: "?", handler: () => setShortcutsOpen(true) }], []),
  );

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: t.catalog.title,
      items: [{ keys: ["?"], label: t.shortcuts.showHelp }],
    },
  ];

  return (
    <div>
      <PageHeader
        title={t.catalog.title}
        description={t.catalog.description}
        actions={
          <>
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              aria-label={t.shortcuts.showHelp}
              className="press focus-ring h-11 w-11 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 inline-flex items-center justify-center transition-colors"
            >
              <Keyboard size={18} />
            </button>
            <SeverityFilter value={severities} onChange={setSeverities} />
            <button
              type="button"
              className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-base hover:opacity-85 transition-opacity inline-flex items-center gap-2"
            >
              <Plus size={18} strokeWidth={2.25} />
              {t.catalog.addPlague}
            </button>
          </>
        }
      />

      <div className="relative">
        <TopProgressBar visible={isFetching && !isLoading} />

        {isError ? (
          <div className="bg-white rounded-2xl border border-gray-5">
            <ErrorState onRetry={() => refetch()} retrying={isFetching} />
          </div>
        ) : isEmpty ? (
          <div className="bg-white rounded-2xl border border-gray-5">
            <EmptyState
              icon={Bug}
              title={
                isFiltered
                  ? t.catalog.filteredEmpty.title
                  : t.catalog.emptyState.title
              }
              body={
                isFiltered
                  ? t.catalog.filteredEmpty.body
                  : t.catalog.emptyState.body
              }
              action={
                isFiltered ? (
                  <button
                    type="button"
                    onClick={() => setSeverities([])}
                    className="press focus-ring h-10 px-4 rounded-full border border-gray-5 text-sm font-bold text-gray-1 hover:bg-gray-5 inline-flex items-center gap-2 transition-colors"
                  >
                    <X size={14} />
                    {t.catalog.filteredEmpty.cta}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="press focus-ring h-10 px-5 rounded-full bg-primary text-white text-sm font-bold inline-flex items-center gap-2 hover:opacity-85 transition-opacity"
                  >
                    <Plus size={16} strokeWidth={2.25} />
                    {t.catalog.emptyState.cta}
                  </button>
                )
              }
            />
          </div>
        ) : (
          <>
            <ul className="grid gap-s2 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {isLoading
                ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list, never reordered
                    <li key={i}>
                      <PlagueCardSkeleton />
                    </li>
                  ))
                : plagues.map((plague) => (
                    <li key={plague.id}>
                      <PlagueCard plague={plague} onEdit={handleEdit} />
                    </li>
                  ))}
            </ul>
            {data && data.totalElements > plagues.length && (
              <p className="py-s2 text-sm text-gray-3 text-center">
                Mostrando {plagues.length} de {data.totalElements} plagas.
              </p>
            )}
          </>
        )}
      </div>

      <ShortcutsOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        groups={shortcutGroups}
      />
    </div>
  );
}
