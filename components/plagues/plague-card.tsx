"use client";

import { Pencil } from "lucide-react";
import type { Plague } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";
import { PlaguePlaceholderArt } from "./placeholder-art";
import { PlagueTag } from "./plague-tag";
import { SeverityBadge } from "./severity-badge";

type PlagueCardProps = {
  plague: Plague;
  onEdit?: (plague: Plague) => void;
};

export function PlagueCard({ plague, onEdit }: PlagueCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-5 overflow-hidden transition-colors hover:border-primary/40">
      <div className="relative aspect-[4/3] bg-gray-5">
        {plague.imageUrl ? (
          // biome-ignore lint/performance/noImgElement: foto servida desde Azure Blob, configuración Next/Image pendiente
          <img
            src={plague.imageUrl}
            alt={plague.commonName}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <PlaguePlaceholderArt />
        )}

        <SeverityBadge
          severity={plague.severity}
          className="absolute top-3 right-3 shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
        />
      </div>

      <div className="flex-1 flex flex-col gap-3 p-5">
        <header>
          <h3 className="text-h6 font-bold text-black-2 text-balance">
            {plague.commonName}
          </h3>
          <p className="text-sm italic text-gray-2 mt-0.5">
            {plague.scientificName}
          </p>
        </header>

        <p className="text-sm text-gray-1 leading-relaxed line-clamp-3 text-pretty">
          {plague.description}
        </p>

        <p className="text-xs text-gray-3 font-bold tracking-[0.05em]">
          {t.catalog.estimatedLoss(plague.estimatedLossPercent)}
        </p>

        <footer className="mt-auto pt-3 border-t border-gray-5 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {plague.tags.map((tag) => (
              <PlagueTag key={tag} kind={tag} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onEdit?.(plague)}
            aria-label={`${t.catalog.cardActions.edit} ${plague.commonName}`}
            className="press focus-ring h-8 w-8 rounded-full text-gray-2 hover:text-primary hover:bg-secondary inline-flex items-center justify-center shrink-0 transition-colors"
          >
            <Pencil size={14} />
          </button>
        </footer>
      </div>
    </article>
  );
}
