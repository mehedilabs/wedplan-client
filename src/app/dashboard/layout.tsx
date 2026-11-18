"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  DashboardSidebar,
  type Role,
} from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";

// Pathname dekhe bola jay ei route kon role-er jonno
function getRequiredRole(pathname: string): Role | null {
  if (pathname.startsWith("/dashboard/vendor")) return "vendor";
  if (pathname.startsWith("/dashboard/customer")) return "customer";
  if (pathname.startsWith("/dashboard/admin")) return "admin";
  return null;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const role = ((user as { role?: string } | undefined)?.role ||
    "customer") as Role;

  const requiredRole = getRequiredRole(pathname);
  const isRoleMismatch = requiredRole !== null && requiredRole !== role;

  // Frontend role guard: onno role-er dashboard ba unauthenticated access ber kore dao
  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (isRoleMismatch) {
      router.replace(`/dashboard/${role}`);
    }
  }, [user, role, isPending, isRoleMismatch, router]);

  if (isPending) {
    return (
      <DashboardLoader
        fullScreen
        title="Verifying your access"
        description="Hang tight while we get your dashboard ready."
      />
    );
  }

  // Redirect hocche, tai unauthorized content jhalke uthbe na
  if (!user) {
    return (
      <DashboardLoader
        fullScreen
        title="Redirecting to sign in"
        description="Please sign in to continue."
      />
    );
  }

  if (isRoleMismatch) {
    return (
      <DashboardLoader
        fullScreen
        title="Taking you to your dashboard"
        description="That page belongs to a different account type."
      />
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar role={role} user={user} />

      <SidebarInset className="flex min-h-svh flex-1 flex-col bg-muted/30">
        <DashboardHeader role={role} user={user} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
