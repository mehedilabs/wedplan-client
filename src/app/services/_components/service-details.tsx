"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Images,
  Info,
  Mail,
  MapPin,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import type { Service } from "@/types/service";

interface ServiceDetailsProps {
  service: Service;
}

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  const { data: session, isPending } = authClient.useSession();
  const [activeIndex, setActiveIndex] = useState(0);

  const userRole = session?.user?.role;
  const isVendor = userRole === "vendor";
  const isCustomer = userRole === "customer";

  const images = service.images ?? [];
  const activeImage = images[activeIndex];
  const vendorInitial = service.vendorName?.charAt(0).toUpperCase() ?? "V";

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background px-4 pb-14 pt-6 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-32 top-16 -z-10 size-80 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <Link
          href="/services"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Services
        </Link>

        {/* Header */}
        <header className="mt-4">
          <span className="inline-flex rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
            {service.category}
          </span>

          <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {service.serviceName}
          </h1>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-accent" />
            {service.location}
          </p>
        </header>

        {/* Main grid */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
          {/* ===== Left: Gallery + About ===== */}
          <div className="space-y-5">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-[3px] border-card bg-secondary shadow-lg shadow-primary/10 sm:aspect-[16/10]">
                {activeImage ? (
                  <Image
                    key={activeImage}
                    src={activeImage}
                    alt={service.serviceName}
                    fill
                    priority
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="animate-in fade-in-0 object-cover duration-500"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Images className="size-8 opacity-50" />
                    <span className="text-sm">No image available</span>
                  </div>
                )}

                {images.length > 1 && (
                  <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                    <Images className="size-3.5" />
                    {activeIndex + 1} / {images.length}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, index) => (
                    <button
                      key={src + index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                      className={`relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 sm:w-20 ${
                        index === activeIndex
                          ? "border-accent"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="5rem"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* About */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                About This <span className="italic text-primary">Service</span>
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {service.description}
              </p>
            </section>
          </div>

          {/* ===== Right: Sticky card ===== */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-primary/10">
              {/* Price */}
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Starting from
                  </p>
                  <p className="mt-1 font-heading text-4xl font-semibold leading-none text-primary">
                    ৳{service.price.toLocaleString("en-BD")}
                  </p>
                </div>
              </div>

              {/* Provider */}
              <div className="mt-5 flex items-center gap-3 rounded-xl bg-secondary p-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground ring-2 ring-accent/50">
                  {vendorInitial}
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Service Provider
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {service.vendorName}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="size-3 shrink-0 text-accent" />
                    <span className="truncate">{service.vendorEmail}</span>
                  </p>
                </div>
              </div>

              <div className="my-5 border-t border-dashed border-border" />

              {/* Booking */}
              {isPending ? (
                <div className="space-y-2.5">
                  <div className="h-5 w-2/3 animate-pulse rounded-full bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                  <div className="h-11 w-full animate-pulse rounded-full bg-muted" />
                </div>
              ) : isVendor ? (
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <Info className="size-4" />
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-foreground">
                      Booking Unavailable
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Vendor accounts cannot submit customer booking requests.
                      Please sign in with a Customer account to book services.
                    </p>
                  </div>
                </div>
              ) : isCustomer ? (
                <>
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Request a Booking
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    Reserve this vendor for your wedding date and share
                    celebration details.
                  </p>

                  {/* TODO: booking form বানালে এই button-এ জুড়ে দাও */}
                  <button
                    type="button"
                    className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
                  >
                    <CalendarHeart className="size-4" />
                    Request a Booking
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </>
              ) : (
                <>
                  <h2 className="font-heading text-xl font-semibold text-foreground">
                    Request a Booking
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    Please sign in with a Customer account to request a booking
                    for this service.
                  </p>

                  <Link
                    href="/login"
                    className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
                  >
                    Sign in to Book
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
