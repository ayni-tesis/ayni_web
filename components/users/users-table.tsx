"use client";

import {
  KeyRound,
  MoreVertical,
  Pencil,
  Power,
  Trash2,
  UserCheck,
  UserCircle,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { type DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/api/types";
import { formatRelativeTime } from "@/lib/format";
import { t } from "@/lib/i18n/es";
import { RoleBadge } from "./role-badge";
import { StatusBadge } from "./status-badge";

type UsersTableProps = {
  users: User[];
  isLoading: boolean;
  pageSize: number;
  onUserAction?: (action: string, user: User) => void;
};

const HEADERS = [
  t.users.columns.name,
  t.users.columns.role,
  t.users.columns.community,
  t.users.columns.lastActivity,
  t.users.columns.status,
  t.users.columns.actions,
] as const;

export function UsersTable({
  users,
  isLoading,
  pageSize,
  onUserAction,
}: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr>
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-sm font-bold text-gray-2 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <SkeletonRow key={i} />
            ))
          ) : users.length === 0 ? (
            <tr>
              <td
                colSpan={HEADERS.length}
                className="px-6 py-12 text-center text-gray-2"
              >
                {t.users.emptyState}
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRow key={user.id} user={user} onUserAction={onUserAction} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({
  user,
  onUserAction,
}: {
  user: User;
  onUserAction?: (action: string, user: User) => void;
}) {
  const isInactive = user.status === "INACTIVE";

  const menuItems: DropdownItem[] = [
    {
      label: t.users.rowActions.view,
      icon: UserCircle,
      onSelect: () => onUserAction?.("view", user),
    },
    {
      label: t.users.rowActions.edit,
      icon: Pencil,
      onSelect: () => onUserAction?.("edit", user),
    },
    {
      label: t.users.rowActions.resetPassword,
      icon: KeyRound,
      onSelect: () => onUserAction?.("reset-password", user),
    },
    {
      label: isInactive
        ? t.users.rowActions.activate
        : t.users.rowActions.deactivate,
      icon: isInactive ? UserCheck : Power,
      onSelect: () =>
        onUserAction?.(isInactive ? "activate" : "deactivate", user),
    },
    {
      label: t.users.rowActions.delete,
      icon: Trash2,
      destructive: true,
      onSelect: () => onUserAction?.("delete", user),
    },
  ];

  return (
    <tr className="border-t border-gray-5 hover:bg-gray-5/40 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar fullName={user.fullName} src={user.avatarUrl} />
          <div className="min-w-0">
            <p className="text-base font-bold text-black-2 truncate">
              {user.fullName}
            </p>
            <p className="text-sm text-gray-2 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-4 text-base text-black-2">{user.community}</td>
      <td className="px-6 py-4 text-base text-gray-1">
        {formatRelativeTime(user.lastActivityAt)}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-6 py-4">
        <DropdownMenu
          ariaLabel={`${t.common.actions} para ${user.fullName}`}
          trigger={<MoreVertical size={18} />}
          items={menuItems}
        />
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-t border-gray-5">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-5 animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="h-4 w-32 rounded bg-gray-5 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-5 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="h-7 w-24 rounded-full bg-gray-5 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-20 rounded bg-gray-5 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-4 w-16 rounded bg-gray-5 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-7 w-20 rounded-full bg-gray-5 animate-pulse" />
      </td>
      <td className="px-6 py-4">
        <div className="h-9 w-9 rounded-full bg-gray-5 animate-pulse" />
      </td>
    </tr>
  );
}
