"use client";

import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { type AppNotification, notificationText } from "@/lib/api/notifications";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadCount,
} from "@/lib/hooks/use-notifications";
import { t } from "@/lib/i18n/es";

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

export function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError } = useNotifications();
  const { data: unread } = useUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const items = data?.content ?? [];
  const count = unread?.count ?? 0;

  function handleClick(n: AppNotification) {
    if (!n.read) markRead.mutate(n.id);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={t.common.notifications}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="press focus-ring relative h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-[52px] z-50 w-[360px] max-h-[480px] bg-white border border-gray-5 rounded-2xl shadow-lg overflow-hidden flex flex-col"
          // evita que el blur del botón cierre el panel antes del click
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-5">
            <span className="text-sm font-bold text-black-2">
              Notificaciones{count > 0 ? ` (${count})` : ""}
            </span>
            {count > 0 && (
              <button
                type="button"
                onClick={() => markAll.mutate()}
                disabled={markAll.isPending}
                className="press text-xs font-bold text-primary hover:underline flex items-center gap-s1 disabled:opacity-50"
              >
                <CheckCheck size={14} />
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-sm text-gray-3 text-center">Cargando…</p>
            ) : isError ? (
              <p className="px-4 py-6 text-sm text-error text-center">
                No se pudieron cargar las notificaciones.
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-sm text-gray-3 text-center">
                No tienes notificaciones pendientes.
              </p>
            ) : (
              <ul className="divide-y divide-gray-5">
                {items.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleClick(n)}
                      className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-5/60 transition-colors ${
                        n.read ? "" : "bg-secondary/25"
                      }`}
                    >
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                          n.read ? "bg-transparent" : "bg-error"
                        }`}
                      />
                      <span className="min-w-0 flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-black-2">{n.title}</span>
                        {n.body && (
                          <span className="text-xs text-gray-2 leading-relaxed line-clamp-3">
                            {notificationText(n.body)}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-3 font-semibold mt-0.5">
                          {relativeTime(n.createdAt)}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
