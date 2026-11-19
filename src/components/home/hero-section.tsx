import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Flower2,
  Heart,
  MapPin,
  Sparkles,
  Utensils,
} from "lucide-react";

const categories = [
  { label: "Photography", icon: Camera },
  { label: "Venues", icon: MapPin },
  { label: "Catering", icon: Utensils },
  { label: "Decoration", icon: Flower2 },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Soft glow: নবার থেকে একটু নিচে, তাই seam পড়ে না */}
      <div className="pointer-events-none absolute left-1/2 top-48 -z-10 h-[460px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl px-5 pb-28 pt-14 sm:px-8 lg:px-12 lg:pt-20">
        {/* ---------- Top: Centered Text ---------- */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-2 text-xs font-medium tracking-[0.18em] text-primary sm:text-sm">
            <Sparkles className="size-4 text-accent" />
            YOUR DREAM WEDDING STARTS HERE
          </div>

          <h1 className="font-heading text-5xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Every Love Story Deserves a{" "}
            <span className="italic text-primary">Beautiful Beginning.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            From picture-perfect photography to breathtaking venues, discover
            the wedding professionals who will make your special day
            unforgettable.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Explore Services
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
            >
              Join as a Vendor
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* ---------- Gallery ---------- */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[1fr_1.35fr_1fr] md:gap-8">
            {/* Left image */}
            <div className="relative mb-12 hidden aspect-[3/4] -rotate-3 overflow-hidden rounded-3xl border-4 border-card shadow-xl shadow-primary/15 md:block">
              <Image
                src="/images/hero/hero-left.jpg"
                alt="Wedding flowers and decoration"
                fill
                sizes="(min-width: 768px) 22vw, 0px"
                className="object-cover"
              />
            </div>

            {/* Center arch image */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-t-full rounded-b-3xl border-4 border-card shadow-2xl shadow-primary/20 md:max-w-none">
              <Image
                src="/images/hero/hero-center.jpg"
                alt="Happy couple on their wedding day"
                fill
                priority
                sizes="(min-width: 768px) 32vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
            </div>

            {/* Right image */}
            <div className="relative mb-12 hidden aspect-[3/4] rotate-3 overflow-hidden rounded-3xl border-4 border-card shadow-xl shadow-primary/15 md:block">
              <Image
                src="/images/hero/hero-right.jpg"
                alt="Beautiful wedding venue"
                fill
                sizes="(min-width: 768px) 22vw, 0px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Floating badge: left */}
          <div className="absolute left-0 top-1/4 hidden items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md lg:flex xl:-left-10">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent/20 text-accent">
              <BadgeCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Verified Vendors
              </p>
              <p className="text-xs text-muted-foreground">
                Handpicked for quality
              </p>
            </div>
          </div>

          {/* Floating badge: right */}
          <div className="absolute right-0 top-1/3 hidden items-center gap-3 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md lg:flex xl:-right-10">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-card-foreground">
                Effortless Planning
              </p>
              <p className="text-xs text-muted-foreground">All in one place</p>
            </div>
          </div>

          {/* Category bar: ছবির নিচে ভাসমান */}
          <div className="absolute -bottom-10 left-1/2 flex w-[94%] max-w-3xl -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-3xl border border-border bg-card/95 p-3 shadow-2xl shadow-primary/15 backdrop-blur-md sm:rounded-full sm:justify-between sm:pl-4">
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map(({ label, icon: Icon }) => (
                <Link
                  key={label}
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm text-secondary-foreground transition-colors hover:bg-accent/15 hover:text-primary"
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </Link>
              ))}
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse All
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
