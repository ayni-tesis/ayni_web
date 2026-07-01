"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AyniMark } from "@/components/brand/ayni-mark";
import { authService } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/types";
import { setSession } from "@/lib/auth/session";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      // El panel es administrativo: solo ADMIN o AGRONOMIST.
      if (res.user.role !== "ADMIN" && res.user.role !== "AGRONOMIST") {
        setError("Este panel es solo para administradores o agrónomos.");
        setLoading(false);
        return;
      }
      setSession({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        user: {
          id: res.user.id,
          email: res.user.email,
          fullName: res.user.fullName,
          role: res.user.role,
        },
      });
      router.replace("/");
    } catch (err) {
      const apiErr = err as ApiError;
      setError(
        apiErr?.status === 401
          ? "Credenciales inválidas. Verifica tu correo y contraseña."
          : (apiErr?.message ?? "No se pudo iniciar sesión. Intenta de nuevo."),
      );
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-5 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <AyniMark size={32} background={null} fill="#fff" veinColor="#04A033" />
          </div>
          <h1 className="text-2xl font-bold text-black-2">AYNI Admin</h1>
          <p className="mt-1 text-sm text-gray-3">
            Panel de gestión fitosanitaria del café
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-semibold text-black-2"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ayni.pe"
              className="h-11 w-full rounded-xl border border-gray-5 bg-gray-5 px-4 text-base text-black-2 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-semibold text-black-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-gray-5 bg-gray-5 px-4 text-base text-black-2 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-error/10 px-4 py-2 text-sm text-error"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="press focus-ring h-11 w-full rounded-xl bg-primary text-base font-semibold text-white transition-opacity disabled:opacity-60"
          >
            {loading ? "Ingresando…" : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </main>
  );
}
