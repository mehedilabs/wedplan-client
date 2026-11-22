import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Headset,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    title: "Trusted Wedding Vendors",
    description:
      "Discover reliable wedding professionals to help make your special day unforgettable.",
  },
  {
    icon: ClipboardCheck,
    title: "Stress-Free Planning",
    description:
      "Find and organize essential wedding services from one convenient platform.",
  },
  {
    icon: HeartHandshake,
    title: "Personalized Experience",
    description:
      "Explore wedding services that match your preferences, vision, and budget.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description:
      "Get the support you need throughout your wedding planning journey.",
  },
];

export default function WhyChooseWedPlan() {
  const [featured, ...others] = benefits;
  const FeaturedIcon = featured.icon;

  return (
    <section className="relative isolate overflow-hidden bg-background px-4 py-10 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      {/* Soft glows */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-20 -z-10 size-[28rem] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        {/* ================= Header ================= */}
        <div className="mb-9 text-center sm:mb-12 lg:mb-14 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:text-left">
          <div className="lg:max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
              Why WedPlan?
            </div>

            <h2 className="mt-5 font-heading text-[2rem] font-semibold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Dream Wedding,{" "}
              <span className="relative inline-block italic text-primary">
                Made Easier
              </span>
            </h2>
          </div>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground sm:mt-5 sm:max-w-xl sm:text-base sm:leading-8 lg:mx-0 lg:mt-0 lg:max-w-sm">
            Planning your special day should be exciting, not overwhelming.
            WedPlan brings everything you need together to make your wedding
            journey simple, joyful, and memorable.
          </p>
        </div>

        {/* ================= Bento grid ================= */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {/* ---------- Featured card ---------- */}
          <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-xl shadow-primary/20 sm:col-span-2 sm:p-8 lg:col-span-1 lg:row-span-2 lg:p-9">
            {/* Decorations */}
            <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 size-48 rounded-full bg-background/10 blur-3xl" />
            <FeaturedIcon
              aria-hidden="true"
              strokeWidth={1}
              className="pointer-events-none absolute -bottom-8 -right-8 size-44 text-primary-foreground/10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6 sm:size-56"
            />

            <div className="relative">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-black/20 sm:size-16">
                <FeaturedIcon className="size-7 sm:size-8" strokeWidth={1.8} />
              </span>

              <h3 className="mt-6 max-w-xs font-heading text-3xl font-semibold leading-tight sm:text-4xl">
                {featured.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-7 text-primary-foreground/75 sm:text-base sm:leading-8">
                {featured.description}
              </p>
            </div>

            <Link
              href="/services"
              className="group/link relative mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-background/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-primary-foreground/25 backdrop-blur-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:ring-accent lg:mt-12"
            >
              Explore Services
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
            </Link>
          </article>

          {/* ---------- Other cards ---------- */}
          {others.map((benefit, index) => {
            const Icon = benefit.icon;
            const isWide = index === 0;

            return (
              <article
                key={benefit.title}
                className={`group relative flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/60 hover:shadow-xl hover:shadow-primary/10 sm:rounded-3xl sm:p-6 ${
                  isWide
                    ? "items-start sm:col-span-2 sm:items-center sm:gap-6 sm:p-8"
                    : "items-start sm:flex-col sm:gap-0"
                }`}
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover:bg-accent/20" />

                {/* Icon */}
                <span
                  className={`relative flex shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-border/60 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/25 ${
                    isWide
                      ? "size-12 sm:size-16 sm:rounded-2xl"
                      : "size-12 sm:mb-5 sm:size-14 sm:rounded-2xl"
                  }`}
                >
                  <Icon
                    className={
                      isWide ? "size-6 sm:size-7" : "size-6 sm:size-[26px]"
                    }
                    strokeWidth={1.8}
                  />
                </span>

                {/* Text */}
                <div className="relative min-w-0">
                  <h3
                    className={`font-heading font-semibold leading-tight text-foreground ${
                      isWide ? "text-xl sm:text-2xl" : "text-xl sm:text-2xl"
                    }`}
                  >
                    {benefit.title}
                  </h3>

                  <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-7">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom line on hover */}
                <span className="absolute inset-x-6 bottom-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-accent to-primary transition-transform duration-500 group-hover:scale-x-100" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
