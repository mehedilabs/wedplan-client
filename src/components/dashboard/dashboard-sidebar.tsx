"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Globe,
  LogOut,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
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
      {
        title: "Overview",
        href: "/dashboard/customer",
        icon: LayoutDashboard,
      },
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
      {
        title: "Manage Users",
        href: "/dashboard/admin/users",
        icon: Users,
      },
      {
        title: "Manage Services",
        href: "/dashboard/admin/services",
        icon: Layers,
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: Receipt,
        isPlaceholder: true,
      },
      {
        title: "Profile Settings",
        href: "/dashboard/admin/profile",
        icon: Settings,
      },
    ],
  },
};

const roleBadges: Record<Role, { label: string; className: string }> = {
  vendor: {
    label: "Vendor",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  customer: {
    label: "Customer",
    className: "bg-accent/20 text-[#8C6B28] border-accent/30",
  },
  admin: {
    label: "Administrator",
    className: "bg-zinc-800 text-zinc-100 border-zinc-700",
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
  const router = useRouter();

  const validatedRole: Role =
    role === "vendor" || role === "admin" ? role : "customer";

  const currentMenu = roleMenus[validatedRole];
  const roleBadge = roleBadges[validatedRole];

  const handlePlaceholderClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();

    toast.add({
      title,
      description: `${title} is scheduled for implementation in the next phase.`,
      type: "info",
    });
  };

  const isItemActive = (href: string) => {
    if (href === `/dashboard/${validatedRole}`) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/80 bg-sidebar text-sidebar-foreground"
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b border-border/70 px-4 py-5">
        <Link
          href={`/`}
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20 ring-1 ring-primary/10">
            <Heart className="size-5 fill-primary-foreground text-primary-foreground" />
          </span>

          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Wed<span className="text-primary">Plan</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {currentMenu.label}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-3 py-5">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground group-data-[collapsible=icon]:hidden">
            Main Menu
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {currentMenu.items.map((item) => {
                const active = isItemActive(item.href);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    {item.isPlaceholder ? (
                      <SidebarMenuButton
                        onClick={(e) => handlePlaceholderClick(e, item.title)}
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-11 rounded-xl px-3 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                            : "text-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="size-[18px] shrink-0" />
                        <span className="truncate">{item.title}</span>
                        <SidebarMenuBadge className="rounded-full border border-border/70 bg-background/80 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground group-data-[collapsible=icon]:hidden">
                          Soon
                        </SidebarMenuBadge>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "h-11 rounded-xl px-3 text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/15 hover:bg-primary/90 hover:text-primary-foreground"
                            : "text-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="size-[18px] shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Profile Footer */}
      <SidebarFooter className="p-3">
        <div className="rounded-2xl border border-border/80 bg-background/80 p-3 shadow-sm">
          <div className="flex items-center gap-3">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User profile"}
                referrerPolicy="no-referrer"
                className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-border"
              />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/10">
                {user?.name?.trim().charAt(0).toUpperCase() || "U"}
              </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-bold text-foreground">
                {user?.name || "WedPlan User"}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {user?.email || "user@wedplan.com"}
              </span>

              <span
                className={cn(
                  "mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-bold uppercase tracking-wide",
                  roleBadge.className,
                )}
              >
                <Sparkles className="size-3" />
                {roleBadge.label}
              </span>
            </div>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
