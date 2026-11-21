"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, MapPin, Phone, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import { usePathname } from "next/navigation";

type QuickLink = {
  name: string;
  href: string;
  // ture hole toast dekhabe ..page e jabe na
  guestOnly?: boolean;
};

const quickLinks: QuickLink[] = [
  { name: "Home", href: "/" },
  { name: "Browse Services", href: "/services" },
  { name: "Sign In", href: "/login", guestOnly: true },
  { name: "Create Account", href: "/signup", guestOnly: true },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.6c0-.9.3-1.5 1.6-1.5h1.7V3.2c-.8-.1-1.6-.2-2.5-.2-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21h3.4Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.1-1.8 0-2.6l1.3-5.5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.3 1 .5 1.8 1.5 1.8 1.8 0 3.1-2.3 3.1-5 0-2.1-1.4-3.7-3.9-3.7-2.8 0-4.5 2.1-4.5 4.4 0 .8.2 1.5.6 2 .2.2.2.4.1.7l-.2.8c-.1.3-.3.4-.6.3-1.3-.5-1.9-1.8-1.9-3.3 0-2.5 2.1-5.5 6.3-5.5 3.4 0 5.7 2.5 5.7 5.2 0 3.6-2 6.3-4.9 6.3-1 0-1.9-.6-2.2-1.3l-.7 2.7c-.2.8-.7 1.7-1.1 2.3A10 10 0 1 0 12 2Z" />
    </svg>
  );
}

const socialLinks = [
  { name: "Facebook", icon: FacebookIcon },
  { name: "Instagram", icon: InstagramIcon },
  { name: "Pinterest", icon: PinterestIcon },
];

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div className="border-t border-border/60 last:border-b sm:border-0 sm:last:border-0">
      <h3 className="font-heading text-lg font-semibold text-foreground">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between gap-3 py-4 text-left sm:pointer-events-none sm:cursor-default sm:py-0"
        >
          {title}

          {/* + system for mobile ...my favorite idea */}
          <span
            aria-hidden="true"
            className={cn(
              "relative flex size-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:hidden",
              open
                ? "border-primary bg-primary text-primary-foreground"
                : "border-accent/60 bg-background text-primary",
            )}
          >
            {/* live ring when no one click */}
            {!open && (
              <>
                <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent animate-[pulse-ring_2.4s_ease-out_infinite] motion-reduce:hidden" />
                <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent animate-[pulse-ring_2.4s_ease-out_1.2s_infinite] motion-reduce:hidden" />
              </>
            )}

            <Plus
              className={cn(
                "relative size-4 transition-transform duration-300",
                open && "rotate-45",
              )}
            />
          </span>
        </button>
      </h3>

      <span
        aria-hidden="true"
        className="mt-2 hidden h-0.5 w-8 rounded-full bg-gradient-to-r from-accent to-transparent sm:block"
      />

      <div
        id={contentId}
        className={cn(
          "grid transition-all duration-300 ease-out sm:grid-rows-[1fr] sm:opacity-100",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 sm:pb-0 sm:pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleComingSoon = (platform: string) => {
    toast.add({
      title: `${platform} Coming Soon!`,
      description: "We're working on this. Stay tuned!",
      type: "info",
    });
  };

  // login user Sign In / Create Account- e click korle toast dekhabe
  const handleGuestLink = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: QuickLink,
  ) => {
    if (!link.guestOnly || !user) return;

    event.preventDefault();

    toast.add({
      title: "You're already signed in",
      description:
        link.href === "/signup"
          ? "You already have an account, so there's no need to create another."
          : "You're already logged in to your account.",
      type: "info",
    });
  };

  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) return null;

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-card">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-32 top-0 size-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-72 rounded-full bg-accent/10 blur-3xl" />

      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-12 py-10 sm:grid-cols-2 sm:gap-y-10 sm:py-14 lg:grid-cols-4 lg:py-16">
          {/* ---------- Brand ---------- */}
          <div className="pb-8 sm:col-span-2 sm:pb-0 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg shadow-primary/20 ring-1 ring-accent/30">
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Heart className="relative size-5 fill-primary-foreground text-primary-foreground" />
              </span>

              <span className="flex flex-col leading-none">
                <span className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  Wed<span className="text-primary">Plan</span>
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Wedding Services
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Your dream wedding starts here. Discover trusted vendors, explore
              beautiful services, and turn your special day into unforgettable
              memories with WedPlan.
            </p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-medium italic text-primary">
              <Heart className="size-3.5 fill-primary/30" />
              Made with love for your special day.
            </p>
          </div>

          {/* ---------- Quick Links ---------- */}
          <FooterSection title="Quick Links">
            <div className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleGuestLink(event, link)}
                  className="group flex w-fit items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <span className="size-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
                  {link.name}
                  <ArrowUpRight className="size-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </FooterSection>

          {/* ---------- Get in Touch ---------- */}
          <FooterSection title="Get in Touch">
            <p className="text-sm leading-6 text-muted-foreground">
              Have questions or need help finding the perfect wedding service?
              We&apos;d love to hear from you.
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="tel:+8801877168787"
                className="group flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-2.5 transition-all duration-300 hover:border-accent/60 hover:shadow-md hover:shadow-primary/10"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone className="size-4" />
                </span>

                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">Call us</p>
                  <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    +880 1877-168787
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/70 p-2.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </span>

                <div className="min-w-0">
                  <p className="text-[11px] text-muted-foreground">
                    Our platform
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    Wedding Services, Made Easy
                  </p>
                </div>
              </div>
            </div>
          </FooterSection>

          {/* ---------- Follow ---------- */}
          <FooterSection title="Follow Our Journey">
            <p className="text-sm leading-6 text-muted-foreground">
              Join us as we make wedding planning easier, more beautiful, and
              more memorable.
            </p>

            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <button
                    key={social.name}
                    type="button"
                    aria-label={`Visit ${social.name}`}
                    onClick={() => handleComingSoon(social.name)}
                    className="group flex size-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
                  >
                    <Icon />
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-3.5">
              <p className="font-heading text-sm font-semibold text-foreground">
                Something beautiful is coming!
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Our social community is coming soon. Stay connected with us.
              </p>
            </div>
          </FooterSection>
        </div>

        {/* ---------- Bottom bar ---------- */}
        <div className="border-t border-border/60 py-5">
          <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-5 text-muted-foreground">
              © {new Date().getFullYear()} WedPlan. All rights reserved.
            </p>

            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Designed with
              <Heart className="size-3 fill-primary text-primary" />
              for couples planning their dream wedding.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
