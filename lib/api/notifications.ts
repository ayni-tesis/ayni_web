import { apiFetch } from "./client";
import type { PageResponse } from "./types";

/**
 * Bandeja de notificaciones del usuario autenticado. Backend real: notification-service
 * vía Gateway, bajo /api/notifications. El userId sale del JWT (no se envía).
 */

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  dataJson: string | null;
  channel: string;
  read: boolean;
  sent: boolean;
  createdAt: string;
  sentAt: string | null;
  readAt: string | null;
};

/**
 * Convierte un cuerpo (que puede venir en HTML, p. ej. plantillas de correo) a texto
 * plano para mostrarlo en la campana/pop-up sin etiquetas.
 */
export function notificationText(body: string | null): string {
  if (!body) return "";
  return body
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export const notificationsService = {
  list(page = 0, size = 20): Promise<PageResponse<AppNotification>> {
    return apiFetch<PageResponse<AppNotification>>("/notifications", {
      method: "GET",
      searchParams: { page, size },
    });
  },
  unreadCount(): Promise<{ count: number }> {
    return apiFetch<{ count: number }>("/notifications/unread-count", { method: "GET" });
  },
  markRead(id: string): Promise<AppNotification> {
    return apiFetch<AppNotification>(`/notifications/${id}/read`, { method: "PATCH" });
  },
  markAllRead(): Promise<{ updated: number }> {
    return apiFetch<{ updated: number }>("/notifications/read-all", { method: "PATCH" });
  },
  remove(id: string): Promise<void> {
    return apiFetch<void>(`/notifications/${id}`, { method: "DELETE" });
  },
};
