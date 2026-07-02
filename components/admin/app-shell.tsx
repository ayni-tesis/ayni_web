"use client";

import { type ReactNode, useEffect, useState } from "react";
import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";
import { t } from "@/lib/i18n/es";

/**
 * Shell responsive del panel: sidebar fijo en ≥lg, drawer off-canvas por debajo
 * (tablet portrait). El drawer cierra con Escape, backdrop y al navegar.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-cream">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.sidebar.navLabel}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <button
            type="button"
            aria-label={t.common.close}
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 w-full bg-black-2/40 cursor-default"
          />
          <div className="absolute inset-y-0 left-0 shadow-[8px_0_24px_rgba(0,0,0,0.12)]">
            <Sidebar
              className="h-full"
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-s2 md:p-s3">{children}</main>
      </div>
    </div>
  );
}
