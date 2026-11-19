"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { createBooking, getBookingStatus } from "@/lib/api/booking-api";
import type { Service } from "@/types/service";
import { toast } from "@/components/ui/toast";

interface ServiceDetailsProps {
  service: Service;
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

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
          {/* Left: Gallery + About */}
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

          {/* Right: Sticky card */}
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
                  {isCheckingBookingStatus ? (
                    <div className="space-y-3">
                      <div className="h-6 w-2/3 animate-pulse rounded-full bg-muted" />
                      <div className="h-4 w-full animate-pulse rounded-full bg-muted" />
                      <div className="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
                    </div>
                  ) : bookingSuccess ? (
                    <div className="rounded-xl border border-green-600/20 bg-green-600/5 p-4">
                      <h2 className="font-heading text-xl font-semibold text-foreground">
                        Booking Request Sent!
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        Your booking request has been submitted successfully.
                        The service provider will review your request.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="font-heading text-xl font-semibold text-foreground">
                        Request a Booking
                      </h2>

                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        Reserve this vendor for your wedding date and share
                        celebration details.
                      </p>

                      {!isBookingFormOpen ? (
                        <button
                          type="button"
                          onClick={() => setIsBookingFormOpen(true)}
                          className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
                        >
                          <CalendarHeart className="size-4" />
                          Request a Booking
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      ) : (
                        <form
                          onSubmit={handleBookingSubmit}
                          className="mt-5 space-y-4"
                        >
                          <div className="space-y-1.5">
                            <label
                              htmlFor="eventDate"
                              className="text-[13px] font-medium text-foreground"
                            >
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
                              className="text-[13px] font-medium text-foreground"
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
                            <label
                              htmlFor="message"
                              className="text-[13px] font-medium text-foreground"
                            >
                              Message{" "}
                              <span className="text-destructive">*</span>
                            </label>

                            <textarea
                              id="message"
                              name="message"
                              rows={4}
                              placeholder="Tell the vendor about your wedding plans..."
                              required
                              maxLength={1000}
                              className={`${fieldClass} resize-y`}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 disabled:pointer-events-none disabled:opacity-60"
                          >
                            <CalendarHeart className="size-4" />
                            {isSubmitting
                              ? "Submitting Request..."
                              : "Submit Booking Request"}
                          </button>

                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setIsBookingFormOpen(false)}
                            className="w-full py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
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
