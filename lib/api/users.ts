import { MOCK_USERS } from "@/lib/mock/users";
import { apiFetch } from "./client";
import type { ListUsersParams, PageResponse, User, UserRole } from "./types";

/**
 * Contrato del servicio de usuarios.
 * El backend deberá exponer estos endpoints bajo /api/users cuando esté listo.
 * Para migrar: cambiar NEXT_PUBLIC_USE_MOCK_API=false y la implementación real toma el relevo.
 */
export type UsersService = {
  list(params: ListUsersParams): Promise<PageResponse<User>>;
  getById(id: string): Promise<User>;
};

// ────────────────────────────────────────────────────────────
// Implementación real (apuntará al API Gateway)
// ────────────────────────────────────────────────────────────

const realUsersService: UsersService = {
  list(params) {
    return apiFetch<PageResponse<User>>("/users", {
      method: "GET",
      searchParams: {
        page: params.page,
        size: params.size,
        search: params.search,
        role: params.role === "ALL" ? undefined : params.role,
      },
    });
  },

  getById(id) {
    return apiFetch<User>(`/users/${id}`, { method: "GET" });
  },
};

// ────────────────────────────────────────────────────────────
// Implementación mock (se elimina cuando el backend esté listo)
// ────────────────────────────────────────────────────────────

const SIMULATED_LATENCY_MS = 350;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), SIMULATED_LATENCY_MS),
  );
}

function matchesFilters(user: User, params: ListUsersParams): boolean {
  if (params.role && params.role !== "ALL" && user.role !== params.role)
    return false;
  if (params.search) {
    const needle = params.search.toLowerCase();
    const haystack = `${user.fullName} ${user.email}`.toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

const mockUsersService: UsersService = {
  list(params) {
    const page = params.page ?? 0;
    const size = params.size ?? 4;

    const filtered = MOCK_USERS.filter((u) => matchesFilters(u, params));
    const start = page * size;
    const content = filtered.slice(start, start + size);
    const totalPages = Math.max(1, Math.ceil(filtered.length / size));

    return delay<PageResponse<User>>({
      content,
      page,
      size,
      totalElements: filtered.length,
      totalPages,
      last: page >= totalPages - 1,
    });
  },

  getById(id) {
    const user = MOCK_USERS.find((u) => u.id === id);
    if (!user) {
      return Promise.reject({ status: 404, message: "User not found" });
    }
    return delay(user);
  },
};

// ────────────────────────────────────────────────────────────
// Selector
// ────────────────────────────────────────────────────────────

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const usersService: UsersService = useMock
  ? mockUsersService
  : realUsersService;

// Helpers de UI — labels en español peruano.
// Las claves del backend permanecen en inglés (FARMER/AGRONOMIST/ADMIN).
import { t } from "@/lib/i18n/es";

export const ROLE_LABELS: Record<UserRole, string> = {
  FARMER: t.roles.FARMER,
  AGRONOMIST: t.roles.AGRONOMIST,
  ADMIN: t.roles.ADMIN,
};
