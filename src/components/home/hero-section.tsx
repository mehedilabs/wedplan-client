import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Flower2,
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

const highlights = [
  { title: "Beautiful", text: "Wedding Inspiration" },
  { title: "Trusted", text: "Service Providers" },
  { title: "Effortless", text: "Wedding Planning" },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      {/* Soft glows */}
      <div className="pointer-events-none absolute -left-40 bottom-0 -z-10 size-[26rem] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 -z-10 size-[30rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-8 sm:px-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-12 lg:pb-28 lg:pt-16">
        {/* ---------- Left: Content ---------- */}
        <div className="text-center lg:text-left">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 text-[10px] font-medium tracking-[0.14em] text-primary sm:mb-6 sm:px-4 sm:py-2 sm:text-sm sm:tracking-[0.18em]">
            <Sparkles className="size-3.5 text-accent sm:size-4" />
            YOUR DREAM WEDDING STARTS HERE
          </div>

          <h1 className="font-heading text-[2.15rem] font-semibold leading-[1.12] tracking-tight text-foreground sm:text-6xl sm:leading-[1.06] xl:text-7xl">
            Every Love Story Deserves a{" "}
            <span className="relative inline-block italic text-primary">
              Beautiful Beginning.
              <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-accent to-transparent sm:h-[3px]" />
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:mt-7 sm:max-w-xl sm:text-lg sm:leading-8 lg:mx-0">
            From picture-perfect photography to breathtaking venues, discover
            the wedding professionals who will make your special day
            unforgettable.
          </p>

          {/* Buttons: মোবাইলে পাশাপাশি */}
          <div className="mx-auto mt-7 grid max-w-sm grid-cols-2 gap-3 sm:mt-9 sm:flex sm:max-w-none sm:justify-center lg:justify-start">
            <Link
              href="/services"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3.5 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 sm:gap-3 sm:px-8 sm:py-4 sm:text-sm"
            >
              Explore Services
              <ArrowRight className="hidden size-4 transition-transform duration-300 group-hover:translate-x-1 sm:block" />
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3.5 text-[13px] font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary sm:gap-3 sm:px-8 sm:py-4 sm:text-sm"
            >
              Join as a Vendor
              <ArrowRight className="hidden size-4 sm:block" />
            </Link>
          </div>

          {/* Category chips: মোবাইলে ২×২ */}
          <div className="hidden mx-auto mt-6 grid max-w-sm grid-cols-2 gap-2 sm:mt-9 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-2.5 lg:justify-start">
            {categories.map(({ label, icon: Icon }) => (
              <Link
                key={label}
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-3 py-2 text-[13px] text-secondary-foreground transition-colors hover:border-accent hover:bg-accent/15 sm:justify-start sm:px-4 sm:text-sm"
              >
                <Icon className="size-3.5 text-primary sm:size-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Highlights */}
          <div className="mt-9 grid grid-cols-3 gap-2 border-t border-border pt-6 sm:mt-12 sm:gap-4 sm:pt-8">
            {highlights.map(({ title, text }, index) => (
              <div
                key={title}
                className={
                  index > 0
                    ? "border-l border-border pl-2 sm:pl-6 lg:text-left"
                    : "lg:text-left"
                }
              >
                <p className="font-heading text-lg font-semibold text-foreground sm:text-2xl">
                  {title}
                </p>
                <p className="mt-0.5 text-[10px] tracking-wide text-muted-foreground sm:mt-1 sm:text-xs">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Right: Image Collage ---------- */}
        <div className="relative mx-auto aspect-[5/6] w-full max-w-[22rem] sm:max-w-md lg:max-w-xl">
          {/* Dotted decoration */}
          <div
            className="pointer-events-none absolute -bottom-3 left-[30%] -z-10 h-20 w-32 opacity-70 sm:h-24 sm:w-40"
            style={{
              backgroundImage:
                "radial-gradient(var(--accent) 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }}
          />

          {/* Gold offset frame */}
          <div className="absolute right-[-3%] top-[5%] h-[88%] w-[62%] rounded-t-full rounded-b-3xl border-2 border-accent/60" />

          {/* Main arch image */}
          <div className="absolute right-0 top-0 h-[88%] w-[62%] overflow-hidden rounded-t-full rounded-b-3xl border-[3px] border-card shadow-2xl shadow-primary/20 sm:border-4">
            <Image
              src="/images/hero/hero-center.jpg"
              alt="Happy couple on their wedding day"
              fill
              priority
              sizes="(min-width: 1024px) 28vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          </div>

          {/* Left tilted image */}
          <div className="absolute left-0 top-[26%] h-[46%] w-[40%] -rotate-3 overflow-hidden rounded-2xl border-[3px] border-card shadow-xl shadow-primary/15 sm:rounded-3xl sm:border-4">
            <Image
              src="/images/hero/hero-left.jpg"
              alt="Wedding flowers and decoration"
              fill
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Bottom circle image */}
          <div className="absolute bottom-0 right-[10%] aspect-square w-[30%] overflow-hidden rounded-full border-[3px] border-card shadow-xl shadow-primary/20 sm:border-4">
            <Image
              src="/images/hero/hero-right.jpg"
              alt="Beautiful wedding venue"
              fill
              sizes="(min-width: 1024px) 14vw, 30vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
