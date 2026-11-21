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
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const navLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Browse Services", href: "/services", icon: Store },
];

/* ============================================================
   PREMIUM LOGO — Burgundy base + Gold shimmer
   ============================================================ */
function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("group/logo flex items-center gap-3", className)}>
      <span className="relative flex size-10 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl bg-accent/40 blur-md transition-all duration-500 group-hover/logo:bg-accent/60 group-hover/logo:blur-lg" />
        <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg shadow-primary/25 ring-1 ring-accent/30">
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/50 to-transparent transition-transform duration-700 group-hover/logo:translate-x-full" />
          <Heart className="relative size-5 fill-primary-foreground text-primary-foreground drop-shadow" />
        </span>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Wed<span className="text-primary">Plan</span>
        </span>
        <span className="mt-0.5 hidden text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
          Wedding Services
        </span>
      </span>
    </span>
  );
}

/* ============================================================
   USER AVATAR
   ============================================================ */
function UserAvatar({
  image,
  name,
  size = "md",
  ring = true,
}: {
  image?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}) {
  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-9 text-sm",
    lg: "size-11 text-base",
  }[size];

  const base = cn(
    sizeClasses,
    "shrink-0 rounded-full object-cover",
    ring && "ring-2 ring-accent/40 ring-offset-2 ring-offset-background",
  );

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name || "User profile"}
        referrerPolicy="no-referrer"
        className={base}
      />
    );
  }

  return (
    <span
      className={cn(
        sizeClasses,
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-bold text-primary-foreground shadow-md shadow-primary/25",
        ring && "ring-2 ring-accent/40 ring-offset-2 ring-offset-background",
      )}
    >
      {name?.trim().charAt(0).toUpperCase() || "U"}
    </span>
  );
}

/* ============================================================
   PROFILE HEADER — reused in dropdowns (desktop + mobile)
   ============================================================ */
function ProfileHeader({
  user,
  roleLabel,
  roleBadgeClass,
  userRole,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  roleLabel: string;
  roleBadgeClass: string;
  userRole?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-secondary/60 via-card to-card p-3.5">
      {/* Subtle gold corner glow */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-20 rounded-full bg-accent/15 blur-2xl" />

      <div className="relative flex items-center gap-3.5">
        <UserAvatar image={user.image} name={user.name} size="lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">
            {user.name}
          </p>
          <p
            className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground"
            title={user.email || ""}
          >
            {user.email}
          </p>

          <span
            className={cn(
              "mt-1.5 inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide leading-none",
              roleBadgeClass,
            )}
          >
            {userRole === "admin" ? (
              <ShieldCheck className="size-2.5" />
            ) : userRole === "vendor" ? (
              <Store className="size-2.5" />
            ) : (
              <Sparkles className="size-2.5" />
            )}
            {roleLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SIGN OUT DIALOG — reused everywhere
   ============================================================ */
function SignOutDialog({
  trigger,
  isLoggingOut,
  onConfirm,
  logoutError,
}: {
  trigger: React.ReactElement;
  isLoggingOut: boolean;
  onConfirm: () => Promise<void> | void;
  logoutError?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-primary/10 text-primary">
            <LogOut className="size-5" />
          </AlertDialogMedia>

          <AlertDialogTitle className="font-heading text-lg">
            Sign out of your account?
          </AlertDialogTitle>

          <AlertDialogDescription>
            You&apos;ll be signed out on this device. You can sign back in
            anytime.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {logoutError && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
          >
            {logoutError}
          </p>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut} className="cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoggingOut}
            className="cursor-pointer gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Signing Out...
              </>
            ) : (
              <>
                <LogOut className="size-4" />
                Sign Out
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ============================================================
   MAIN NAVBAR
   ============================================================ */
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
      ? "border-primary/30 bg-primary/10 text-primary"
      : userRole === "admin"
        ? "border-zinc-700 bg-zinc-800 text-zinc-100"
        : "border-accent/40 bg-accent/15 text-foreground";

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

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const profileSettingsHref =
    userRole === "vendor"
      ? "/dashboard/vendor/profile"
      : userRole === "admin"
        ? "/dashboard/admin/profile"
        : "/dashboard/customer/profile";

  const handleProfileSettings = () => {
    closeAllDropdowns();
    router.push(profileSettingsHref);
  };

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);
    try {
      const { error } = await authClient.signOut();
      if (error) {
        setLogoutError(error.message || "Unable to sign out.");
        setIsLoggingOut(false);
        return;
      }
      closeAllDropdowns();
      router.replace("/");
      router.refresh();
    } catch {
      setLogoutError("Something went wrong. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-border/80 bg-background/80 shadow-[0_8px_30px_-12px] shadow-primary/15 backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-transparent bg-background/50 backdrop-blur-md",
      )}
    >
      {/* Burgundy → Gold accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <nav
        className={cn(
          "relative mx-auto flex w-full max-w-7xl items-center justify-between",
          "h-[72px] px-4 sm:px-6 md:grid md:h-20 md:grid-cols-[1fr_auto_1fr] lg:px-8",
          "transition-all duration-500",
        )}
      >
        {/* Logo */}
        <Link href="/" aria-label="WedPlan home" className="justify-self-start">
          <Logo />
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}
        <div className="hidden items-center justify-self-center md:flex">
          <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 shadow-sm backdrop-blur-sm">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.name}
                  {active && (
                    <span className="pointer-events-none absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= DESKTOP ACTIONS ================= */}
        <div className="hidden items-center justify-self-end gap-2 md:flex">
          {isPending ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <details ref={desktopProfileRef} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-full border border-border/80 bg-card/70 py-1.5 pl-1.5 pr-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-accent/60 hover:bg-card hover:shadow-md hover:shadow-primary/10 [&::-webkit-details-marker]:hidden">
                <UserAvatar image={user.image} name={user.name} size="sm" />
                <div className="flex flex-col text-left leading-tight">
                  <span className="max-w-28 truncate text-xs font-semibold text-foreground sm:max-w-32">
                    {firstName}
                  </span>
                  <span className="text-[10px] font-medium capitalize text-muted-foreground">
                    {roleLabel}
                  </span>
                </div>
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
              </summary>

              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2.5 w-72 origin-top-right overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl shadow-primary/15 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

                <ProfileHeader
                  user={user}
                  roleLabel={roleLabel}
                  roleBadgeClass={roleBadgeClass}
                  userRole={userRole}
                />

                <div className="mt-1.5 flex flex-col gap-0.5">
                  <Link
                    href={dashboardHref}
                    onClick={closeAllDropdowns}
                    className="group/item flex items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover/item:scale-110">
                        <LayoutDashboard className="size-3.5" />
                      </span>
                      {dashboardLabel}
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-all group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleProfileSettings}
                    className="group/item flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-foreground transition-all hover:bg-primary/5"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-transform group-hover/item:scale-110">
                        <Settings className="size-3.5" />
                      </span>
                      Profile Settings
                    </span>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-all group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
                  </button>
                </div>

                <div className="my-1.5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {logoutError && (
                  <p
                    role="alert"
                    className="mb-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs text-destructive"
                  >
                    {logoutError}
                  </p>
                )}

                <SignOutDialog
                  isLoggingOut={isLoggingOut}
                  onConfirm={handleLogout}
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isLoggingOut}
                      className="w-full cursor-pointer justify-start gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      <span>{isLoggingOut ? "Signing Out..." : "Log Out"}</span>
                    </Button>
                  }
                />
              </div>
            </details>
          ) : (
            <>
              <Button
                variant="ghost"
                nativeButton={false}
                render={<Link href="/login" />}
                className="rounded-full font-semibold text-foreground hover:bg-muted"
              >
                Sign In
              </Button>

              <Button
                size="lg"
                className="group/cta relative overflow-hidden rounded-full bg-primary px-6 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40"
                nativeButton={false}
                render={<Link href="/signup" />}
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
                <span className="relative flex items-center gap-1.5">
                  Sign Up
                  <ArrowRight className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
                </span>
              </Button>
            </>
          )}
        </div>

        {/* ================= MOBILE ACTIONS ================= */}
        <div className="flex items-center gap-2 md:hidden">
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <details ref={mobileProfileRef} className="relative">
              <summary
                aria-label="Open profile menu"
                className="flex size-10 cursor-pointer list-none items-center justify-center rounded-full border border-border bg-card p-0.5 shadow-sm transition-all hover:border-accent/60 hover:bg-accent/5 [&::-webkit-details-marker]:hidden"
              >
                <UserAvatar
                  image={user.image}
                  name={user.name}
                  size="md"
                  ring={false}
                />
              </summary>

              <div className="absolute right-0 top-full z-50 mt-3 w-[min(300px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-border bg-card/95 p-2 shadow-2xl shadow-primary/15 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

                <ProfileHeader
                  user={user}
                  roleLabel={roleLabel}
                  roleBadgeClass={roleBadgeClass}
                  userRole={userRole}
                />

                <button
                  type="button"
                  onClick={handleProfileSettings}
                  className="mt-1.5 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Settings className="size-4 text-muted-foreground" />
                  Profile Settings
                </button>
              </div>
            </details>
          ) : null}

          <details ref={mobileMenuRef} className="relative">
            <summary
              aria-label="Open navigation menu"
              className="group flex size-10 cursor-pointer list-none items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm transition-all hover:border-accent/60 hover:bg-accent/5 hover:text-primary [&::-webkit-details-marker]:hidden"
            >
              <Ellipsis className="size-6 transition-transform group-open:rotate-90" />
            </summary>

            <div className="absolute right-0 top-full z-50 mt-3 w-[min(280px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-border bg-card/95 p-2 shadow-2xl shadow-primary/15 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

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
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
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
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
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

              <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              {logoutError && (
                <p
                  role="alert"
                  className="mb-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {logoutError}
                </p>
              )}

              {user ? (
                <SignOutDialog
                  isLoggingOut={isLoggingOut}
                  onConfirm={handleLogout}
                  trigger={
                    <button
                      type="button"
                      disabled={isLoggingOut}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <LogOut className="size-4" />
                      {isLoggingOut ? "Signing Out..." : "Log Out"}
                    </button>
                  }
                />
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
                    className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-3 text-sm font-semibold text-primary hover:bg-primary/15"
                  >
                    <Heart className="size-4 fill-current" />
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
