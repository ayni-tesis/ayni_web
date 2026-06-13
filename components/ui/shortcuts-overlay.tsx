"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { t } from "@/lib/i18n/es";
import { Kbd } from "./kbd";

export type ShortcutGroup = {
  title: string;
  items: Array<{ keys: string[]; label: string }>;
};

type ShortcutsOverlayProps = {
  open: boolean;
  onClose: () => void;
  groups: ShortcutGroup[];
};

export function ShortcutsOverlay({
  open,
  onClose,
  groups,
}: ShortcutsOverlayProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.shortcuts.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black-2/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-h5 font-bold text-black-2 leading-none">
              {t.shortcuts.title}
            </h2>
            <p className="text-sm text-gray-2 mt-1">{t.shortcuts.body}</p>
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

        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-3 mb-2">
                {group.title}
              </p>
              <ul className="flex flex-col gap-1.5">
                {group.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between text-sm text-black-2"
                  >
                    <span>{item.label}</span>
                    <span className="flex items-center gap-1">
                      {item.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
