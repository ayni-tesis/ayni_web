import type { ReactNode } from "react";
import { AppShell } from "@/components/admin/app-shell";
import { AuthGuard } from "@/components/admin/auth-guard";
import { NotificationToaster } from "@/components/admin/notification-toaster";
import { ToastPortal } from "@/components/ui/toast-portal";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
      <NotificationToaster />
      <ToastPortal />
    </AuthGuard>
  );
}
