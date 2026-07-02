"use client";

import { LogOut, Search, Settings, Sprout, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificationsMenu } from "@/components/admin/notifications-menu";
import { Kbd } from "@/components/ui/kbd";
import { ROLE_LABELS } from "@/lib/api/users";
import type { SearchResult } from "@/lib/api/search";
import { useSession } from "@/lib/auth/use-session";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";
import { useGlobalSearch } from "@/lib/hooks/use-search";
import { t } from "@/lib/i18n/es";

function initials(name: string | undefined): string {
  if (!name) return "A";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "A").concat(parts[1]?.[0] ?? "").toUpperCase();
}

export function Header() {
  const searchRef = useRef<HTMLInputElement>(null);
  const { user, logout } = useSession();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(id);
  }, [query]);

  const { data, isFetching } = useGlobalSearch(debounced);
  const results = data?.results ?? [];
  const plagues = results.filter((r) => r.type === "PLAGUE");
  const users = results.filter((r) => r.type === "USER");
  const showDropdown = open && query.trim().length >= 2;

  useHotkeys([
    {
      key: "/",
      handler: (event) => {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      },
    },
  ]);

  function select(result: SearchResult) {
    setQuery("");
    setOpen(false);
    router.push(result.type === "USER" ? "/users" : "/catalog");
  }

  return (
    <header className="h-[72px] shrink-0 bg-white border-b border-gray-5 flex items-center justify-between gap-4 px-6">
      <div className="relative flex-1 max-w-2xl">
        <label className="flex items-center gap-2 h-11 bg-gray-5 rounded-full px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary transition-colors">
          <Search size={18} className="text-gray-3" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            placeholder={t.header.searchPlaceholder}
            aria-label={t.common.search}
            className="flex-1 bg-transparent text-base text-black-2 placeholder:text-gray-2 outline-none"
          />
          <Kbd className="hidden md:inline-flex">/</Kbd>
        </label>

        {showDropdown && (
          <div className="absolute left-0 right-0 top-[52px] z-50 bg-white border border-gray-5 rounded-2xl shadow-lg overflow-hidden max-h-[420px] overflow-y-auto">
            {isFetching && results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-3">{t.header.searching}</p>
            ) : results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-gray-3">{t.header.noResults(query.trim())}</p>
            ) : (
              <>
                {plagues.length > 0 && (
                  <SearchGroup label={t.header.groupPlagues}>
                    {plagues.map((r) => (
                      <SearchRow key={`p-${r.id}`} icon={<Sprout size={16} />} result={r} onSelect={select} />
                    ))}
                  </SearchGroup>
                )}
                {users.length > 0 && (
                  <SearchGroup label={t.header.groupFarmers}>
                    {users.map((r) => (
                      <SearchRow key={`u-${r.id}`} icon={<User size={16} />} result={r} onSelect={select} />
                    ))}
                  </SearchGroup>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <NotificationsMenu />

        <button
          type="button"
          aria-label={t.common.settings}
          title="Configuración"
          onClick={() => router.push("/configuracion")}
          className="press focus-ring h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
        >
          <Settings size={20} />
        </button>

        <div className="ml-2 flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-tight text-black-2">{user?.fullName ?? "—"}</p>
            <p className="text-xs leading-tight text-gray-3">{user ? ROLE_LABELS[user.role] : ""}</p>
          </div>
          <div
            role="img"
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

function SearchGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-4 py-1 text-2xs font-bold uppercase tracking-wider text-gray-3">{label}</p>
      {children}
    </div>
  );
}

function SearchRow({
  icon,
  result,
  onSelect,
}: {
  icon: React.ReactNode;
  result: SearchResult;
  onSelect: (r: SearchResult) => void;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect(result)}
      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-5 text-left transition-colors"
    >
      <span className="h-8 w-8 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">{icon}</span>
      <span className="min-w-0 flex flex-col">
        <span className="text-sm font-bold text-black-2 truncate">{result.title ?? "—"}</span>
        {result.subtitle && <span className="text-xs text-gray-3 truncate">{result.subtitle}</span>}
      </span>
    </button>
  );
}
