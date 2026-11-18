"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
  role?: string;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
}

export function DashboardHeader({ role = "customer", user }: DashboardHeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/add-service")) return "Add New Service";
    if (pathname.includes("/services")) return "My Services";
    if (pathname.includes("/bookings")) return "Booking Requests";
    if (pathname.includes("/subscription")) return "Subscription Plans";
    if (pathname.includes("/users")) return "Manage Users";
    if (pathname.includes("/transactions")) return "Transactions";
    if (pathname.includes("/profile")) return "Profile Settings";
    return "Dashboard Overview";
  };

  const roleLabel =
    role === "vendor"
      ? "Vendor Portal"
      : role === "admin"
        ? "Admin Portal"
        : "Customer Portal";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md transition-[width,height] ease-linear sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 size-8 cursor-pointer text-foreground hover:bg-muted" />
        <Separator orientation="vertical" className="h-4" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {roleLabel}
          </span>
          <span className="hidden text-xs text-muted-foreground/60 sm:inline">/</span>
          <h1 className="text-sm font-semibold text-foreground">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:inline-flex"
        >
          <Globe className="size-3.5 text-primary" />
          <span>Website</span>
        </Link>

        {user?.name && (
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-2.5 py-1">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="max-w-28 truncate text-xs font-medium text-foreground sm:max-w-40">
              {user.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
