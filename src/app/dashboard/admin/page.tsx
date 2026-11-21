"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Store,
  UserCheck,
  Layers,
  Clock,
  Receipt,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { getAdminOverview } from "@/lib/api/admin-overview-api";
import type { AdminOverviewStats } from "@/types/admin-overview";

export default function AdminDashboardPage() {
  const { data: session } = authClient.useSession();

  const userName = session?.user?.name || "Administrator";
  const userImage = session?.user?.image;
  const userInitial = userName.charAt(0).toUpperCase();

  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch overview stats from API
  const loadStats = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await getAdminOverview();
      setStats(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load admin overview statistics";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    getAdminOverview()
      .then((data) => {
        if (!ignore) {
          setStats(data);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load admin overview statistics";
          setError(message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Card definitions
  const statCards = [
    {
      title: "Total Users",
      value: stats ? (stats.totalUsers ?? 0) : 0,
      description: "Registered customers, vendors, and admins",
      href: "/dashboard/admin/users",
      actionLabel: "Manage Users",
      icon: Users,
      iconBg: "bg-primary/10 text-primary",
      accentBorder: "group-hover:border-primary/40",
      shadow: "group-hover:shadow-primary/5",
    },
    {
      title: "Total Vendors",
      value: stats ? (stats.totalVendors ?? 0) : 0,
      description: "Service providers listing wedding offerings",
      href: "/dashboard/admin/users?role=vendor",
      actionLabel: "View Vendors",
      icon: Store,
      iconBg: "bg-rose-500/10 text-rose-600",
      accentBorder: "group-hover:border-rose-400/40",
      shadow: "group-hover:shadow-rose-500/5",
    },
    {
      title: "Total Customers",
      value: stats ? (stats.totalCustomers ?? 0) : 0,
      description: "Couples and clients planning weddings",
      href: "/dashboard/admin/users?role=customer",
      actionLabel: "View Customers",
      icon: UserCheck,
      iconBg: "bg-blue-500/10 text-blue-600",
      accentBorder: "group-hover:border-blue-400/40",
      shadow: "group-hover:shadow-blue-500/5",
    },
    {
      title: "Total Services",
      value: stats ? (stats.totalServices ?? 0) : 0,
      description: "Approved, pending, and inactive listings",
      href: "/dashboard/admin/services",
      actionLabel: "Manage Services",
      icon: Layers,
      iconBg: "bg-amber-500/10 text-amber-600",
      accentBorder: "group-hover:border-amber-400/40",
      shadow: "group-hover:shadow-amber-500/5",
    },
    {
      title: "Pending Services",
      value: stats ? (stats.pendingServices ?? 0) : 0,
      description: "Submissions awaiting administrator approval",
      href: "/dashboard/admin/services?status=pending",
      actionLabel: "Review Submissions",
      icon: Clock,
      iconBg: "bg-orange-500/10 text-orange-600",
      accentBorder: "group-hover:border-orange-400/40",
      shadow: "group-hover:shadow-orange-500/5",
      isPendingBadge: Boolean(stats && stats.pendingServices > 0),
    },
    {
      title: "Total Transactions",
      value: stats ? (stats.totalTransactions ?? 0) : 0,
      description: "Processed vendor subscription records",
      href: "/dashboard/admin/transactions",
      actionLabel: "View Transactions",
      icon: Receipt,
      iconBg: "bg-emerald-500/10 text-emerald-600",
      accentBorder: "group-hover:border-emerald-400/40",
      shadow: "group-hover:shadow-emerald-500/5",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ═══════════ WELCOME BANNER ═══════════ */}
      <header className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card via-card to-secondary/30 p-6 shadow-sm sm:p-8">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-56 rounded-full bg-primary/[0.06] blur-3xl" />

        {/* Dot pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            {/* Admin Avatar */}
            <div className="relative shrink-0">
              <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-2xl border-2 border-card bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 ring-1 ring-border/50 sm:size-20">
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt={`${userName}'s profile`}
                    referrerPolicy="no-referrer"
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
                    {userInitial}
                  </span>
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-[3px] border-card bg-emerald-500 shadow-sm">
                <ShieldCheck className="size-3 text-white" />
              </span>
            </div>

            {/* Welcome Text */}
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/50 bg-zinc-900 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-100 shadow-sm">
                  <Sparkles className="size-3 text-accent" />
                  Administrator Access
                </span>
              </div>

              <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                Welcome back, <span className="text-primary">{userName}</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                Here is your live overview of platform users, vendor services,
                pending approvals, and subscription transactions.
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <Button
            type="button"
            onClick={() => loadStats(true)}
            disabled={isLoading || isRefreshing}
            className="group h-11 shrink-0 gap-2 self-start rounded-full bg-card px-5 text-sm font-semibold text-foreground shadow-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/40 sm:self-auto"
          >
            <RefreshCw
              className={`size-4 text-primary transition-transform duration-500 ${
                isRefreshing ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
          </Button>
        </div>
      </header>

      {/* ═══════════ ERROR STATE ═══════════ */}
      {error && !isLoading && (
        <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center sm:p-10">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-sm">
            <AlertCircle className="size-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold text-foreground">
              Failed to load statistics
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">{error}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadStats()}
            className="mt-2 rounded-full border-destructive/30 px-6 text-xs font-semibold text-destructive shadow-sm hover:bg-destructive/10"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* ═══════════ LOADING SKELETON ═══════════ */}
      {isLoading && (
        <div className="grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between space-y-5 rounded-3xl border border-border/60 bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-20 rounded-md bg-muted/60" />
                  <div className="h-10 w-24 rounded-md bg-muted/80" />
                </div>
                <div className="size-12 rounded-2xl bg-muted/50" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full rounded bg-muted/50" />
                <div className="flex items-center justify-between border-t border-border/40 pt-4">
                  <div className="h-3 w-24 rounded bg-muted/50" />
                  <div className="size-4 rounded-full bg-muted/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════ STATS GRID ═══════════ */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${card.accentBorder} ${card.shadow}`}
              >
                {/* Subtle hover gradient background */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative">
                  {/* Top: Title & Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {card.title}
                      </span>
                      <div className="mt-2 flex items-center gap-2.5">
                        <span className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                          {card.value.toLocaleString()}
                        </span>
                        {card.isPendingBadge && (
                          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-500/20">
                            <Clock className="size-3" />
                            Action Needed
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${card.iconBg}`}
                    >
                      <Icon className="size-5" />
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                    {card.description}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="relative mt-6 flex items-center justify-between border-t border-border/60 pt-4 text-xs font-semibold text-foreground/80 transition-colors group-hover:text-primary">
                  <span>{card.actionLabel}</span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted/50 transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
