"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar, type Role } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role as Role | undefined;

  // Frontend role guard: Ensure users cannot access another role's dashboard or unauthenticated routes
  useEffect(() => {
    if (isPending) return;

    // If not authenticated, redirect to login
    if (!user) {
      router.replace("/login");
      return;
    }

    const normalizedRole = userRole || "customer";

    // Check if current route matches authenticated role
    if (pathname.startsWith("/dashboard/vendor") && normalizedRole !== "vendor") {
      router.replace(`/dashboard/${normalizedRole}`);
      return;
    }

    if (pathname.startsWith("/dashboard/customer") && normalizedRole !== "customer") {
      router.replace(`/dashboard/${normalizedRole}`);
      return;
    }

    if (pathname.startsWith("/dashboard/admin") && normalizedRole !== "admin") {
      router.replace(`/dashboard/${normalizedRole}`);
      return;
    }
  }, [user, userRole, isPending, pathname, router]);

  // Loading state while checking authentication
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Verifying your dashboard access...
          </p>
        </div>
      </div>
    );
  }

  // If unauthenticated or role mismatching while redirecting, prevent flashing unauthorized content
  if (!user) {
    return null;
  }

  const normalizedRole = userRole || "customer";

  const isRoleMismatch =
    (pathname.startsWith("/dashboard/vendor") && normalizedRole !== "vendor") ||
    (pathname.startsWith("/dashboard/customer") && normalizedRole !== "customer") ||
    (pathname.startsWith("/dashboard/admin") && normalizedRole !== "admin");

  if (isRoleMismatch) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-5 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Redirecting to your authorized dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar role={normalizedRole} user={user} />
      <SidebarInset className="flex min-h-screen flex-1 flex-col bg-background">
        <DashboardHeader role={normalizedRole} user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
