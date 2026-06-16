import { clearSession, getToken } from "@/lib/auth/session";
import type { ApiError } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  /** Si es true, un 401 NO redirige a /login (útil en la propia pantalla de login). */
  skipAuthRedirect?: boolean;
};

/** Sesión expirada/ inválida: limpia el token y manda al login (una sola vez). */
function handleUnauthorized(): void {
  if (typeof window === "undefined") return;
  clearSession();
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

function buildUrl(
  path: string,
  searchParams?: FetchOptions["searchParams"],
): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { body, searchParams, headers, skipAuthRedirect, ...rest } = options;

  const token = getToken();
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  const response = await fetch(buildUrl(path, searchParams), {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && !skipAuthRedirect) {
      handleUnauthorized();
    }
    const error: ApiError = await response
      .json()
      .catch(() => ({ status: response.status, message: response.statusText }));
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
