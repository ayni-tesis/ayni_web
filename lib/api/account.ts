import { apiFetch } from "./client";

/**
 * Cuenta del usuario autenticado (self-service). Backend real: auth-service vía
 * Gateway bajo /api/account. El userId sale del JWT (cabecera X-User-Id).
 */

export type Account = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  consentGiven: boolean;
  consentDate: string | null;
  createdAt: string | null;
};

export const accountService = {
  me(): Promise<Account> {
    return apiFetch<Account>("/account/me", { method: "GET" });
  },
  updateProfile(fullName: string): Promise<Account> {
    return apiFetch<Account>("/account/me", { method: "PATCH", body: { fullName } });
  },
  changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return apiFetch<void>("/account/me/change-password", {
      method: "POST",
      body: { currentPassword, newPassword },
    });
  },
};
