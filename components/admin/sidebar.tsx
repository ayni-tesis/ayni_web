"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bug,
  CheckSquare,
  ClipboardCheck,
  Home,
  Network,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n/es";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { title?: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    items: [{ href: "/", label: t.sidebar.home, icon: Home }],
  },
  {
    title: t.sidebar.groupDiagnosis,
    items: [
      { href: "/diagnoses", label: t.sidebar.diagnoses, icon: ClipboardCheck },
      { href: "/validation", label: t.sidebar.validation, icon: CheckSquare },
      { href: "/catalog", label: t.sidebar.catalog, icon: Bug },
    ],
  },
  {
    title: t.sidebar.groupIntelligence,
    items: [
      { href: "/pipeline", label: t.sidebar.pipeline, icon: Network },
      { href: "/reports", label: t.sidebar.reports, icon: BarChart3 },
    ],
  },
  {
    title: t.sidebar.groupAdmin,
    items: [
      { href: "/users", label: t.sidebar.users, icon: Users },
      { href: "/alerts", label: t.sidebar.alerts, icon: AlertTriangle },
      { href: "/monitoring", label: t.sidebar.monitoring, icon: Activity },
    ],
  },
];

const ALL_ITEMS = GROUPS.flatMap((group) => group.items);
const ITEM_HEIGHT = 48;

function getActiveHref(pathname: string): string {
  // Find exact match first
  const exact = ALL_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.href;

  // Find prefix match (excluding root)
  const prefix = ALL_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href),
  );
  return prefix ? prefix.href : "/";
}

export function Sidebar() {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-5 flex flex-col gap-6 py-5 overflow-y-auto">
      <div className="flex items-center gap-3 px-5">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Shield size={22} className="text-white" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <h5 className="text-h5 font-bold text-black-2 leading-none">AYNI</h5>
          <p className="text-sm text-gray-3 mt-1 font-normal">
            Agri-Tech Admin
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-5 px-3">
        {GROUPS.map((group) => (
          <div key={group.title || "general"} className="flex flex-col gap-2">
            {group.title && (
              <span className="px-4 text-[11px] font-bold text-gray-3 uppercase tracking-wider block">
                {group.title}
              </span>
            )}
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = item.href === activeHref;
                const Icon = item.icon;
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "press focus-ring flex items-center gap-3 rounded-full pl-4 pr-6 transition-colors",
                        isActive
                          ? "bg-secondary text-primary font-bold"
                          : "text-gray-1 hover:bg-gray-5 font-normal",
                      )}
                      style={{ height: ITEM_HEIGHT }}
                    >
                      <Icon size={20} strokeWidth={isActive ? 2.25 : 2} />
                      <span className="text-base">{item.label}</span>
                    </Link>
                    {/* Active vertical accent bar aligned to the right edge of the nav area */}
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-l-full bg-primary"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
