import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/lib/api/notifications";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationsKeys.all, "list"] as const,
  unread: () => [...notificationsKeys.all, "unread"] as const,
};

// Polling: refresca la bandeja para alimentar el badge y el pop-up en tiempo (casi) real.
const POLL_MS = 20000;

export function useNotifications() {
  return useQuery({
    queryKey: notificationsKeys.list(),
    queryFn: () => notificationsService.list(0, 20),
    refetchInterval: POLL_MS,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationsKeys.unread(),
    queryFn: () => notificationsService.unreadCount(),
    refetchInterval: POLL_MS,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationsKeys.all }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsService.markAllRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationsKeys.all }),
  });
}
