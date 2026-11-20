"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Store,
  Sparkles,
  Calendar,
  Layers,
  RefreshCw,
  TrendingUp,
  ArrowUpRight,
  Crown,
  Clock,
  CheckCircle2,
  Zap,
  ChevronRight,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getVendorServices } from "@/lib/api/service-api";
import { getVendorBookings } from "@/lib/api/booking-api";
import { getVendorSubscription } from "@/lib/api/payment-api";

interface DashboardStats {
  totalServices: number;
  activeServices: number;
  pendingBookings: number;
  subscriptionPlan: "free" | "premium";
}

export default function VendorDashboardPage() {
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id;
  const userName = session?.user?.name || "Vendor";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image;

  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeServices: 0,
    pendingBookings: 0,
    subscriptionPlan: "free",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [services, bookings, subscription] = await Promise.all([
          getVendorServices(userId),
          getVendorBookings(userId),
          getVendorSubscription(),
        ]);

        if (!isMounted) return;

        setStats({
          totalServices: services.length,
          activeServices: services.filter(
            (service) => service.status === "approved" && service.isActive,
          ).length,
          pendingBookings: bookings.filter(
            (booking) => booking.status === "pending",
          ).length,
          subscriptionPlan: subscription.plan,
        });
      } catch (err) {
        if (!isMounted) return;

        console.error("Vendor dashboard data loading failed:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard information.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const isPremium = stats.subscriptionPlan === "premium";

  const dashboardCards = [
    {
      label: "Total Services",
      value: stats.totalServices,
      description: "All your service listings",
      icon: Layers,
      href: "/dashboard/vendor/services",
      iconStyle: "bg-primary/10 text-primary",
    },
    {
      label: "Active Services",
      value: stats.activeServices,
      description: "Approved and active listings",
      icon: Store,
      href: "/dashboard/vendor/services",
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Pending Requests",
      value: stats.pendingBookings,
      description: "Bookings awaiting your response",
      icon: Calendar,
      href: "/dashboard/vendor/bookings",
      iconStyle: "bg-accent/20 text-accent-foreground",
    },
    {
      label: "Subscription",
      value: isPremium ? "Premium" : "Free",
      description: isPremium
        ? "You're on the premium plan"
        : "Explore premium benefits",
      icon: isPremium ? Crown : Sparkles,
      href: "/dashboard/vendor/subscription",
      iconStyle: "bg-primary/10 text-primary",
    },
  ];

  const quickActions = [
    {
      title: "Add New Service",
      description: "List a new wedding service",
      icon: PlusCircle,
      href: "/dashboard/vendor/add-service",
      iconStyle: "bg-primary/10 text-primary",
    },
    {
      title: "Manage Bookings",
      description:
        stats.pendingBookings > 0
          ? `${stats.pendingBookings} pending request${stats.pendingBookings > 1 ? "s" : ""}`
          : "Check your booking requests",
      icon: Calendar,
      href: "/dashboard/vendor/bookings",
      iconStyle: "bg-accent/20 text-accent-foreground",
    },
    {
      title: "Manage Services",
      description: "Edit or update your listings",
      icon: Store,
      href: "/dashboard/vendor/services",
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      title: isPremium ? "Manage Subscription" : "Upgrade Plan",
      description: isPremium
        ? "View your premium benefits"
        : "Explore premium features",
      icon: Crown,
      href: "/dashboard/vendor/subscription",
      iconStyle: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/[0.07] p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="relative size-14 shrink-0 sm:size-16">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userImage}
                  alt={`${userName}'s profile`}
                  referrerPolicy="no-referrer"
                  className="size-full rounded-2xl border border-border object-cover shadow-lg"
                />
              ) : (
                <div className="flex size-full items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-lg sm:text-2xl">
                  {userInitial}
                </div>
              )}

              <span className="absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-card bg-emerald-500" />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  <Store className="size-3" />
                  Vendor Dashboard
                </span>

                {isPremium && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-foreground">
                    <Crown className="size-3" />
                    Premium Member
                  </span>
                )}
              </div>

              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back, {userName}
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Manage your wedding services, track booking requests, and grow
                your business — all from one place.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="rounded-full shadow-md shadow-primary/15"
              nativeButton={false}
              render={<Link href="/dashboard/vendor/add-service" />}
            >
              <PlusCircle className="mr-2 size-4" />
              Add New Service
            </Button>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-destructive">{error}</p>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Statistics Cards */}
      <section>
        <div className="mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Dashboard Overview
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A quick look at your business performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardCards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </span>

                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
                  >
                    <Icon className="size-5" />
                  </span>
                </div>

                <div className="mt-4">
                  {isLoading ? (
                    <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
                  ) : (
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                      {item.value}
                    </p>
                  )}

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>

                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Actions and Business Insights */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-xl border border-border/70 bg-card p-5 shadow-xs sm:p-6 lg:col-span-2">
          <div className="mb-5">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <Zap className="size-4 text-primary" />
              Quick Actions
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Shortcuts to your most-used dashboard features
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-background/50 p-3.5 transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${action.iconStyle}`}
                  >
                    <Icon className="size-5" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-foreground">
                      {action.title}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </span>

                  <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Business Insights */}
        <div className="rounded-xl border border-border/70 bg-gradient-to-br from-card to-primary/[0.04] p-5 shadow-xs sm:p-6">
          <div className="mb-5">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
              <TrendingUp className="size-4 text-primary" />
              Business Insights
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              A snapshot of your current activity
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 p-3">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                Active Listings
              </span>

              <span className="text-sm font-bold text-foreground">
                {isLoading ? "—" : stats.activeServices}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 p-3">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Clock className="size-4 text-accent-foreground" />
                Awaiting Response
              </span>

              <span className="text-sm font-bold text-foreground">
                {isLoading ? "—" : stats.pendingBookings}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/60 p-3">
              <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Layers className="size-4 text-primary" />
                Total Listings
              </span>

              <span className="text-sm font-bold text-foreground">
                {isLoading ? "—" : stats.totalServices}
              </span>
            </div>

            {!isLoading && stats.totalServices > 0 && (
              <div className="rounded-lg border border-border/50 bg-background/60 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">
                    Active Service Ratio
                  </span>

                  <span className="font-semibold text-foreground">
                    {Math.round(
                      (stats.activeServices / stats.totalServices) * 100,
                    )}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${(stats.activeServices / stats.totalServices) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] via-card to-accent/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-accent/20 blur-2xl" />

        <div className="relative flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Sparkles className="size-5" />
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Make Your Business Stand Out
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Keep your services updated and respond to booking requests
                promptly to build trust with your customers.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="shrink-0 rounded-full bg-background/70"
            nativeButton={false}
            render={<Link href="/dashboard/vendor/services" />}
          >
            Manage My Services
            <ChevronRight className="ml-1.5 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
