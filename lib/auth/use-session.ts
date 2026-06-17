"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/lib/api/auth";
import { clearSession, getUser, type SessionUser } from "./session";

/**
 * Hook de sesión para componentes cliente (header, guard).
 * Lee el usuario de localStorage tras montar (evita desajustes de hidratación SSR).
 */
export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setUser(getUser());
    setReady(true);
  }, []);

  async function logout() {
    await authService.logout();
    clearSession();
    queryClient.clear();
    router.replace("/login");
  }

  return { user, ready, logout };
}
