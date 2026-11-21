import {
  HeartHandshake,
  ClipboardCheck,
  BadgeCheck,
  Headset,
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
  return (
    <section className="relative isolate overflow-hidden bg-background px-4 pb-16 pt-4 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
      {/* Soft ambient background glows */}
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 size-96 rounded-full bg-accent/[0.06] blur-[100px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 -z-10 size-96 rounded-full bg-primary/[0.05] blur-[100px]" />

      <div className="mx-auto max-w-7xl">
        {/* ═══════ HEADER ═══════ */}
        <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-16">
          <div className="mb-2 flex items-center justify-center gap-2 sm:mb-4">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary sm:text-xs">
              Why WedPlan?
            </p>
          </div>

          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl sm:leading-tight">
            Your Dream Wedding,{" "}
            <span className="relative inline-block italic text-primary">
              Made Easier
              <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-accent to-transparent" />
            </span>
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:mt-6 sm:text-base sm:leading-8">
            Planning your special day should be exciting, not overwhelming.
            WedPlan brings everything you need together to make your wedding
            journey simple, joyful, and memorable.
          </p>
        </div>

        {/* ═══════ GRID ═══════ */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group relative flex flex-col justify-start overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-xl hover:shadow-primary/5 sm:rounded-[1.5rem] sm:p-7"
              >
                {/* Subtle hover gradient background */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  {/* Icon */}
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary text-primary shadow-sm ring-1 ring-border/50 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/20 sm:mb-6 sm:size-14 sm:rounded-2xl">
                    <Icon className="size-6 sm:size-[26px]" strokeWidth={1.8} />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 font-heading text-lg font-bold text-foreground sm:mb-2.5 sm:text-xl">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                    {benefit.description}
                  </p>
                </div>

                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] scale-x-0 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
