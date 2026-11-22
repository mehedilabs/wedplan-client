"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Camera,
  Flower2,
  Heart,
  MapPin,
  Utensils,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

const categories = [
  {
    label: "Photography",
    icon: Camera,
    href: "/services?category=Photography%20%26%20Videography",
  },
  {
    label: "Venues",
    icon: MapPin,
    href: "/services?category=Wedding%20Venues",
  },
  {
    label: "Catering",
    icon: Utensils,
    href: "/services?category=Catering%20Services",
  },
  {
    label: "Decoration",
    icon: Flower2,
    href: "/services?category=Decoration%20%26%20Florist",
  },
];

const highlights = [
  { title: "Beautiful", text: "Wedding Inspiration" },
  { title: "Trusted", text: "Service Providers" },
  { title: "Effortless", text: "Wedding Planning" },
];

export default function HeroSection() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleVendorClick = () => {
    if (isPending) return;

    if (!session?.user) {
      router.push("/signup?role=vendor");
      return;
    }

    const role = session.user.role;

    if (role === "customer") {
      toast.add({
        title: "Customer Account Detected",
        description: "Please logout first, then sign up with a vendor account.",
        type: "info",
      });
      return;
    }

    if (role === "vendor") {
      toast.add({
        title: "Already a Vendor!",
        description: "You are already registered as a vendor.",
        type: "info",
      });
      return;
    }

    toast.add({
      title: "Vendor Registration Unavailable",
      description: "This option is only available for customer accounts.",
      type: "info",
    });
  };

  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-40 left-1/4 -z-10 size-[30rem] rounded-full bg-accent/[0.10] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 size-[36rem] rounded-full bg-primary/[0.07] blur-[120px]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 pb-12 pt-10 sm:px-8 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-12 lg:pb-32 lg:pt-24">
        {/* LEFT: Content */}
        <div className="text-center lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/[0.12] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Your dream wedding
          </div>

          <h1 className="font-heading text-[2.5rem] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl sm:leading-[1.02] xl:text-[4.5rem]">
            Where love
            <br />
            <span className="italic text-primary">finds its</span>
            <br />
            perfect place
          </h1>

          <p className="mx-auto mt-7 max-w-md text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8 lg:mx-0">
            Curated venues, talented photographers, unforgettable moments —
            everything you need to make your day truly yours.
          </p>

          <div className="mx-auto mt-9 grid w-full max-w-md grid-cols-2 gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-3 lg:justify-start">
            <Link
              href="/services"
              className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-4 text-[13px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 sm:h-auto sm:w-auto sm:px-6 sm:py-3.5 sm:text-sm"
            >
              Explore Services
              <ArrowUpRight className="hidden size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
            </Link>

            <button
              type="button"
              onClick={handleVendorClick}
              disabled={isPending}
              className="inline-flex h-12 w-full items-center cursor-pointer justify-center gap-2 rounded-full border border-accent/40 bg-secondary px-4 text-[13px] font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:bg-accent/15 disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:w-auto sm:px-6 sm:py-3.5 sm:text-sm"
            >
              Join as Vendor
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            {categories.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-all hover:border-accent/60 hover:bg-accent/5 hover:text-foreground sm:text-xs"
              >
                <Icon className="size-3.5 text-primary/70" />
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex items-start justify-center gap-5 sm:gap-8 lg:justify-start">
            {highlights.map(({ title, text }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <p className="font-heading text-sm font-semibold text-foreground sm:text-base">
                  {title}
                </p>
                <p className="mt-0.5 hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block sm:text-[11px]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Collage */}
        <div className="relative mx-auto aspect-square w-full max-w-[24rem] sm:max-w-md lg:max-w-xl">
          <div className="absolute inset-[15%] -z-10 rounded-full bg-accent/15 blur-[60px]" />

          <div className="absolute bottom-0 left-0 h-[86%] w-[64%] overflow-hidden rounded-t-[8rem] rounded-b-3xl shadow-[0_30px_60px_-20px] shadow-primary/25">
            <Image
              src="/images/hero/hero-center.jpg"
              alt="Happy couple on their wedding day"
              fill
              priority
              sizes="(min-width: 1024px) 30vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          <div className="absolute right-0 top-4 aspect-[4/5] w-[42%] rotate-3 rounded-2xl bg-card p-1.5 shadow-[0_15px_40px_-10px] shadow-primary/20">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src="/images/hero/hero-left.jpg"
                alt="Wedding flowers and decoration"
                fill
                sizes="(min-width: 1024px) 18vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute bottom-[6%] right-[6%] aspect-square w-[34%] overflow-hidden rounded-full border-[6px] border-background shadow-2xl shadow-primary/25">
            <Image
              src="/images/hero/hero-right.jpg"
              alt="Beautiful wedding venue"
              fill
              sizes="(min-width: 1024px) 16vw, 34vw"
              className="object-cover"
            />
          </div>

          <svg
            className="pointer-events-none absolute -left-2 top-0 size-20 text-accent/40 sm:size-24"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden
          >
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 7"
            />
          </svg>

          <div className="pointer-events-none absolute right-[8%] top-[46%] flex size-8 items-center justify-center rounded-full bg-white shadow-md">
            <Heart className="size-3.5 fill-accent text-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
