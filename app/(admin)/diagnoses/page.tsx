"use client";

import {
  Download,
  Image as ImageIcon,
  ImageOff,
  Keyboard,
  List,
  Map as MapIcon,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader } from "@/components/admin/page-header";
import {
  type ShortcutGroup,
  ShortcutsOverlay,
} from "@/components/ui/shortcuts-overlay";
import { TableErrorState } from "@/components/ui/table-error-state";
import { TableSkeletonRows } from "@/components/ui/table-skeleton";
import {
  type AdminDiagnosis,
  diagnosesService,
  PEST_OPTIONS,
} from "@/lib/api/diagnoses";
import { useDiagnoses, useZoneStats } from "@/lib/hooks/use-diagnoses";
import { useDiagnosisDetail } from "@/lib/hooks/use-diagnosis-detail";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";
import { toast } from "@/lib/hooks/use-toast";
import { t } from "@/lib/i18n/es";

function statusBadge(status: AdminDiagnosis["status"]) {
  const map = {
    CONFIRMED: {
      label: "Validado",
      cls: "bg-success/10 text-success border-success/20",
    },
    REJECTED: {
      label: "Rechazado",
      cls: "bg-error/10 text-error border-error/20",
    },
    PENDING: {
      label: "Pendiente",
      cls: "bg-warning/10 text-warning-ink border-warning/20",
    },
  } as const;
  return map[status] ?? map.PENDING;
}

function pct(v: number | null): string {
  return v == null ? "—" : `${(v * 100).toFixed(0)}%`;
}

export default function DiagnosesPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [pest, setPest] = useState("ALL");
  const [preview, setPreview] = useState<AdminDiagnosis | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useDiagnoses({
    pest,
    page: 0,
    size: 50,
  });
  const { data: zones, isLoading: zonesLoading } = useZoneStats();

  const rows = useMemo(() => {
    const all = data?.content ?? [];
    if (!searchTerm.trim()) return all;
    const q = searchTerm.toLowerCase();
    return all.filter(
      (d) =>
        d.pestName.toLowerCase().includes(q) ||
        d.farmerLabel.toLowerCase().includes(q),
    );
  }, [data, searchTerm]);

  async function handleExport() {
    try {
      await diagnosesService.exportCsv({ pest });
    } catch {
      toast({ title: t.diagnosesPage.toasts.exportError, tone: "error" });
    }
  }

  useHotkeys(
    useMemo(
      () => [
        {
          key: "/",
          handler: (e) => {
            e.preventDefault();
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          },
        },
        { key: "?", handler: () => setShortcutsOpen(true) },
      ],
      [],
    ),
  );

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: t.diagnosesPage.title,
      items: [
        { keys: ["/"], label: t.shortcuts.focusSearch },
        { keys: ["?"], label: t.shortcuts.showHelp },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-s3">
      <PageHeader
        title={t.diagnosesPage.title}
        description={t.diagnosesPage.description}
        actions={
          <div className="flex items-center gap-s2">
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              aria-label={t.shortcuts.showHelp}
              className="press focus-ring h-11 w-11 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 inline-flex items-center justify-center transition-colors"
            >
              <Keyboard size={18} />
            </button>
            <div className="bg-white rounded-full border border-gray-5 p-s1 flex">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`press h-9 px-s2 rounded-full text-sm font-bold flex items-center gap-s1 transition-colors ${viewMode === "list" ? "bg-secondary text-primary" : "text-gray-2 hover:bg-gray-5"}`}
              >
                <List size={16} />
                {t.diagnosesPage.tabList}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`press h-9 px-s2 rounded-full text-sm font-bold flex items-center gap-s1 transition-colors ${viewMode === "map" ? "bg-secondary text-primary" : "text-gray-2 hover:bg-gray-5"}`}
              >
                <MapIcon size={16} />
                {t.diagnosesPage.tabZone}
              </button>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="press focus-ring h-11 px-s2 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 font-bold text-base flex items-center gap-s1 transition-colors"
            >
              <Download size={18} />
              {t.diagnosesPage.exportData}
            </button>
          </div>
        }
      />

      {viewMode === "list" ? (
        <div className="bg-white rounded-2xl border border-gray-5 overflow-hidden">
          <div className="p-s2 flex flex-col md:flex-row gap-s2 items-center justify-between border-b border-gray-5">
            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-3"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t.diagnosesPage.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-11 pr-4 bg-gray-5 rounded-full text-black-2 font-bold text-base placeholder:text-gray-2 placeholder:font-normal border-none outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
            </div>
            <div className="flex flex-wrap items-center gap-s2 w-full md:w-auto justify-end">
              <select
                value={pest}
                onChange={(e) => setPest(e.target.value)}
                className="press h-11 px-s2 rounded-full border border-gray-5 bg-white text-gray-2 text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              >
                {PEST_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-5/50 border-b border-gray-5 text-gray-2 text-2xs font-bold uppercase tracking-wider">
                  <th scope="col" className="py-s2 px-s3">
                    Diagnóstico
                  </th>
                  <th scope="col" className="py-s2 px-s3">
                    Caficultor
                  </th>
                  <th scope="col" className="py-s2 px-s3">
                    Severidad
                  </th>
                  <th scope="col" className="py-s2 px-s3">
                    Ubicación
                  </th>
                  <th scope="col" className="py-s2 px-s3">
                    Fecha
                  </th>
                  <th scope="col" className="py-s2 px-s3">
                    Estado
                  </th>
                  <th scope="col" className="py-s2 px-s3 text-right">
                    Imagen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-5 text-black-2">
                {isLoading ? (
                  <TableSkeletonRows rows={10} cols={7} />
                ) : isError ? (
                  <TableErrorState
                    colSpan={7}
                    onRetry={() => refetch()}
                    retrying={isFetching}
                  />
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-s3 px-s3 text-center text-gray-3"
                    >
                      {t.diagnosesPage.emptyHistory}
                    </td>
                  </tr>
                ) : (
                  rows.map((d) => {
                    const badge = statusBadge(d.status);
                    const sev = d.severity ?? 0;
                    return (
                      <tr
                        key={d.id}
                        className="hover:bg-cream-2/60 transition-colors"
                      >
                        <td className="py-s2 px-s3">
                          <div className="flex flex-col">
                            <span className="font-bold">{d.pestName}</span>
                            <span className="text-xs text-gray-3 italic font-normal mt-s1">
                              {d.scientificName}
                            </span>
                          </div>
                        </td>
                        <td className="py-s2 px-s3 text-sm font-semibold text-black-2">
                          {d.farmerLabel}
                        </td>
                        <td className="py-s2 px-s3">
                          <div className="flex items-center gap-s1">
                            <div className="w-16 bg-gray-5 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${sev === 0 ? "bg-success" : sev > 0.7 ? "bg-error" : "bg-warning"}`}
                                style={{ width: `${sev * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-gray-1">
                              {pct(d.severity)}
                            </span>
                          </div>
                        </td>
                        <td className="py-s2 px-s3 text-sm text-gray-2 font-normal">
                          <span className="flex items-center gap-s1">
                            <MapPin size={14} className="text-gray-3" />
                            {d.latitude && d.longitude
                              ? `${d.latitude}, ${d.longitude}`
                              : "—"}
                          </span>
                        </td>
                        <td className="py-s2 px-s3 text-sm text-gray-3 font-normal">
                          {d.capturedAt
                            ? new Date(d.capturedAt).toLocaleString("es-PE")
                            : "—"}
                        </td>
                        <td className="py-s2 px-s3">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-2xs font-bold border ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-s2 px-s3 text-right">
                          <button
                            type="button"
                            onClick={() => setPreview(d)}
                            className="press focus-ring h-9 px-3 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 text-xs font-bold inline-flex items-center gap-s1 transition-colors"
                          >
                            <ImageIcon size={14} /> Ver
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vista por zona: agregación real por zona (lat/lng redondeada) */
        <div className="bg-white rounded-2xl border border-gray-5 p-s3 flex flex-col gap-s2">
          <div className="border-b border-gray-5 pb-s2">
            <h6 className="text-h6 font-bold text-black-2">
              Mapa de Calor Fitosanitario
            </h6>
            <p className="text-sm text-gray-3 font-normal mt-s1">
              Casos por zona geográfica (coordenadas agrupadas), desde el
              read-model real.
            </p>
          </div>
          {zonesLoading ? (
            <p className="py-s2 text-sm text-gray-3">Cargando zonas…</p>
          ) : !zones || zones.length === 0 ? (
            <p className="py-s2 text-sm text-gray-3">
              Sin datos geográficos todavía.
            </p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-2 text-2xs font-bold uppercase tracking-wider border-b border-gray-5">
                  <th scope="col" className="py-s2 px-s2">
                    Zona (lat, lng)
                  </th>
                  <th scope="col" className="py-s2 px-s2">
                    Plaga
                  </th>
                  <th scope="col" className="py-s2 px-s2 text-right">
                    Casos
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-5">
                {zones.map((z, i) => (
                  <tr key={`${z.latitude}-${z.longitude}-${z.pestType}-${i}`}>
                    <td className="py-s2 px-s2 text-sm font-semibold text-black-2 flex items-center gap-s1">
                      <MapPin size={14} className="text-gray-3" />
                      {z.latitude.toFixed(1)}, {z.longitude.toFixed(1)}
                    </td>
                    <td className="py-s2 px-s2 text-sm text-gray-2">
                      {z.pestType}
                    </td>
                    <td className="py-s2 px-s2 text-sm font-bold text-black-2 text-right">
                      {z.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {preview && (
        <DiagnosisImageModal
          diagnosis={preview}
          onClose={() => setPreview(null)}
        />
      )}

      <ShortcutsOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        groups={shortcutGroups}
      />
    </div>
  );
}

function DiagnosisImageModal({
  diagnosis,
  onClose,
}: {
  diagnosis: AdminDiagnosis;
  onClose: () => void;
}) {
  const { data, isLoading, isError } = useDiagnosisDetail(diagnosis.id);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={diagnosis.pestName}
      className="fixed inset-0 z-50 bg-black-2/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-gray-5 w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-s3 py-s2 border-b border-gray-5">
          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-black-2 truncate">
              {diagnosis.pestName}
            </span>
            <span className="text-xs text-gray-3 italic truncate">
              {diagnosis.scientificName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="press focus-ring h-9 w-9 rounded-full hover:bg-gray-5 flex items-center justify-center text-gray-3 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[420px] bg-forest-deep flex items-center justify-center">
          {isLoading ? (
            <span className="text-white/60 text-sm">Cargando imagen…</span>
          ) : isError ? (
            <span className="text-error text-sm">
              No se pudo cargar el diagnóstico.
            </span>
          ) : data?.imageUrl ? (
            // biome-ignore lint/performance/noImgElement: imagen servida con SAS desde Azure Blob, fuera del dominio de Next/Image
            <img
              src={data.imageUrl}
              alt={`Diagnóstico ${diagnosis.pestName}`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-s1 text-white/50">
              <ImageOff size={40} />
              <span className="text-sm">Imagen no disponible</span>
              <span className="text-xs text-white/35">
                (diagnóstico sin imagen en Azure — p. ej. capturas offline)
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-s2 px-s3 py-s2 border-t border-gray-5">
          <Meta label="Caficultor" value={diagnosis.farmerLabel} />
          <Meta label="Confianza" value={pct(diagnosis.confidence)} />
          <Meta label="Severidad" value={pct(diagnosis.severity)} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xs font-bold text-gray-3 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-bold text-black-2 truncate">{value}</span>
    </div>
  );
}
