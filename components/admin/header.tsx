"use client";

import { Bell, Search, Settings } from "lucide-react";
import { useRef } from "react";
import { Kbd } from "@/components/ui/kbd";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";
import { t } from "@/lib/i18n/es";

export function Header() {
  const searchRef = useRef<HTMLInputElement>(null);

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

  return (
    <header className="h-[72px] shrink-0 bg-white border-b border-gray-5 flex items-center justify-between gap-4 px-6">
      <div className="flex-1 max-w-2xl">
        <label className="flex items-center gap-2 h-11 bg-gray-5 rounded-full px-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary transition-colors">
          <Search size={18} className="text-gray-3" aria-hidden />
          <input
            ref={searchRef}
            type="search"
            placeholder={t.header.searchPlaceholder}
            aria-label={t.common.search}
            className="flex-1 bg-transparent text-base text-black-2 placeholder:text-gray-3 outline-none"
          />
          <Kbd className="hidden md:inline-flex">/</Kbd>
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

        <div
          aria-label={t.common.profile}
          className="h-10 w-10 rounded-full bg-secondary text-primary font-bold flex items-center justify-center text-sm shrink-0 ml-2"
        >
          A
        </div>
      </div>
    </header>
  );
}
