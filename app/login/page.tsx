"use client";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sprout,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AyniMark } from "@/components/brand/ayni-mark";
import { authService } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/types";
import { setSession } from "@/lib/auth/session";
import { t } from "@/lib/i18n/es";

/** Textura de grano sutil para romper la planitud del panel forest. */
const NOISE_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Lockup de marca: hoja-escudo AYNI + wordmark. */
function BrandLockup({ tone }: { tone: "forest" | "light" }) {
  const isForest = tone === "forest";
  return (
    <div className="flex items-center gap-3">
      <AyniMark
        size={40}
        fill="var(--color-primary)"
        veinColor="var(--color-cream)"
      />
      <span
        className={
          isForest
            ? "text-h6 tracking-tight text-cream"
            : "text-h6 tracking-tight text-black-2"
        }
      >
        {t.login.brandName}{" "}
        <span
          className={isForest ? "font-normal text-cream/55" : "font-normal text-gray-3"}
        >
          {t.login.brandSuffix}
        </span>
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        setError(t.login.errors.roleNotAllowed);
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
          ? t.login.errors.invalidCredentials
          : (apiErr?.message ?? t.login.errors.generic),
      );
      setLoading(false);
    }
  }

  const inputClass =
    "h-11 w-full rounded-xl border border-gray-5 bg-gray-5/50 text-base text-black-2 outline-none transition-colors placeholder:text-gray-3 hover:border-gray-4 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/40 disabled:opacity-60";

  return (
    <main className="grid min-h-[100dvh] bg-cream lg:grid-cols-[1.1fr_1fr]">
      {/* ── Panel de marca (solo desktop) ── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-forest px-s8 py-s7 text-cream lg:flex">
        {/* Ambiente verde sutil */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(110% 70% at 0% 0%, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 60%)",
          }}
        />
        {/* Grano para profundidad */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
          style={{ backgroundImage: NOISE_URL, backgroundSize: "180px 180px" }}
        />
        {/* Marca de agua de la hoja-escudo */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-12 opacity-[0.05]"
        >
          <AyniMark size={340} fill="var(--color-cream)" veinColor="var(--color-forest)" />
        </div>

        <div className="animate-rise relative">
          <BrandLockup tone="forest" />
        </div>

        <div className="animate-rise relative max-w-md" style={{ animationDelay: "80ms" }}>
          <h1 className="text-h3 text-balance leading-[1.05] tracking-tight">
            {t.login.panelTitle}
          </h1>
          <p className="mt-s3 text-pretty text-md text-cream/70">
            {t.login.panelMeaning}
          </p>

          <ul className="mt-s5 space-y-s2">
            {t.login.panelPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <Sprout className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                <span className="text-base text-cream/85">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p
          className="animate-rise relative text-sm font-bold tracking-wide text-cream/70"
          style={{ animationDelay: "160ms" }}
        >
          {t.login.panelTagline}
        </p>
      </aside>

      {/* ── Panel de formulario ── */}
      <section className="flex items-center justify-center px-6 py-s6 sm:px-s6">
        <div className="w-full max-w-md">
          {/* Wordmark en tablet/móvil (el panel de marca está oculto) */}
          <div className="animate-rise mb-s5 lg:hidden">
            <BrandLockup tone="light" />
          </div>

          <div
            className="animate-rise rounded-3xl border border-gray-5/70 bg-white p-8 shadow-[0_24px_60px_-24px_rgba(7,50,29,0.28)]"
            style={{ animationDelay: "120ms" }}
          >
            <h2 className="text-h5 text-black-2">{t.login.formTitle}</h2>
            <p className="mt-1 text-sm text-gray-2">{t.login.formSubtitle}</p>

            <form onSubmit={handleSubmit} className="mt-s5 space-y-s3" noValidate>
              {/* Correo */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-semibold text-black-2"
                >
                  {t.login.emailLabel}
                </label>
                <div className="relative">
                  <Mail
                    aria-hidden
                    className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-4"
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    disabled={loading}
                    aria-invalid={error != null}
                    aria-describedby={error ? "login-error" : undefined}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    className={`${inputClass} pl-11 pr-4`}
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-semibold text-black-2"
                >
                  {t.login.passwordLabel}
                </label>
                <div className="relative">
                  <Lock
                    aria-hidden
                    className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-4"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    aria-invalid={error != null}
                    aria-describedby={error ? "login-error" : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    className={`${inputClass} pl-11 pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    aria-label={
                      showPassword ? t.login.hidePassword : t.login.showPassword
                    }
                    aria-pressed={showPassword}
                    className="focus-ring press absolute right-1.5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-lg text-gray-3 transition-colors hover:text-gray-1 disabled:opacity-60"
                  >
                    {showPassword ? (
                      <EyeOff className="size-[18px]" aria-hidden />
                    ) : (
                      <Eye className="size-[18px]" aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  id="login-error"
                  role="alert"
                  className="flex items-start gap-2 rounded-xl bg-error/10 px-4 py-3 text-sm font-semibold text-error"
                >
                  <AlertCircle
                    className="mt-0.5 size-[18px] shrink-0"
                    aria-hidden
                  />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="focus-ring flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-bold text-white transition duration-200 hover:-translate-y-px hover:shadow-[0_12px_28px_-10px_rgba(4,160,51,0.5)] active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
              >
                {loading && (
                  <Loader2 className="size-[18px] animate-spin" aria-hidden />
                )}
                {loading ? t.login.submitting : t.login.submit}
              </button>
            </form>
          </div>

          <p
            className="animate-rise mt-s3 flex items-center justify-center gap-1.5 text-center text-sm text-gray-3"
            style={{ animationDelay: "220ms" }}
          >
            <ShieldCheck className="size-4 shrink-0" aria-hidden />
            {t.login.restricted}
          </p>
        </div>
      </section>
    </main>
  );
}
