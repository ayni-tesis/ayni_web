import type { ApiError } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080/api";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("ayni.accessToken");
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
  const { body, searchParams, headers, ...rest } = options;

  const token = getAuthToken();
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
