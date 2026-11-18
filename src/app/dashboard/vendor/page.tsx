"use client";

import Link from "next/link";
import { PlusCircle, Store, Sparkles, Calendar, Layers } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function VendorDashboardPage() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Vendor";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary/5 p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <Store className="size-3" />
                Vendor Dashboard
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome, {userName}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Manage your wedding services, track booking requests, and grow your wedding business from this dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="rounded-full shadow-md shadow-primary/20"
              nativeButton={false}
              render={<Link href="/dashboard/vendor/add-service" />}
            >
              <PlusCircle className="mr-2 size-4" />
              Add New Service
            </Button>
          </div>
        </div>

        {/* Decorative background accent */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-accent/10 blur-2xl" />
      </div>

      {/* Visual Placeholder Grid for Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Services", desc: "Published and pending listings", icon: Layers },
          { label: "Active Services", desc: "Live services visible to clients", icon: Store },
          { label: "Booking Requests", desc: "Pending and confirmed bookings", icon: Calendar },
          { label: "Subscription Status", desc: "Current plan & active quota", icon: Sparkles },
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
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
        <Store className="mx-auto size-8 text-primary/60" />
        <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
          Vendor Services & Bookings Workspace
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground">
          Detailed metrics, booking management, and subscription management are scheduled for implementation in the next steps. You can add new services using the Add Service button above.
        </p>
      </div>
    </div>
  );
}
