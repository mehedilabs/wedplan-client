"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  CheckCircle2,
  Crown,
  Images,
  Info,
  Mail,
  MapPin,
  Send,
  ListChecks,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { createBooking, getBookingStatus } from "@/lib/api/booking-api";
import type { Service } from "@/types/service";
import { toast } from "@/components/ui/toast";

interface ServiceDetailsProps {
  service: Service;
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

export default function ServiceDetails({ service }: ServiceDetailsProps) {
  const { data: session, isPending } = authClient.useSession();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isCheckingBookingStatus, setIsCheckingBookingStatus] = useState(true);

  const userRole = session?.user?.role;
  const isVendor = userRole === "vendor";
  const isCustomer = userRole === "customer";

  // Check existing booking status from the database

  useEffect(() => {
    if (isPending || !isCustomer || !session?.user?.id) {
      return;
    }

    let isMounted = true;

    const checkBookingStatus = async () => {
      try {
        const hasActiveBooking = await getBookingStatus(
          String(service._id),
          session.user.id,
        );

        if (isMounted) {
          setBookingSuccess(hasActiveBooking);
        }
      } catch (error) {
        console.error("Failed to check booking status:", error);

        if (isMounted) {
          toast.add({
            title: "Unable to check booking status",
            description:
              error instanceof Error
                ? error.message
                : "Please refresh the page and try again.",
            type: "error",
          });
        }
      } finally {
        if (isMounted) {
          setIsCheckingBookingStatus(false);
        }
      }
    };

    void checkBookingStatus();

    return () => {
      isMounted = false;
    };
  }, [isPending, isCustomer, session?.user?.id, service._id]);

  const images = service.images ?? [];
  const activeImage = images[activeIndex];
  const vendorInitial = service.vendorName?.charAt(0).toUpperCase() ?? "V";
  const isPremium = Boolean(service.isPremium);

  const today = new Date();
  const minEventDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user?.id || !session.user.name || !session.user.email) {
      toast.add({
        title: "Account information unavailable",
        description: "Please sign in again and try booking.",
        type: "error",
      });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const eventDate = String(formData.get("eventDate")).trim();
    const eventLocation = String(formData.get("eventLocation")).trim();
    const message = String(formData.get("message")).trim();

    setIsSubmitting(true);

    try {
      await createBooking({
        serviceId: String(service._id),
        customerId: session.user.id,
        customerName: session.user.name,
        customerEmail: session.user.email,
        eventDate,
        eventLocation,
        message,
      });

      setBookingSuccess(true);
      setIsBookingFormOpen(false);
      form.reset();

      toast.add({
        title: "Booking request submitted!",
        description:
          "Your request has been sent to the service provider successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to submit booking:", error);

      toast.add({
        title: "Booking failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-x-clip bg-background px-4 pb-16 pt-5 sm:px-8 lg:px-12">
      {/* Soft glows */}
      <div className="pointer-events-none absolute -left-40 top-24 -z-10 size-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/2 -z-10 size-[28rem] rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm transition-all hover:border-primary/40 hover:text-primary sm:text-sm"
        >
          <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Browse Services
        </Link>

        {/* Main grid */}
        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.3fr_1fr] lg:gap-7">
          {/* ================= Left (scrolls) ================= */}
          <div className="space-y-4">
            {/* ---------- Gallery ---------- */}
            <div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-[3px] border-card bg-secondary shadow-lg shadow-primary/10 lg:aspect-[16/9]">
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

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/15" />

                <span className="absolute left-3 top-3 max-w-[55%] truncate rounded-full border border-white/30 bg-card/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-md backdrop-blur-md">
                  {service.category}
                </span>

                {isPremium && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-gradient-to-r from-accent via-[#E6C77E] to-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-accent-foreground shadow-lg shadow-black/25">
                    <Crown className="size-3.5" />
                    Premium Vendor
                  </span>
                )}

                {images.length > 1 && (
                  <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    <Images className="size-3" />
                    {activeIndex + 1} / {images.length}
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
                  {images.map((src, index) => (
                    <button
                      key={src + index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show image ${index + 1}`}
                      className={`relative aspect-[4/3] w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 sm:w-16 ${
                        index === activeIndex
                          ? "border-accent"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="4rem"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---------- Details card ---------- */}
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-heading text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
                    {service.serviceName}
                  </h1>

                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-accent" />
                    {service.location}
                  </p>
                </div>

                {/* Price chip */}
                <div className="flex flex-col rounded-xl border border-accent/40 bg-accent/10 px-4 py-2">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Starting Package
                  </span>
                  <span className="mt-0.5 font-heading text-2xl font-semibold leading-none text-primary">
                    ${service.price.toLocaleString("en-BD")}
                  </span>
                </div>
              </div>

              <div className="my-5 border-t border-border" />

              {/* About */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  About This{" "}
                  <span className="italic text-primary">Service</span>
                </h2>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {service.description}
                </p>
              </div>

              <div className="my-5 border-t border-border" />

              {/* Provider */}
              <div>
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Service <span className="italic text-primary">Provider</span>
                </h2>

                <div
                  className={`mt-3 flex items-center gap-3 rounded-xl border p-3 ${
                    isPremium
                      ? "border-accent/60 bg-accent/10"
                      : "border-border bg-secondary/60"
                  }`}
                >
                  <span className="relative shrink-0">
                    <span
                      className={`flex size-10 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground ring-2 ${
                        isPremium ? "ring-accent" : "ring-accent/40"
                      }`}
                    >
                      {vendorInitial}
                    </span>

                    {isPremium && (
                      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border-2 border-card bg-accent text-accent-foreground shadow-sm">
                        <Crown className="size-2.5" />
                      </span>
                    )}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {service.vendorName}
                      </p>

                      {isPremium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-accent via-[#E6C77E] to-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                          <Crown className="size-3" />
                          Premium
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="size-3 shrink-0 text-accent" />
                      <span className="truncate">{service.vendorEmail}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ================= Right: Sticky booking card ================= */}
          <aside className="space-y-3 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-primary/10">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent to-primary/60" />

              <div className="p-5 sm:p-6">
                {isPending ? (
                  <div className="space-y-3">
                    <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-12 w-full animate-pulse rounded-full bg-muted" />
                  </div>
                ) : isVendor ? (
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
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
                    {isCheckingBookingStatus ? (
                      <div className="space-y-3">
                        <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
                        <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                        <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
                      </div>
                    ) : bookingSuccess ? (
                      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 ring-8 ring-emerald-500/10 dark:text-emerald-400">
                          <CheckCircle2 className="size-6" />
                        </span>

                        <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">
                          Booking Request Sent!
                        </h2>

                        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                          Your booking request has been submitted successfully.
                          The service provider will review your request.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CalendarHeart className="size-5" />
                          </span>

                          <h2 className="font-heading text-xl font-semibold text-foreground">
                            Request a Booking
                          </h2>
                        </div>

                        <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                          Reserve this vendor for your wedding date and share
                          celebration details.
                        </p>

                        {!isBookingFormOpen ? (
                          <button
                            type="button"
                            onClick={() => setIsBookingFormOpen(true)}
                            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                          >
                            Request a Booking
                            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </button>
                        ) : (
                          <form
                            onSubmit={handleBookingSubmit}
                            className="mt-5 space-y-3.5"
                          >
                            <div className="space-y-1.5">
                              <label htmlFor="eventDate" className={labelClass}>
                                Event Date{" "}
                                <span className="text-destructive">*</span>
                              </label>

                              <input
                                id="eventDate"
                                name="eventDate"
                                type="date"
                                min={minEventDate}
                                required
                                className={fieldClass}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label
                                htmlFor="eventLocation"
                                className={labelClass}
                              >
                                Event Location{" "}
                                <span className="text-destructive">*</span>
                              </label>

                              <input
                                id="eventLocation"
                                name="eventLocation"
                                type="text"
                                placeholder="e.g. Dhaka, Bangladesh"
                                required
                                maxLength={150}
                                className={fieldClass}
                              />
                            </div>

                            <div className="space-y-1.5">
                              <label htmlFor="message" className={labelClass}>
                                Message{" "}
                                <span className="text-destructive">*</span>
                              </label>

                              <textarea
                                id="message"
                                name="message"
                                rows={3}
                                placeholder="Tell the vendor about your wedding plans..."
                                required
                                maxLength={1000}
                                className={`${fieldClass} resize-y`}
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-60"
                            >
                              <Send className="size-4" />
                              {isSubmitting
                                ? "Submitting Request..."
                                : "Submit Booking Request"}
                            </button>

                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => setIsBookingFormOpen(false)}
                              className="w-full rounded-full border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CalendarHeart className="size-5" />
                      </span>

                      <h2 className="font-heading text-xl font-semibold text-foreground">
                        Request a Booking
                      </h2>
                    </div>

                    <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
                      Please sign in with a Customer account to request a
                      booking for this service.
                    </p>

                    <Link
                      href="/login"
                      className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                    >
                      Sign in to Book
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Small info notes */}
            <ul className="space-y-2 rounded-xl border border-dashed border-border bg-card/60 px-4 py-3 text-xs text-muted-foreground backdrop-blur-sm">
              <li className="flex items-center gap-2.5">
                <Send className="size-3.5 shrink-0 text-accent" />
                Your request goes directly to the service provider.
              </li>
              <li className="flex items-center gap-2.5">
                <ListChecks className="size-3.5 shrink-0 text-accent" />
                Track its status anytime from My Bookings.
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
