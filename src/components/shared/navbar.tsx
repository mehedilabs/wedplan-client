"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Heart,
  Home,
  Store,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const userRole = user?.role as string | undefined;

  const dashboardHref =
    userRole === "vendor"
      ? "/dashboard/vendor"
      : userRole === "admin"
        ? "/dashboard/admin"
        : "/dashboard/customer";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Hide public navbar on dashboard routes so the dedicated dashboard layout takes over
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setLogoutError(error.message || "Unable to sign out.");
        return;
      }

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
      <nav className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label="WedPlan home">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center justify-self-center gap-1 md:flex">
          {navLinks.map((link) => {
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
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border px-3 py-2 transition-colors hover:bg-muted [&::-webkit-details-marker]:hidden">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>

                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name}
                </span>

                <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>

              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-lg">
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <Link
                  href={dashboardHref}
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>

                {logoutError && (
                  <p
                    role="alert"
                    className="px-3 py-2 text-xs text-destructive"
                  >
                    {logoutError}
                  </p>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoggingOut}
                  onClick={handleLogout}
                  className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Signing Out..." : "Sign Out"}
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

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  aria-label="Open navigation menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[85%] flex-col gap-0 p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border p-5">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>

              {/* Links */}
              <div className="flex flex-1 flex-col gap-1 p-4">
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  const Icon = link.icon;

                  return (
                    <SheetClose
                      key={link.href}
                      render={
                        <Link
                          href={link.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                            active
                              ? "bg-primary/10 text-primary"
                              : "text-foreground hover:bg-muted",
                          )}
                        />
                      }
                    >
                      <Icon className="size-4" />
                      {link.name}
                    </SheetClose>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 border-t border-border p-4">
                {isPending ? (
                  <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
                ) : user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {user.name?.charAt(0).toUpperCase() || "U"}
                      </span>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <SheetClose
                      render={
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                        />
                      }
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </SheetClose>

                    {logoutError && (
                      <p role="alert" className="text-xs text-destructive">
                        {logoutError}
                      </p>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      className="w-full rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="mr-2 size-4" />
                      {isLoggingOut ? "Signing Out..." : "Sign Out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <SheetClose
                      render={
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full rounded-full"
                          nativeButton={false}
                          render={<Link href="/login" />}
                        />
                      }
                    >
                      Sign In
                    </SheetClose>

                    <SheetClose
                      render={
                        <Button
                          size="lg"
                          className="w-full rounded-full shadow-md shadow-primary/25"
                          nativeButton={false}
                          render={<Link href="/signup" />}
                        />
                      }
                    >
                      Sign Up
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
