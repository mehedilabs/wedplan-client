"use client";

import { type ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  DashboardSidebar,
  type Role,
} from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";
import DashboardRouteGuard from "@/components/dashboard/dashboard-route-guard";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const rawRole = (user as { role?: string } | undefined)?.role;
  const role: Role | null =
    rawRole === "admin" || rawRole === "vendor" || rawRole === "customer"
      ? rawRole
      : null;

  const isDashboardHidden = isPending || !user || !role;

  return (
    <>
      <DashboardRouteGuard role={role} isPending={isPending} hasUser={!!user} />

      {isDashboardHidden && (
        <DashboardLoader
          fullScreen
          title={isPending ? "Verifying your access" : "Redirecting to sign in"}
          description={
            isPending
              ? "Hang tight while we get your dashboard ready."
              : "Please sign in to continue."
          }
        />
      )}

      {!isDashboardHidden && (
        <SidebarProvider defaultOpen={true}>
          <DashboardSidebar role={role!} user={user!} />

          <SidebarInset className="flex min-h-svh flex-1 flex-col bg-muted/30">
            <DashboardHeader role={role!} user={user!} />

            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      )}
    </>
  );
}
