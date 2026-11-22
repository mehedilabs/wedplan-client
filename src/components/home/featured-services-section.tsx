import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

import ServiceCard from "@/components/services/service-card";
import { getServices } from "@/lib/api/service-api";
import type { Service } from "@/types/service";
import { connection } from "next/server";

async function getFeaturedServices(): Promise<Service[]> {
  try {
    const services = await getServices();
    return services.slice(0, 6);
  } catch (error) {
    console.error("Failed to load featured services:", error);
    return [];
  }
}

export default async function FeaturedServicesSection() {
  await connection();

  const services = await getFeaturedServices();

  return (
    <section className="relative isolate overflow-hidden bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      {/* Soft decorative glows */}
      <div className="pointer-events-none absolute -left-32 top-24 -z-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-24 -z-10 size-[26rem] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* ---------- Section Heading ---------- */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-accent sm:w-16" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Handpicked for Your Celebration
            </p>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-accent sm:w-16" />
          </div>

          <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Featured{" "}
            <span className="italic text-primary">Wedding Services</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            Discover talented wedding professionals and find the perfect
            services to make your special day unforgettable.
          </p>
        </div>

        {/* ---------- Services Grid ---------- */}
        {services.length > 0 ? (
          <>
            <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {services.map((service, index) => (
                <div
                  key={service._id}
                  className="animate-in fade-in-0 slide-in-from-bottom-6 fill-mode-both duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            {/* View all button */}
            <div className="mt-14 flex justify-center">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 rounded-full border border-primary/30 bg-card px-8 py-4 text-sm font-semibold text-primary shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
              >
                View All Services
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        ) : (
          /* ---------- Empty State ---------- */
          <div className="relative mx-auto mt-14 max-w-2xl overflow-hidden rounded-[2rem] border border-dashed border-accent/60 bg-card/70 px-6 py-16 text-center shadow-sm backdrop-blur-sm sm:px-12">
            <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
              <Heart className="size-7 text-primary" />
            </div>

            <h3 className="relative mt-6 font-heading text-3xl font-semibold text-foreground">
              Beautiful Services Are on Their Way
            </h3>

            <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              We are getting ready to bring you wonderful wedding services.
              Check back soon for more inspiration.
            </p>

            <Link
              href="/services"
              className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
            >
              Browse Services
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* ---------- Vendor CTA Strip ---------- */}
        <div className="relative mt-20 overflow-hidden rounded-[2rem] bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-12">
          <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <Sparkles className="size-4" />
                For Wedding Professionals
              </p>
              <h3 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
                Offer Wedding Services?
              </h3>
              <p className="mt-2 max-w-lg text-sm leading-7 text-primary-foreground/75">
                Join WedPlan as a vendor and reach couples who are looking for
                exactly what you do.
              </p>
            </div>

            <Link
              href="/signup"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              Join as a Vendor
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
