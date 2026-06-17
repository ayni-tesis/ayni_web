import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/lib/api/account";
import { updateSessionUser } from "@/lib/auth/session";

export const accountKeys = {
  all: ["account"] as const,
  me: () => [...accountKeys.all, "me"] as const,
};

export function useAccount() {
  return useQuery({
    queryKey: accountKeys.me(),
    queryFn: () => accountService.me(),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fullName: string) => accountService.updateProfile(fullName),
    onSuccess: (account) => {
      // Refleja el nuevo nombre en el header/sidebar sin re-login.
      updateSessionUser({ fullName: account.fullName });
      qc.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (vars: { currentPassword: string; newPassword: string }) =>
      accountService.changePassword(vars.currentPassword, vars.newPassword),
  });
}
