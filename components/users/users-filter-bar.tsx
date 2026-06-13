"use client";

import { ListFilter, Search, X } from "lucide-react";
import { forwardRef } from "react";
import type { UserRole } from "@/lib/api/types";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

type RoleFilter = UserRole | "ALL";

export const ROLE_TABS: ReadonlyArray<{
  value: RoleFilter;
  label: string;
  hotkey: string;
}> = [
  { value: "ALL", label: t.users.tabs.all, hotkey: "1" },
  { value: "FARMER", label: t.users.tabs.farmers, hotkey: "2" },
  { value: "AGRONOMIST", label: t.users.tabs.agronomists, hotkey: "3" },
];

type UsersFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  role: RoleFilter;
  onRoleChange: (role: RoleFilter) => void;
};

export const UsersFilterBar = forwardRef<HTMLInputElement, UsersFilterBarProps>(
  function UsersFilterBar({ search, onSearchChange, role, onRoleChange }, ref) {
    const hasSearch = search.length > 0;

    return (
      <div className="flex items-center gap-3 flex-wrap p-4">
        <div className="flex-1 min-w-64">
          <div className="flex items-center gap-2 h-11 bg-white border border-gray-5 rounded-xl px-3 focus-within:border-primary transition-colors">
            <Search size={18} className="text-gray-3" aria-hidden />
            <input
              ref={ref}
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.users.searchPlaceholder}
              aria-label={t.users.searchPlaceholder}
              className="flex-1 bg-transparent text-base text-black-2 placeholder:text-gray-3 outline-none"
            />
            {hasSearch && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label={t.common.clear}
                className="press focus-ring h-7 w-7 rounded-full text-gray-3 hover:text-gray-1 hover:bg-gray-5 inline-flex items-center justify-center"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <button
          type="button"
          className="press focus-ring h-11 px-4 inline-flex items-center gap-2 rounded-xl border border-gray-5 text-base text-gray-1 hover:bg-gray-5 transition-colors"
        >
          <ListFilter size={18} />
          {t.users.filters}
        </button>

        <div className="flex items-center gap-2">
          {ROLE_TABS.map((tab) => {
            const isActive = role === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onRoleChange(tab.value)}
                aria-pressed={isActive}
                className={cn(
                  "press focus-ring h-11 px-5 rounded-full text-base transition-colors",
                  isActive
                    ? "bg-secondary text-primary font-bold"
                    : "bg-white border border-gray-5 text-gray-1 hover:bg-gray-5",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

export type { RoleFilter };
