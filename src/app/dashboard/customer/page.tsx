"use client";

import Link from "next/link";
import { Heart, Search, Calendar, Sparkles } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardPage() {
  const { data: session } = authClient.useSession();
  const userName = session?.user?.name || "Customer";

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card to-accent/10 p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-[#8C6B28]">
                <Heart className="size-3 fill-[#8C6B28]" />
                Customer Dashboard
              </span>
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome, {userName}
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Track your wedding service bookings, explore talented vendors, and organize the celebration of your dreams.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="rounded-full shadow-md shadow-primary/20"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              <Search className="mr-2 size-4" />
              Browse Wedding Services
            </Button>
          </div>
        </div>

        {/* Decorative background accent */}
        <div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-primary/10 blur-2xl" />
      </div>

      {/* Visual Placeholder Grid for Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total Bookings", desc: "All requested service bookings", icon: Calendar },
          { label: "Pending Requests", desc: "Awaiting vendor confirmation", icon: Sparkles },
          { label: "Confirmed Bookings", desc: "Accepted and scheduled services", icon: Heart },
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
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent/20 text-[#8C6B28]">
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
        <Heart className="mx-auto size-8 text-accent" />
        <h2 className="mt-3 font-heading text-lg font-semibold text-foreground">
          My Wedding Journey
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-xs text-muted-foreground">
          Your booking history and details will appear here as soon as you request bookings from vendors. Booking management functionality will be connected in subsequent steps.
        </p>
      </div>
    </div>
  );
}
