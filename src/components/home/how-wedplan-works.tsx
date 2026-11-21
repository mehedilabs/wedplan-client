"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Heart,
  MessageCircle,
  PartyPopper,
  Search,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const steps = [
  {
    icon: Search,
    title: "Explore Services",
    description:
      "Browse a variety of wedding services and discover everything you need for your special day.",
  },
  {
    icon: Heart,
    title: "Find Your Perfect Match",
    description:
      "Explore service details and choose the wedding professionals that match your vision.",
  },
  {
    icon: MessageCircle,
    title: "Connect & Plan",
    description:
      "Reach out to your chosen vendors and start planning the details of your dream wedding.",
  },
  {
    icon: PartyPopper,
    title: "Celebrate Your Day",
    description:
      "Bring your wedding vision to life and make beautiful memories on your special day.",
  },
];

const perks = [
  "Free to browse every service",
  "Handpicked, verified vendors",
  "Direct contact, no middlemen",
];

export default function HowWedPlanWorks() {
  const { data: session, isPending } = authClient.useSession();

  // jara login kore nai tader jonno
  const showCreateAccount = !isPending && !session;

  return (
    <section className="relative isolate overflow-hidden bg-background px-4 py-14 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      {/* Soft glows */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 -z-10 size-[28rem] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        {/* ================= Left: intro (sticky on PC) ================= */}
        <div className="text-center lg:sticky lg:top-28 lg:self-start lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
            Simple & Seamless
          </div>

          <h2 className="mt-5 font-heading text-[2rem] font-semibold leading-[1.12] tracking-tight text-foreground sm:mt-6 sm:text-5xl lg:text-6xl">
            How <span className="italic text-primary">WedPlan</span> Works
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8 lg:mx-0">
            Your wedding planning journey starts here. Follow a few simple steps
            to discover the right services and bring your dream wedding to life.
          </p>

          <ul className="mx-auto mt-6 w-fit space-y-2.5 text-left sm:mt-7 sm:space-y-3 lg:mx-0">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-3 text-[13px] text-foreground sm:text-sm"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent sm:size-6">
                  <BadgeCheck className="size-3.5 sm:size-4" />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-7 flex max-w-sm gap-3 sm:mt-9 sm:max-w-none sm:justify-center lg:justify-start">
            <Link
              href="/services"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 sm:flex-none sm:gap-3 sm:px-7 sm:text-sm"
            >
              Start Exploring
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {showCreateAccount && (
              <Link
                href="/signup"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-border bg-card px-4 py-3.5 text-[13px] font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary sm:flex-none sm:px-7 sm:text-sm"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>

        {/* ================= Right: timeline ================= */}
        <ol className="relative space-y-4 sm:space-y-6">
          {/* Dotted connecting line: আইকনের ঠিক মাঝ বরাবর */}
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-[1.375rem] top-6 w-0 border-l-2 border-dashed border-accent/60 sm:bottom-8 sm:left-7 sm:top-8"
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <li
                key={step.title}
                className="group relative flex gap-3 sm:gap-6"
              >
                {/* Node */}
                <span
                  className={`relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-[3px] border-background shadow-lg transition-all duration-300 group-hover:scale-110 sm:size-14 sm:border-4 ${
                    isLast
                      ? "bg-accent text-accent-foreground shadow-accent/30"
                      : "bg-primary text-primary-foreground shadow-primary/25 group-hover:bg-accent group-hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="size-5 sm:size-6" strokeWidth={1.8} />
                </span>

                {/* Card */}
                <div className="relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-500 group-hover:-translate-y-1 group-hover:border-accent/60 group-hover:shadow-xl group-hover:shadow-primary/10 sm:rounded-3xl sm:p-6">
                  <h3 className="font-heading text-xl font-semibold leading-tight text-foreground sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 max-w-md text-[13px] leading-6 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-7">
                    {step.description}
                  </p>

                  {/* Bottom accent line */}
                  <span className="absolute inset-x-5 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent to-primary transition-transform duration-500 group-hover:scale-x-100 sm:inset-x-6" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
