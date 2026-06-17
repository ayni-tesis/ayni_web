import { apiFetch } from "./client";
import type { UserRole } from "./types";

/**
 * Servicio de autenticación contra el auth-service (vía API Gateway).
 * Endpoints reales: POST /auth/login, POST /auth/logout.
 */

export type LoginRequest = { email: string; password: string };

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  active: boolean;
  consentGiven: boolean;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};

export const authService = {
  login(body: LoginRequest): Promise<LoginResponse> {
    // skipAuthRedirect: un 401 aquí = credenciales inválidas, no sesión expirada.
    return apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body,
      skipAuthRedirect: true,
    });
  },

  /** Cierre de sesión en el backend (best-effort; el token se borra igual en el cliente). */
  async logout(): Promise<void> {
    try {
      await apiFetch<void>("/auth/logout", { method: "POST" });
    } catch {
      // Ignorar: el cierre de sesión local (clearSession) es lo que realmente importa.
    }
  },
};
