"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth/session";

/**
 * Protege las rutas del panel: si no hay sesión, redirige a /login.
 * Evita el "flash" del contenido admin mientras valida.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-5">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-3 border-t-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
