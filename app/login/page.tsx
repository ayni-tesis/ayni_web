"use client";

import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AyniMark } from "@/components/brand/ayni-mark";
import { LandscapeArt } from "@/components/brand/landscape-art";
import { authService } from "@/lib/api/auth";
import type { ApiError } from "@/lib/api/types";
import { setSession } from "@/lib/auth/session";
import { t } from "@/lib/i18n/es";

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
        setError(t.login.errors.forbidden);
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

  return (
    <main className="min-h-dvh grid lg:grid-cols-2 bg-cream">
      {/* Panel de marca (desktop) */}
      <section className="relative hidden lg:flex flex-col overflow-hidden bg-forest-deep p-s5 text-white">
        <div className="relative z-10">
          <BrandLockup />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md pb-s7">
          <p className="rise text-h1 leading-[1.02] tracking-tight">
            {t.brand.tagline}
          </p>
          <p className="rise mt-s3 text-md text-white/75 leading-relaxed">
            {t.brand.taglineBody}
          </p>
        </div>

        <LandscapeArt className="absolute inset-x-0 bottom-0 h-80 w-full" />
        <div className="relative z-10 flex items-end justify-between">
          <span className="text-2xs font-bold uppercase tracking-[0.3em] text-white/70">
            {t.brand.location}
          </span>
          <span className="text-2xs font-mono text-white/50">
            {t.brand.coords}
          </span>
        </div>
      </section>

      {/* Formulario */}
      <section className="flex flex-col">
        <div className="lg:hidden bg-forest-deep px-s3 py-s3 text-white">
          <BrandLockup />
        </div>

        <div className="flex-1 flex items-center justify-center p-s3 md:p-s5">
          <div className="rise w-full max-w-md bg-white rounded-3xl border border-gray-5 p-s4 md:p-s5">
            <h1 className="text-h5 font-bold text-black-2 tracking-tight">
              {t.login.title}
            </h1>
            <p className="mt-s1 text-sm text-gray-2 leading-relaxed">
              {t.login.subtitle}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-s4 flex flex-col gap-s2"
            >
              <div className="flex flex-col gap-s1">
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-black-2"
                >
                  {t.login.emailLabel}
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-3 pointer-events-none"
                    aria-hidden
                  />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.login.emailPlaceholder}
                    className="h-11 w-full rounded-xl border border-gray-5 bg-gray-5/40 pl-11 pr-4 text-base text-black-2 placeholder:text-gray-2 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-s1">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-black-2"
                >
                  {t.login.passwordLabel}
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-3 pointer-events-none"
                    aria-hidden
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.login.passwordPlaceholder}
                    className="h-11 w-full rounded-xl border border-gray-5 bg-gray-5/40 pl-11 pr-13 text-base text-black-2 placeholder:text-gray-2 outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? t.login.hidePassword : t.login.showPassword
                    }
                    className="press focus-ring absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full flex items-center justify-center text-gray-2 hover:bg-gray-5 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl bg-error-soft px-4 py-3"
                >
                  <AlertCircle
                    size={18}
                    className="text-severity-high shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <p className="text-sm text-black-2">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="press focus-ring h-11 w-full mt-s1 rounded-full bg-primary text-base font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading && (
                  <Loader2 size={18} className="animate-spin" aria-hidden />
                )}
                {loading ? t.login.submitting : t.login.submit}
              </button>
            </form>

            <div className="mt-s4 pt-s2 border-t border-gray-5">
              <p className="text-xs text-gray-2 leading-relaxed">
                {t.login.restricted}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandLockup() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-full bg-primary flex items-center justify-center shrink-0">
        <AyniMark size={26} background={null} fill="#fff" veinColor="#04A033" />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none tracking-tight">
          {t.brand.wordmark}
        </p>
        <p className="text-2xs font-bold uppercase tracking-[0.25em] text-white/50 mt-1">
          {t.brand.product}
        </p>
      </div>
    </div>
  );
}
