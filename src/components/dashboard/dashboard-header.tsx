"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, LayoutDashboard, Home, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface DashboardHeaderProps {
  role?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function DashboardHeader({ role = "customer" }: DashboardHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
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
    },
    admin: {
      label: "Admin Portal",
      badge: "border-zinc-700 bg-zinc-800 text-white",
    },
    customer: {
      label: "Customer Portal",
      badge: "border-accent/30 bg-accent/15 text-[#8C6B28]",
    },
  }[role === "vendor" || role === "admin" ? role : "customer"];

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 shadow-[0_2px_15px_rgba(48,39,42,0.04)] backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1600px] flex-col justify-center",
          "gap-3 px-4 py-4",
          "sm:min-h-[76px] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-0",
          "lg:px-8",
        )}
      >
        {/* First Row: Sidebar + Page Information */}
        <div className="flex min-w-0 items-center gap-3 sm:flex-1 sm:gap-4">
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              "border border-primary/15 bg-gradient-to-br from-white to-primary/5",
              "text-primary shadow-[0_3px_12px_rgba(112,43,61,0.09)]",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/10",
              "active:translate-y-0 active:scale-95",
              "[&_svg]:size-5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "sm:size-12",
            )}
          />

          <div className="hidden h-10 w-px shrink-0 bg-border sm:block" />

          <div className="min-w-0 flex-1">
            {/* Breadcrumb */}
            <div className="mb-1 flex min-w-0 items-center gap-1.5">
              <span
                className={cn(
                  "hidden items-center rounded-full border px-2 py-0.5",
                  "text-[9px] font-bold uppercase tracking-[0.12em]",
                  "sm:inline-flex sm:text-[10px]",
                  roleInfo.badge,
                )}
              >
                {roleInfo.label}
              </span>

              <ChevronRight className="hidden size-3 shrink-0 text-muted-foreground/50 sm:block" />

              <span className="truncate text-[10px] font-medium text-muted-foreground sm:text-[11px]">
                {pageTitle}
              </span>
            </div>

            {/* Page Title */}
            <div className="flex min-w-0 items-center gap-2">
              <LayoutDashboard className="hidden size-[18px] shrink-0 text-primary/80 sm:block" />

              <h1 className="truncate font-heading text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl lg:text-2xl">
                {pageTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Second Row on Mobile / Right Navigation on Desktop */}
        <nav
          aria-label="Public website navigation"
          className="flex shrink-0 items-center justify-end gap-2 border-t border-border/60 pt-3 sm:justify-start sm:gap-2.5 sm:border-0 sm:pt-0"
        >
          <Link
            href="/"
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl",
              "border border-border/80 bg-card px-4",
              "text-xs font-semibold text-foreground shadow-sm",
              "transition-all duration-200",
              "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
              "active:scale-[0.98]",
              "sm:h-11 sm:px-4 sm:text-sm",
            )}
          >
            <Home className="size-4 shrink-0" />
            <span>Home</span>
          </Link>

          <Link
            href="/services"
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-xl",
              "border border-primary/15 bg-primary/5 px-4",
              "text-xs font-semibold text-primary shadow-sm",
              "transition-all duration-200",
              "hover:border-primary/30 hover:bg-primary/10",
              "active:scale-[0.98]",
              "sm:h-11 sm:px-4 sm:text-sm",
            )}
          >
            <Search className="size-4 shrink-0" />
            <span>Browse Services</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
