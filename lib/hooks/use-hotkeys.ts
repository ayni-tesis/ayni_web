"use client";

import { useEffect } from "react";

type HotkeyHandler = (event: KeyboardEvent) => void;

type Hotkey = {
  key: string;
  handler: HotkeyHandler;
  /** Si es true, dispara incluso cuando el foco está en un input/textarea. */
  allowInInput?: boolean;
};

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return EDITABLE_TAGS.has(target.tagName);
}

/**
 * Registra atajos de teclado globales para la página actual.
 * Bloquea atajos cuando el foco está en un input — excepto los marcados `allowInInput`.
 * Ignora atajos cuando se presiona con Ctrl/Cmd/Alt para no chocar con shortcuts del navegador.
 */
export function useHotkeys(hotkeys: Hotkey[]) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const editable = isEditableTarget(event.target);
      for (const hk of hotkeys) {
        if (hk.key !== event.key) continue;
        if (editable && !hk.allowInInput) continue;
        hk.handler(event);
        break;
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [hotkeys]);
}
