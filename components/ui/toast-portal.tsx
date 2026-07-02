"use client";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { dismissToast, type ToastTone, useToasts } from "@/lib/hooks/use-toast";
import { t as i18n } from "@/lib/i18n/es";

const TONE_ICON: Record<ToastTone, ReactNode> = {
  success: <CheckCircle2 size={18} className="text-success" />,
  error: <AlertCircle size={18} className="text-error" />,
  info: <Info size={18} className="text-gray-2" />,
};

export function ToastPortal() {
  const toasts = useToasts();
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed bottom-4 right-4 z-[110] flex flex-col-reverse gap-2 pointer-events-none">
      {toasts.map((t) => (
        <output
          key={t.id}
          aria-live="polite"
          className="toast-in pointer-events-auto bg-white border border-gray-5 rounded-2xl shadow-lg p-s2 flex gap-s2 w-[360px] max-w-[calc(100vw-2rem)]"
        >
          <div className="h-9 w-9 rounded-full bg-gray-5/50 flex items-center justify-center shrink-0">
            {TONE_ICON[t.tone]}
          </div>
          <div className="min-w-0 flex flex-col gap-0.5 flex-1">
            <span className="text-sm font-bold text-black-2">{t.title}</span>
            {t.body && (
              <span className="text-xs text-gray-2 leading-relaxed">
                {t.body}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={i18n.common.close}
            onClick={() => dismissToast(t.id)}
            className="press focus-ring h-9 w-9 rounded-full hover:bg-gray-5 flex items-center justify-center text-gray-3 shrink-0"
          >
            <X size={15} />
          </button>
        </output>
      ))}
    </div>,
    document.body,
  );
}
