"use client";

import { Keyboard, UserPlus } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ErrorState } from "@/components/ui/error-state";
import {
  type ShortcutGroup,
  ShortcutsOverlay,
} from "@/components/ui/shortcuts-overlay";
import { TopProgressBar } from "@/components/ui/top-progress-bar";
import {
  CreateUserModal,
  EditUserModal,
  ViewUserModal,
} from "@/components/users/user-modals";
import {
  ROLE_TABS,
  type RoleFilter,
  UsersFilterBar,
} from "@/components/users/users-filter-bar";
import { UsersPagination } from "@/components/users/users-pagination";
import { UsersTable } from "@/components/users/users-table";
import type { User } from "@/lib/api/types";
import { useHotkeys } from "@/lib/hooks/use-hotkeys";
import {
  useDeleteUser,
  useResetPassword,
  useUpdateUser,
  useUsers,
} from "@/lib/hooks/use-users";
import { t } from "@/lib/i18n/es";

const PAGE_SIZE = 4;

export default function UsersPage() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const { data, isLoading, isFetching, isError, refetch } = useUsers({
    page,
    size: PAGE_SIZE,
    search,
    role,
  });

  const resetPage = useCallback(() => setPage(0), []);

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();

  const handleUserAction = useCallback(
    (action: string, user: User) => {
      switch (action) {
        case "activate":
          updateUser.mutate({ id: user.id, input: { status: "ACTIVE" } });
          break;
        case "deactivate":
          updateUser.mutate({ id: user.id, input: { status: "INACTIVE" } });
          break;
        case "delete":
          if (
            window.confirm(
              `¿Eliminar la cuenta de ${user.fullName}? Esta acción no se puede deshacer.`,
            )
          ) {
            deleteUser.mutate(user.id);
          }
          break;
        case "reset-password":
          resetPassword.mutate(user.id, {
            onSuccess: (res) =>
              window.alert(
                `Contraseña temporal para ${user.fullName}:\n\n${res.temporaryPassword}\n\nCompártela de forma segura; el usuario deberá cambiarla.`,
              ),
          });
          break;
        case "view":
          setViewUser(user);
          break;
        case "edit":
          setEditUser(user);
          break;
        default:
          break;
      }
    },
    [updateUser, deleteUser, resetPassword],
  );

  const totalPages = data?.totalPages ?? 1;

  useHotkeys(
    useMemo(
      () => [
        {
          key: "/",
          handler: (e) => {
            e.preventDefault();
            searchInputRef.current?.focus();
            searchInputRef.current?.select();
          },
        },
        {
          key: "Escape",
          allowInInput: true,
          handler: (e) => {
            if (document.activeElement === searchInputRef.current && search) {
              e.preventDefault();
              setSearch("");
              resetPage();
            }
          },
        },
        {
          key: "ArrowLeft",
          handler: () => page > 0 && setPage(page - 1),
        },
        {
          key: "ArrowRight",
          handler: () => page < totalPages - 1 && setPage(page + 1),
        },
        ...ROLE_TABS.map((tab) => ({
          key: tab.hotkey,
          handler: () => {
            setRole(tab.value);
            resetPage();
          },
        })),
        {
          key: "?",
          handler: () => setShortcutsOpen(true),
        },
      ],
      [page, totalPages, search, resetPage],
    ),
  );

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: t.users.title,
      items: [
        { keys: ["/"], label: t.shortcuts.focusSearch },
        { keys: ["Esc"], label: t.shortcuts.clearFilters },
        { keys: ["←"], label: t.shortcuts.prevPage },
        { keys: ["→"], label: t.shortcuts.nextPage },
        { keys: ["1"], label: t.shortcuts.roleAll },
        { keys: ["2"], label: t.shortcuts.roleFarmer },
        { keys: ["3"], label: t.shortcuts.roleAgronomist },
        { keys: ["?"], label: t.shortcuts.showHelp },
      ],
    },
  ];

  return (
    <div>
      <PageHeader
        title={t.users.title}
        description={t.users.description}
        actions={
          <>
            <button
              type="button"
              onClick={() => setShortcutsOpen(true)}
              aria-label={t.shortcuts.showHelp}
              className="press focus-ring h-11 w-11 rounded-full border border-gray-5 text-gray-1 hover:bg-gray-5 inline-flex items-center justify-center transition-colors"
            >
              <Keyboard size={18} />
            </button>
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="press focus-ring h-11 px-5 rounded-full bg-primary text-white font-bold text-base hover:opacity-85 transition-opacity inline-flex items-center gap-2"
            >
              <UserPlus size={18} strokeWidth={2.25} />
              {t.users.createUser}
            </button>
          </>
        }
      />

      <div className="relative bg-white rounded-2xl border border-gray-5 overflow-hidden">
        <TopProgressBar visible={isFetching && !isLoading} />

        <UsersFilterBar
          ref={searchInputRef}
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          role={role}
          onRoleChange={(value) => {
            setRole(value);
            resetPage();
          }}
        />

        <div className="border-t border-gray-5">
          {isError ? (
            <ErrorState onRetry={() => refetch()} retrying={isFetching} />
          ) : (
            <UsersTable
              users={data?.content ?? []}
              isLoading={isLoading}
              pageSize={PAGE_SIZE}
              onUserAction={handleUserAction}
            />
          )}
        </div>

        {!isError && (
          <div className="border-t border-gray-5">
            <UsersPagination
              page={data?.page ?? 0}
              size={data?.size ?? PAGE_SIZE}
              totalElements={data?.totalElements ?? 0}
              totalPages={data?.totalPages ?? 1}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <ShortcutsOverlay
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        groups={shortcutGroups}
      />

      {createOpen && <CreateUserModal onClose={() => setCreateOpen(false)} />}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} />
      )}
      {viewUser && (
        <ViewUserModal user={viewUser} onClose={() => setViewUser(null)} />
      )}
    </div>
  );
}
