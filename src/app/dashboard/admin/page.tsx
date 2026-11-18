"use client";

import { Shield, Users, Layers, Receipt, Sparkles } from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Administrator";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card to-zinc-800/5 p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-100">
                <Shield className="size-3" />
                Admin Dashboard
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome, {userName}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Monitor platform metrics, manage user accounts, review vendor service submissions, and review transactions.
            </p>
          </div>
        </div>

        {/* Decorative background accent */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-2xl" />
      </div>

      {/* Visual Placeholder Grid for Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", desc: "Registered customers and vendors", icon: Users },
          { label: "Platform Services", desc: "Submitted, active and pending", icon: Layers },
          { label: "Pending Approvals", desc: "Services waiting for admin review", icon: Sparkles },
          { label: "Transactions", desc: "Processed vendor subscriptions", icon: Receipt },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
                  <Icon className="size-4" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-foreground">--</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Info Box */}
      <div className="rounded-xl border border-dashed border-border bg-card/60 p-6 text-center sm:p-8">
        <Shield className="mx-auto size-8 text-zinc-700" />
        <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
          Platform Administration Center
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground">
          User management, service approvals, and transaction tracking features will be connected in future development steps following the assignment requirements.
        </p>
      </div>
    </div>
  );
}
