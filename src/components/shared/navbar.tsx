"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Heart, Home, Store } from "lucide-react";

import { cn } from "@/lib/utils";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "border-border bg-background/90 shadow-sm backdrop-blur-lg"
          : "border-transparent bg-background/70 backdrop-blur-md",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label="WedPlan home">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
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
        <div className="hidden items-center gap-2 md:flex">
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

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-border p-4">
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
