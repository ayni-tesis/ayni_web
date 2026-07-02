"use client";
import { ModalShell } from "@/components/ui/modal-shell";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  tone = "danger",
  onConfirm,
  onCancel,
  pending = false,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  tone?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
}) {
  if (!open) return null;
  return (
    <ModalShell title={title} onClose={onCancel}>
      <div className="flex flex-col gap-s3">
        <p className="text-sm text-gray-2 leading-relaxed">{body}</p>
        <div className="flex items-center justify-end gap-s2">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="press focus-ring h-11 px-5 rounded-full border border-gray-5 text-gray-1 font-bold text-base hover:bg-gray-5 transition-colors disabled:opacity-50"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "press focus-ring h-11 px-5 rounded-full font-bold text-base text-white hover:opacity-85 transition-opacity disabled:opacity-50 inline-flex items-center justify-center",
              tone === "danger" ? "bg-error" : "bg-primary",
            )}
          >
            {pending ? t.common.loading : confirmLabel}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
