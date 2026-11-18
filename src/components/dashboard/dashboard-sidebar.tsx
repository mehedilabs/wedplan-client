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
      {
        title: "Overview",
        href: "/dashboard/vendor",
        icon: LayoutDashboard,
        isPlaceholder: false,
      },
      {
        title: "My Services",
        href: "/dashboard/vendor/services",
        icon: Briefcase,
        isPlaceholder: true,
      },
      {
        title: "Add Service",
        href: "/dashboard/vendor/add-service",
        icon: PlusCircle,
        isPlaceholder: false,
      },
      {
        title: "Booking Requests",
        href: "/dashboard/vendor/bookings",
        icon: CalendarCheck,
        isPlaceholder: true,
      },
      {
        title: "Subscription",
        href: "/dashboard/vendor/subscription",
        icon: Crown,
        isPlaceholder: true,
      },
      {
        title: "Profile Settings",
        href: "/dashboard/vendor/profile",
        icon: Settings,
        isPlaceholder: true,
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
        isPlaceholder: false,
      },
      {
        title: "My Bookings",
        href: "/dashboard/customer/bookings",
        icon: CalendarDays,
        isPlaceholder: true,
      },
      {
        title: "Profile Settings",
        href: "/dashboard/customer/profile",
        icon: Settings,
        isPlaceholder: true,
      },
    ],
  },
  admin: {
    label: "Admin Portal",
    items: [
      {
        title: "Overview",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
        isPlaceholder: false,
      },
      {
        title: "Manage Users",
        href: "/dashboard/admin/users",
        icon: Users,
        isPlaceholder: true,
      },
      {
        title: "Manage Services",
        href: "/dashboard/admin/services",
        icon: Layers,
        isPlaceholder: true,
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
        icon: Receipt,
        isPlaceholder: true,
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

export function DashboardSidebar({ role = "customer", user }: DashboardSidebarProps) {
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

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } catch {
      toast.add({
        title: "Sign out failed",
        description: "Please try again.",
        type: "error",
      });
    }
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
      className="border-r border-border bg-sidebar text-sidebar-foreground"
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b border-border/70 p-4">
        <Link
          href={`/dashboard/${validatedRole}`}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/30">
            <Heart className="size-5 fill-primary-foreground text-primary-foreground" />
          </span>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-xl font-bold tracking-tight text-foreground">
              Wed<span className="text-primary">Plan</span>
            </span>
            <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {currentMenu.label}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground group-data-[collapsible=icon]:hidden">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
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
                          "cursor-pointer rounded-xl font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                        <SidebarMenuBadge className="rounded-full bg-muted/80 px-1.5 py-0.5 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
                          Soon
                        </SidebarMenuBadge>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                        className={cn(
                          "rounded-xl font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                            : "text-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Portal Switch / Website Link */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground group-data-[collapsible=icon]:hidden">
            Shortcuts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/" />}
                  tooltip="Back to Website"
                  className="rounded-xl text-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Globe className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">View Public Site</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* User Profile & Actions Footer */}
      <SidebarFooter className="p-3">
        <div className="flex flex-col gap-2">
          {/* User info card */}
          <div className="flex items-center gap-3 rounded-xl bg-background/80 p-2.5 border border-border/80">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || "User profile"}
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs font-semibold text-foreground">
                {user?.name || "WedPlan User"}
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                {user?.email || "user@wedplan.com"}
              </span>
              <span
                className={cn(
                  "mt-1 w-fit inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none",
                  roleBadge.className,
                )}
              >
                <Sparkles className="size-2.5" />
                {roleBadge.label}
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer group-data-[collapsible=icon]:justify-center"
            title="Sign Out"
          >
            <LogOut className="size-4 shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
