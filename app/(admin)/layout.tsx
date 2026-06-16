import type { ReactNode } from "react";
import { Header } from "@/components/admin/header";
import { Sidebar } from "@/components/admin/sidebar";
import { AuthGuard } from "@/components/admin/auth-guard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-5">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
