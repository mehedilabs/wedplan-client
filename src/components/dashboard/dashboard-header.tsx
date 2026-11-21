"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  role?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    businessName?: string | null;
  } | null;
}

export function DashboardHeader({
  role = "customer",
  user,
}: DashboardHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/admin/services")) return "Manage Services";
    if (pathname.includes("/add-service")) return "Add New Service";
    if (pathname.includes("/services")) return "My Services";
    if (pathname.includes("/bookings")) return "My Bookings";
    if (pathname.includes("/subscription")) return "Subscription Plans";
    if (pathname.includes("/users")) return "Manage Users";
    if (pathname.includes("/transactions")) return "Transactions";
    if (pathname.includes("/profile")) return "Profile Settings";

    return "Dashboard Overview";
  };

  const roleInfo = {
    vendor: {
      label: "Vendor Portal",
      badge: "border-primary/20 bg-primary/10 text-primary",
      dot: "bg-primary",
    },
    admin: {
      label: "Admin Portal",
      badge: "border-foreground/20 bg-foreground text-background",
      dot: "bg-accent",
    },
    customer: {
      label: "Customer Portal",
      badge: "border-accent/40 bg-accent/15 text-foreground",
      dot: "bg-accent",
    },
  }[role === "vendor" || role === "admin" ? role : "customer"];

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-3 px-3 sm:h-[72px] sm:gap-4 sm:px-5 lg:px-8">
        {/* ---------- Left: Sidebar trigger + page info ---------- */}
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          {/* ============ 🎯 SIDEBAR BUTTON + 2.5s PULSE ============ */}
          <div className="relative shrink-0">
            {/* 2.5s পর পর একবার pulse ring */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-xl bg-primary/40 opacity-0 [animation:pulse-ring_2.5s_ease-out_infinite]"
            />

            <SidebarTrigger
              aria-label="Toggle sidebar"
              className={cn(
                "relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl sm:size-11",
                "border border-border bg-card text-primary shadow-sm",
                "transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10",
                "active:translate-y-0 active:scale-95",
                "[&_svg]:size-5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              )}
            />
          </div>

          <div className="hidden h-9 w-px shrink-0 bg-gradient-to-b from-transparent via-border to-transparent sm:block" />

          <div className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5",
                  "text-[9px] font-bold uppercase tracking-[0.12em] sm:text-[10px]",
                  roleInfo.badge,
                )}
              >
                <span className={cn("size-1.5 rounded-full", roleInfo.dot)} />
                {roleInfo.label}
              </span>

              {role === "vendor" && user?.businessName && (
                <>
                  <ChevronRight className="hidden size-3 shrink-0 text-muted-foreground/60 sm:block" />
                  <span className="hidden max-w-[220px] truncate text-xs font-medium text-muted-foreground sm:block">
                    {user.businessName}
                  </span>
                </>
              )}
            </div>

            {/* Page title */}
            <h1 className="mt-0.5 truncate font-heading text-xl font-semibold leading-tight tracking-tight text-foreground sm:text-2xl">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* ---------- Right: Navigation ---------- */}
        <nav
          aria-label="Public website navigation"
          className="flex shrink-0 items-center gap-2"
        >
          <Link
            href="/"
            aria-label="Home"
            className={cn(
              "inline-flex size-10 items-center justify-center gap-2 rounded-xl sm:h-11 sm:w-auto sm:px-4",
              "border border-border bg-card text-sm font-semibold text-foreground shadow-sm",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary",
              "active:translate-y-0 active:scale-95",
            )}
          >
            <Home className="size-4 shrink-0" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/services"
            aria-label="Browse Services"
            className={cn(
              "inline-flex size-10 items-center justify-center gap-2 rounded-xl sm:h-11 sm:w-auto sm:px-4",
              "bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30",
              "active:translate-y-0 active:scale-95",
            )}
          >
            <Search className="size-4 shrink-0" />
            <span className="hidden sm:inline">Browse Services</span>
          </Link>
        </nav>
      </div>

      {/* Bottom gold accent line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
    </header>
  );
}
