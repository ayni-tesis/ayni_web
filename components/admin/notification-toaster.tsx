"use client";

import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type AppNotification, notificationText } from "@/lib/api/notifications";
import { useNotifications } from "@/lib/hooks/use-notifications";

/**
 * Muestra un pop-up cuando llega una notificación nueva mientras el usuario está en
 * pantalla. Comparte la query con la campana (mismo queryKey → un solo polling). En el
 * primer fetch fija una línea base (no notifica lo ya existente); solo avisa de ids nuevos.
 */
export function NotificationToaster() {
  const { data } = useNotifications();
  const seen = useRef<Set<string> | null>(null);
  const [toast, setToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    const items = data?.content ?? [];
    if (seen.current === null) {
      seen.current = new Set(items.map((n) => n.id));
      return;
    }
    const fresh = items.find((n) => !seen.current?.has(n.id));
    for (const n of items) seen.current.add(n.id);
    if (fresh) setToast(fresh);
  }, [data]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(id);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] w-[360px] max-w-[calc(100vw-2rem)] animate-in">
      <div className="bg-white border border-gray-5 rounded-2xl shadow-lg p-s2 flex gap-s2">
        <div className="h-9 w-9 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
          <Bell size={18} />
        </div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <span className="text-sm font-bold text-black-2">{toast.title}</span>
          {toast.body && (
            <span className="text-xs text-gray-2 leading-relaxed line-clamp-3">
              {notificationText(toast.body)}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setToast(null)}
          className="press focus-ring h-9 w-9 rounded-full hover:bg-gray-5 flex items-center justify-center text-gray-3 shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
}
