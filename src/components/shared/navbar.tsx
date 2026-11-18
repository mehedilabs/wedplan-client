"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Ellipsis,
  Heart,
  Home,
  Store,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Settings,
  CalendarCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Browse Services", href: "/services", icon: Store },
];

function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-sm shadow-primary/30">
        <Heart className="size-5 fill-primary-foreground text-primary-foreground" />
      </span>

      <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
        Wed<span className="text-primary">Plan</span>
      </span>
    </span>
  );
}

function UserAvatar({
  image,
  name,
  size = "md",
}: {
  image?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-9 text-sm",
    lg: "size-11 text-base",
  }[size];

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name || "User profile"}
        referrerPolicy="no-referrer"
        className={cn(
          sizeClasses,
          "shrink-0 rounded-full object-cover ring-1 ring-border/80",
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        sizeClasses,
        "flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ring-1 ring-primary/20",
      )}
    >
      {name?.trim().charAt(0).toUpperCase() || "U"}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const desktopProfileRef = useRef<HTMLDetailsElement>(null);
  const mobileProfileRef = useRef<HTMLDetailsElement>(null);
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userRole = (user as { role?: string } | undefined)?.role;

  const roleNavLink = user
    ? {
        name:
          userRole === "vendor"
            ? "Vendor Hub"
            : userRole === "admin"
              ? "Admin Dashboard"
              : "My Bookings",
        href:
          userRole === "vendor"
            ? "/dashboard/vendor"
            : userRole === "admin"
              ? "/dashboard/admin"
              : "/dashboard/customer",
        icon:
          userRole === "vendor"
            ? LayoutDashboard
            : userRole === "admin"
              ? ShieldCheck
              : CalendarCheck,
      }
    : null;

  const navigationLinks = roleNavLink ? [...navLinks, roleNavLink] : navLinks;

  const roleLabel =
    userRole === "vendor"
      ? "Vendor"
      : userRole === "admin"
        ? "Admin"
        : "Customer";

  const roleBadgeClass =
    userRole === "vendor"
      ? "bg-primary/10 text-primary border-primary/20"
      : userRole === "admin"
        ? "bg-zinc-800 text-zinc-100 border-zinc-700"
        : "bg-accent/20 text-[#8C6B28] border-accent/30";

  const dashboardLabel =
    userRole === "vendor"
      ? "Vendor Hub"
      : userRole === "admin"
        ? "Admin Dashboard"
        : "Customer Dashboard";

  const dashboardHref =
    userRole === "vendor"
      ? "/dashboard/vendor"
      : userRole === "admin"
        ? "/dashboard/admin"
        : "/dashboard/customer";

  const firstName = user?.name ? user.name.trim().split(/\s+/)[0] : "User";

  const closeAllDropdowns = () => {
    desktopProfileRef.current?.removeAttribute("open");
    mobileProfileRef.current?.removeAttribute("open");
    mobileMenuRef.current?.removeAttribute("open");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;

      const dropdowns = [
        desktopProfileRef.current,
        mobileProfileRef.current,
        mobileMenuRef.current,
      ];

      dropdowns.forEach((dropdown) => {
        if (dropdown?.hasAttribute("open") && !dropdown.contains(target)) {
          dropdown.removeAttribute("open");
        }
      });
    };

    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Hide public navbar on dashboard routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleProfileSettings = () => {
    closeAllDropdowns();

    toast.add({
      title: "Profile Settings",
      description:
        "Profile management is scheduled for implementation in the next phase.",
      type: "info",
    });
  };

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setLogoutError(error.message || "Unable to sign out.");
        return;
      }

      closeAllDropdowns();
      router.replace("/");
      router.refresh();
    } catch {
      setLogoutError("Something went wrong. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/90 shadow-sm backdrop-blur-lg"
          : "border-transparent bg-background/70 backdrop-blur-md",
      )}
    >
      <nav
        className={cn(
          "mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between",
          "px-4 sm:px-6",
          "md:grid md:h-20 md:grid-cols-[1fr_auto_1fr]",
          "lg:px-8",
        )}
      >
        {/* Logo */}
        <Link href="/" aria-label="WedPlan home">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center justify-self-center gap-1 md:flex">
          {navigationLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center justify-self-end gap-2 md:flex">
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <details ref={desktopProfileRef} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-full border border-border bg-card/60 py-1.5 pl-2 pr-3.5 transition-all hover:border-primary/40 hover:bg-muted/60 [&::-webkit-details-marker]:hidden">
                <UserAvatar image={user.image} name={user.name} size="sm" />

                <div className="flex flex-col text-left leading-tight">
                  <span className="max-w-28 truncate text-xs font-semibold text-foreground sm:max-w-32">
                    {firstName}
                  </span>
                  <span className="text-[10px] font-medium capitalize text-muted-foreground">
                    {roleLabel}
                  </span>
                </div>

                <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>

              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/5">
                <div className="flex items-center gap-3 border-b border-border/70 p-3">
                  <UserAvatar image={user.image} name={user.name} size="lg" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground"
                      title={user.email || ""}
                    >
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "mt-1.5 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none",
                        roleBadgeClass,
                      )}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div className="mt-1 flex flex-col gap-0.5">
                  <Link
                    href={dashboardHref}
                    onClick={closeAllDropdowns}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard className="size-4 text-primary" />
                    <span>{dashboardLabel}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleProfileSettings}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Settings className="size-4 text-muted-foreground" />
                    <span>Profile Settings</span>
                  </button>
                </div>

                <div className="my-1 h-px bg-border/70" />

                {logoutError && (
                  <p
                    role="alert"
                    className="mb-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive"
                  >
                    {logoutError}
                  </p>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="w-full cursor-pointer justify-start gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <LogOut className="size-4" />
                  <span>{isLoggingOut ? "Signing Out..." : "Log Out"}</span>
                </Button>
              </div>
            </details>
          ) : (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Sign In
              </Button>

              <Button
                size="lg"
                className="rounded-full px-6 shadow-md shadow-primary/25"
                nativeButton={false}
                render={<Link href="/signup" />}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            /* Profile Picture Dropdown */
            <details ref={mobileProfileRef} className="relative">
              <summary
                aria-label="Open profile menu"
                className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-card p-0.5 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 [&::-webkit-details-marker]:hidden"
              >
                <UserAvatar image={user.image} name={user.name} size="md" />
              </summary>

              <div className="absolute right-0 top-full z-50 mt-3 w-[min(280px,calc(100vw-32px))] rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/10">
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <UserAvatar image={user.image} name={user.name} size="lg" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground"
                      title={user.email || ""}
                    >
                      {user.email}
                    </p>
                    <span
                      className={cn(
                        "mt-1.5 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium leading-none",
                        roleBadgeClass,
                      )}
                    >
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProfileSettings}
                  className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Profile Settings
                </button>
              </div>
            </details>
          ) : null}

          {/* Three-dot Dropdown */}
          <details ref={mobileMenuRef} className="relative">
            <summary
              aria-label="Open navigation menu"
              className="flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary [&::-webkit-details-marker]:hidden"
            >
              <Ellipsis className="size-6" />
            </summary>

            <div className="absolute right-0 top-full z-50 mt-3 w-[min(260px,calc(100vw-32px))] rounded-2xl border border-border bg-card p-2 shadow-xl shadow-primary/10">
              <p className="px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                Navigation
              </p>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeAllDropdowns}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="size-4" />
                      {link.name}
                    </Link>
                  );
                })}

                {user && roleNavLink && (
                  <Link
                    href={dashboardHref}
                    onClick={closeAllDropdowns}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      isActive(dashboardHref)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {roleNavLink.icon === LayoutDashboard ? (
                      <LayoutDashboard className="size-4 text-primary" />
                    ) : roleNavLink.icon === ShieldCheck ? (
                      <ShieldCheck className="size-4 text-primary" />
                    ) : (
                      <CalendarCheck className="size-4 text-primary" />
                    )}
                    {dashboardLabel}
                  </Link>
                )}
              </div>

              <div className="my-2 h-px bg-border/70" />

              {logoutError && (
                <p
                  role="alert"
                  className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {logoutError}
                </p>
              )}

              {user ? (
                <button
                  type="button"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Signing Out..." : "Log Out"}
                </button>
              ) : (
                <div className="flex flex-col gap-1">
                  <Link
                    href="/login"
                    onClick={closeAllDropdowns}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <UserRound className="size-4" />
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeAllDropdowns}
                    className="flex items-center gap-3 rounded-xl bg-primary/5 px-3 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    <Heart className="size-4" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
