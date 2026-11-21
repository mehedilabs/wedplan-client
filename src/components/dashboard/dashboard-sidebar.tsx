"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Heart,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  CalendarCheck,
  Crown,
  Settings,
  CalendarDays,
  Users,
  Layers,
  Receipt,
  Sparkles,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

export type Role = "vendor" | "customer" | "admin";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  isPlaceholder?: boolean;
}

const roleMenus: Record<Role, { label: string; items: NavItem[] }> = {
  vendor: {
    label: "Vendor Portal",
    items: [
      { title: "Overview", href: "/dashboard/vendor", icon: LayoutDashboard },
      {
        title: "My Services",
        href: "/dashboard/vendor/services",
        icon: Briefcase,
      },
      {
        title: "Add Service",
        href: "/dashboard/vendor/add-service",
        icon: PlusCircle,
      },
      {
        title: "Booking Requests",
        href: "/dashboard/vendor/bookings",
        icon: CalendarCheck,
      },
      {
        title: "Subscription",
        href: "/dashboard/vendor/subscription",
        icon: Crown,
      },
      {
        title: "Profile Settings",
        href: "/dashboard/vendor/profile",
        icon: Settings,
      },
    ],
  },
  customer: {
    label: "Customer Portal",
    items: [
      { title: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      {
        title: "My Bookings",
        href: "/dashboard/customer/bookings",
        icon: CalendarDays,
      },
      {
        title: "Profile Settings",
        href: "/dashboard/customer/profile",
        icon: Settings,
      },
    ],
  },
  admin: {
    label: "Admin Portal",
    items: [
      { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
      { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
      {
        title: "Manage Services",
        href: "/dashboard/admin/services",
        icon: Layers,
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: Receipt,
      },
      {
        title: "Profile Settings",
        href: "/dashboard/admin/profile",
        icon: Settings,
      },
    ],
  },
};

const roleBadges: Record<
  Role,
  { label: string; className: string; icon: LucideIcon }
> = {
  vendor: {
    label: "Vendor",
    className: "bg-primary/10 text-primary border-primary/25",
    icon: Briefcase,
  },
  customer: {
    label: "Customer",
    className: "bg-accent/15 text-accent-foreground border-accent/30",
    icon: Heart,
  },
  admin: {
    label: "Admin",
    className: "bg-zinc-900 text-zinc-100 border-zinc-700",
    icon: Sparkles,
  },
};

interface DashboardSidebarProps {
  role?: string;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export function DashboardSidebar({
  role = "customer",
  user,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const validatedRole: Role =
    role === "vendor" || role === "admin" ? role : "customer";

  const currentMenu = roleMenus[validatedRole];
  const roleBadge = roleBadges[validatedRole];
  const RoleIcon = roleBadge.icon;

  const handlePlaceholderClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    toast.add({
      title,
      description: `${title} is scheduled for implementation in the next phase.`,
      type: "info",
    });
  };

  const isItemActive = (href: string) => {
    if (href === `/dashboard/${validatedRole}`) return pathname === href;
    return pathname.startsWith(href);
  };

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/60 bg-background text-foreground"
    >
      {/* ═══════════ BRAND HEADER ═══════════ */}
      <SidebarHeader className="border-b border-border/60 px-4 py-5">
        <Link
          href="/"
          className="group/logo flex items-center gap-3 rounded-xl transition-opacity hover:opacity-90"
        >
          {/* Logo Icon */}
          <span className="relative flex size-11 shrink-0 items-center justify-center">
            {/* Soft Gold aura */}
            <span className="absolute inset-0 rounded-full bg-accent/30 blur-md transition-all duration-500 group-hover/logo:bg-accent/50 group-hover/logo:blur-lg" />

            {/* Burgundy Circle — Matches Screenshot */}
            <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-full bg-primary shadow-md ring-1 ring-primary/20">
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/logo:translate-x-full" />
              <Heart className="relative size-5 fill-white text-white" />
            </span>
          </span>

          {/* Logo Text */}
          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            {/* 
              FIX: Added "text-foreground" and "text-primary" directly 
              so it NEVER inherits white color from active menu state 
            */}
            <span className="font-heading text-[26px] font-bold leading-none tracking-tight text-foreground">
              Wed<span className="text-primary">Plan</span>
            </span>

            {/* Subtitle with Gold Underline */}
            <div className="mt-1.5 flex flex-col items-center">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Admin Portal
              </span>
              {/* Gold Accent Underline */}
              <span className="mt-1 h-[2px] w-12 bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />
            </div>
          </div>
        </Link>
      </SidebarHeader>

      {/* ═══════════ MAIN NAVIGATION ═══════════ */}
      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {currentMenu.items.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;

                // Premium Card Style (Matches your screenshot)
                const sharedClassName = cn(
                  "group/item relative flex h-[52px] items-center gap-3.5 rounded-2xl px-3 text-sm transition-all duration-300",
                  active
                    ? "bg-card text-foreground font-semibold shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] ring-1 ring-border/50"
                    : "text-muted-foreground font-medium hover:bg-card hover:text-foreground hover:shadow-sm",
                );

                const content = (
                  <>
                    {/* Gold Accent Line for Active Item */}
                    {active && (
                      <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_8px_rgba(197,161,90,0.6)]" />
                    )}

                    {/* Clean Icon (No background box) */}
                    <Icon
                      className={cn(
                        "size-5 shrink-0 transition-colors duration-300",
                        active
                          ? "text-foreground"
                          : "text-muted-foreground/70 group-hover/item:text-foreground",
                      )}
                      strokeWidth={active ? 2.2 : 1.8}
                    />

                    <span className="truncate">{item.title}</span>
                  </>
                );

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.isPlaceholder ? (
                      <SidebarMenuButton
                        onClick={(e) => handlePlaceholderClick(e, item.title)}
                        tooltip={item.title}
                        className={sharedClassName}
                      >
                        {content}
                        <SidebarMenuBadge className="ml-auto rounded-md border border-border/60 bg-muted px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
                          Soon
                        </SidebarMenuBadge>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                        className={sharedClassName}
                      >
                        {content}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="mx-4 bg-border/60" />

      {/* ═══════════ PROFILE FOOTER ═══════════ */}
      <SidebarFooter className="p-4">
        <div className="relative overflow-hidden rounded-[1.25rem] border border-border/60 bg-card p-3 shadow-sm">
          <div className="relative flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User profile"}
                  referrerPolicy="no-referrer"
                  className="size-10 rounded-full object-cover shadow-sm ring-2 ring-background ring-offset-2 ring-offset-primary/20"
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm ring-2 ring-background ring-offset-2 ring-offset-primary/20">
                  {userInitial}
                </span>
              )}
            </div>

            {/* User info */}
            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-[13px] font-bold text-foreground">
                {user?.name || "WedPlan User"}
              </span>
              <span className="truncate text-[11px] font-medium text-muted-foreground">
                {user?.email || "user@wedplan.com"}
              </span>
            </div>
          </div>

          {/* Role badge */}
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/50 pt-3 group-data-[collapsible=icon]:hidden">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                roleBadge.className,
              )}
            >
              <RoleIcon className="size-2.5" />
              {roleBadge.label}
            </span>

            <Link
              href={`/dashboard/${validatedRole}/profile`}
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground transition hover:text-primary"
              aria-label="Profile settings"
            >
              Profile
              <ChevronRight className="size-3" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
