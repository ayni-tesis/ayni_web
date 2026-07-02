"use client";
import { X } from "lucide-react";
import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { t } from "@/lib/i18n/es";

export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  panelClassName,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  panelClassName?: string;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-black-2/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className={`modal-in ${
          panelClassName ??
          "bg-white rounded-2xl w-full max-w-md p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        }`}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-h5 font-bold text-black-2 leading-none">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-gray-2 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.common.close}
            className="press focus-ring h-9 w-9 rounded-full hover:bg-gray-5 inline-flex items-center justify-center text-gray-2"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
