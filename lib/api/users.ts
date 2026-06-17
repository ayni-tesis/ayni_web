import { apiFetch } from "./client";
import type {
  ListUsersParams,
  PageResponse,
  User,
  UserRole,
  UserStatus,
} from "./types";

/**
 * Servicio de gestión de usuarios (panel admin).
 * Backend real: auth-service vía Gateway, bajo /api/admin/users (solo ADMIN).
 */

export type UpdateUserInput = { role?: UserRole; status?: UserStatus };
export type CreateUserInput = {
  email: string;
  fullName: string;
  password: string;
  role: UserRole;
};
export type ResetPasswordResult = { temporaryPassword: string };

export type UsersService = {
  list(params: ListUsersParams): Promise<PageResponse<User>>;
  getById(id: string): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  remove(id: string): Promise<void>;
  resetPassword(id: string): Promise<ResetPasswordResult>;
  create(input: CreateUserInput): Promise<User>;
};

export const usersService: UsersService = {
  list(params) {
    return apiFetch<PageResponse<User>>("/admin/users", {
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
    return apiFetch<User>(`/admin/users/${id}`, { method: "GET" });
  },

  update(id, input) {
    return apiFetch<User>(`/admin/users/${id}`, { method: "PATCH", body: input });
  },

  remove(id) {
    return apiFetch<void>(`/admin/users/${id}`, { method: "DELETE" });
  },

  resetPassword(id) {
    return apiFetch<ResetPasswordResult>(`/admin/users/${id}/reset-password`, {
      method: "POST",
    });
  },

  create(input) {
    return apiFetch<User>("/admin/users", { method: "POST", body: input });
  },
};

// Helpers de UI — labels en español. Las claves del backend permanecen en inglés.
import { t } from "@/lib/i18n/es";

export const ROLE_LABELS: Record<UserRole, string> = {
  FARMER: t.roles.FARMER,
  AGRONOMIST: t.roles.AGRONOMIST,
  ADMIN: t.roles.ADMIN,
};
