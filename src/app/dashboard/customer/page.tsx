"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ChevronRight,
  RefreshCw,
  ClipboardList,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getCustomerBookings } from "@/lib/api/booking-api";

interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export default function CustomerDashboardPage() {
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id;
  const userName = session?.user?.name || "Customer";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image;

  const [stats, setStats] = useState<BookingStats>({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
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

        const bookings = await getCustomerBookings(userId);

        if (!isMounted) return;

        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter(
            (booking) => booking.status === "pending",
          ).length,
          confirmedBookings: bookings.filter(
            (booking) => booking.status === "confirmed",
          ).length,
        });
      } catch (err) {
        if (!isMounted) return;

        console.error("Customer dashboard data loading failed:", err);

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

  const dashboardCards = [
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      description: "All your service bookings",
      icon: ClipboardList,
      href: "/dashboard/customer/bookings",
      iconStyle: "bg-primary/10 text-primary",
    },
    {
      label: "Pending Requests",
      value: stats.pendingBookings,
      description: "Awaiting vendor confirmation",
      icon: Clock,
      href: "/dashboard/customer/bookings",
      iconStyle: "bg-accent/20 text-accent-foreground",
    },
    {
      label: "Confirmed Bookings",
      value: stats.confirmedBookings,
      description: "Accepted by your vendors",
      icon: CheckCircle2,
      href: "/dashboard/customer/bookings",
      iconStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  const quickActions = [
    {
      title: "Browse Wedding Services",
      description: "Discover services for your special day",
      icon: Search,
      href: "/services",
      iconStyle: "bg-primary/10 text-primary",
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      icon: Calendar,
      href: "/dashboard/customer/bookings",
      iconStyle: "bg-accent/20 text-accent-foreground",
    },
    {
      title: "Explore Vendors",
      description: "Find talented wedding professionals",
      icon: Heart,
      href: "/services",
      iconStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
    {
      title: "Profile Settings",
      description: "Update your personal information",
      icon: Sparkles,
      href: "/dashboard/customer/profile",
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
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <Heart className="size-3 fill-current" />
                Customer Dashboard
              </span>

              <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back, {userName}
              </h1>

              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Track your wedding service bookings, explore talented vendors,
                and organize the celebration of your dreams.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="rounded-full shadow-md shadow-primary/15"
              nativeButton={false}
              render={<Link href="/services" />}
            >
              <Search className="mr-2 size-4" />
              Browse Services
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

      {/* Booking Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Booking Overview
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            A quick look at your wedding service bookings
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* Quick Actions */}
      <section className="rounded-xl border border-border/70 bg-card p-5 shadow-xs sm:p-6">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
            <Sparkles className="size-4 text-primary" />
            Quick Actions
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Shortcuts to your most-used customer features
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
      </section>

      {/* Booking Activity */}
      <section className="relative overflow-hidden rounded-xl border border-primary/15 bg-gradient-to-r from-primary/[0.06] via-card to-accent/10 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-accent/20 blur-2xl" />

        <div className="relative flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              {stats.totalBookings > 0 ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Heart className="size-5" />
              )}
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {stats.totalBookings > 0
                  ? "Your Wedding Journey Is in Progress"
                  : "Start Your Wedding Journey"}
              </h2>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {stats.totalBookings > 0
                  ? "Keep track of your bookings and stay updated with your vendors."
                  : "Discover wedding services and find the right vendors to make your special day memorable."}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="shrink-0 rounded-full bg-background/70"
            nativeButton={false}
            render={<Link href="/services" />}
          >
            Explore Services
            <ChevronRight className="ml-1.5 size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
