"use client";

import type { ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DashboardSidebar,
  type Role,
} from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardLoader } from "@/components/dashboard/dashboard-loader";
import DashboardRouteGuard from "@/components/dashboard/dashboard-route-guard";

function DashboardSidebarSkeleton() {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/60 bg-background"
    >
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-5">
        <div className="size-11 shrink-0 animate-pulse rounded-full bg-muted" />

        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:hidden">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-2 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="flex-1 space-y-5 px-3 py-6">
        <div className="mb-4 h-3 w-20 animate-pulse rounded bg-muted group-data-[collapsible=icon]:hidden" />

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex h-[52px] items-center gap-3.5 rounded-2xl px-3"
          >
            <div className="size-5 shrink-0 animate-pulse rounded bg-muted" />
            <div className="h-3 w-28 animate-pulse rounded bg-muted group-data-[collapsible=icon]:hidden" />
          </div>
        ))}
      </div>

      <div className="border-t border-border/60 p-4">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
          <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />

          <div className="flex flex-1 flex-col gap-2 group-data-[collapsible=icon]:hidden">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-2 w-28 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

function DashboardHeaderSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-4 px-3 sm:h-[72px] sm:px-5 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="size-10 shrink-0 animate-pulse rounded-xl bg-muted sm:size-11" />

          <div className="hidden h-9 w-px bg-border sm:block" />

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-muted sm:h-11 sm:w-24" />
          <div className="h-10 w-10 animate-pulse rounded-xl bg-muted sm:h-11 sm:w-40" />
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const rawRole = (user as { role?: string } | undefined)?.role;

  const role: Role | null =
    rawRole === "admin" || rawRole === "vendor" || rawRole === "customer"
      ? rawRole
      : null;

  const hasValidSession = !!user && !!role;
  const shouldShowRedirectLoader = !isPending && !hasValidSession;

  return (
    <>
      <DashboardRouteGuard role={role} isPending={isPending} hasUser={!!user} />

      <SidebarProvider defaultOpen={true}>
        {isPending ? (
          <DashboardSidebarSkeleton />
        ) : hasValidSession ? (
          <DashboardSidebar role={role!} user={user!} />
        ) : null}

        <SidebarInset className="flex min-h-svh flex-1 flex-col bg-muted/30">
          {isPending ? (
            <DashboardHeaderSkeleton />
          ) : hasValidSession ? (
            <DashboardHeader role={role!} user={user!} />
          ) : null}

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {isPending ? (
                <DashboardLoader
                  title="Preparing your dashboard"
                  description="Please wait while we verify your account."
                />
              ) : hasValidSession ? (
                children
              ) : null}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>

      {shouldShowRedirectLoader && (
        <DashboardLoader
          fullScreen
          title="Redirecting to sign in"
          description="Please sign in to continue."
        />
      )}
    </>
  );
}
