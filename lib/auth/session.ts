/**
 * Gestión de la sesión en el navegador (localStorage).
 * El backend (auth-service) emite el JWT; el cliente lo guarda y lo adjunta
 * en cada petición vía `apiFetch` (header Authorization: Bearer).
 */
import type { UserRole } from "@/lib/api/types";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

const TOKEN_KEY = "ayni.accessToken";
const REFRESH_KEY = "ayni.refreshToken";
const USER_KEY = "ayni.user";

export function setSession(args: {
  accessToken: string;
  refreshToken?: string | null;
  user: SessionUser;
}): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, args.accessToken);
  if (args.refreshToken) localStorage.setItem(REFRESH_KEY, args.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(args.user));
}

/** Actualiza parcialmente el usuario guardado (p. ej. tras editar el perfil). */
export function updateSessionUser(patch: Partial<SessionUser>): void {
  if (typeof window === "undefined") return;
  const current = getUser();
  if (!current) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...patch }));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getUser(): SessionUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
