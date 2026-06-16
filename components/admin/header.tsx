"use client";

import { Bell, LogOut, Search, Settings } from "lucide-react";
import { useSession } from "@/lib/auth/use-session";
import { ROLE_LABELS } from "@/lib/api/users";
import { t } from "@/lib/i18n/es";

function initials(name: string | undefined): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "A").concat(parts[1]?.[0] ?? "").toUpperCase();
}

export function Header() {
  const { user, logout } = useSession();

  return (
    <header className="h-[72px] shrink-0 bg-white border-b border-gray-5 flex items-center justify-between gap-4 px-6">
      <div className="flex-1 max-w-2xl">
        <label
          title="Búsqueda global: próximamente"
          className="flex items-center gap-2 h-11 bg-gray-5 rounded-full px-4 opacity-60 cursor-not-allowed"
        >
          <Search size={18} className="text-gray-3" aria-hidden />
          <input
            type="search"
            disabled
            placeholder="Búsqueda global: próximamente"
            aria-label={t.common.search}
            className="flex-1 bg-transparent text-base text-black-2 placeholder:text-gray-3 outline-none cursor-not-allowed"
          />
        </label>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          aria-label={t.common.notifications}
          className="press focus-ring relative h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
        >
          <Bell size={20} />
          <span
            aria-hidden
            className="dot-pulse absolute top-2 right-2 w-2 h-2 rounded-full bg-error"
          />
        </button>

        <button
          type="button"
          aria-label={t.common.settings}
          className="press focus-ring h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
        >
          <Settings size={20} />
        </button>

        <div className="ml-2 flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-black-2">
              {user?.fullName ?? "—"}
            </p>
            <p className="text-xs leading-tight text-gray-3">
              {user ? ROLE_LABELS[user.role] : ""}
            </p>
          </div>
          <div
            aria-label={t.common.profile}
            className="h-10 w-10 rounded-full bg-secondary text-primary font-bold flex items-center justify-center text-sm shrink-0"
          >
            {initials(user?.fullName)}
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className="press focus-ring h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
