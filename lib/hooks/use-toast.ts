import { useSyncExternalStore } from "react";

export type ToastTone = "success" | "error" | "info";
export type ToastItem = {
  id: string;
  title: string;
  body?: string;
  tone: ToastTone;
};

type Listener = (items: ToastItem[]) => void;

let _toasts: ToastItem[] = [];
let _listeners: Listener[] = [];

function _notify() {
  for (const l of _listeners) l([..._toasts]);
}

export function toast(opts: Omit<ToastItem, "id">, durationMs = 5000): void {
  const id = Math.random().toString(36).slice(2, 9);
  _toasts = [..._toasts, { ...opts, id }];
  _notify();
  setTimeout(() => dismissToast(id), durationMs);
}

export function dismissToast(id: string): void {
  _toasts = _toasts.filter((t) => t.id !== id);
  _notify();
}

export function useToasts(): ToastItem[] {
  return useSyncExternalStore(
    (cb) => {
      _listeners.push(cb);
      return () => {
        _listeners = _listeners.filter((l) => l !== cb);
      };
    },
    () => _toasts,
    () => [],
  );
}
