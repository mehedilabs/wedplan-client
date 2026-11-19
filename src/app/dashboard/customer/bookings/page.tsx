"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Loader2,
  Sparkles,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  getCustomerBookings,
  cancelBooking,
  type CustomerBooking,
} from "@/lib/api/booking-api";

import BookingCard from "./_components/booking-card";
import BookingCardSkeleton from "./_components/booking-card-skeleton";

export default function CustomerBookingsPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isCancellingId, setIsCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const customerId = session?.user?.id;

    if (!customerId) {
      return;
    }

    let isMounted = true;

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await getCustomerBookings(customerId);

        if (isMounted) {
          setBookings(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load your bookings",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, isSessionPending]);

  const handleCancelBooking = async (bookingId: string) => {
    const customerId = session?.user?.id;

    if (!customerId) {
      setError("Please sign in to cancel your booking.");
      return;
    }

    try {
      setIsCancellingId(bookingId);
      setError("");
      setSuccess("");

      await cancelBooking(bookingId, customerId);

      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking._id !== bookingId),
      );

      setSuccess("Your booking has been cancelled successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel your booking.",
      );
    } finally {
      setIsCancellingId(null);
    }
  };

  if (isSessionPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-9 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10">
          <CalendarDays className="size-8 text-primary" />
        </div>

        <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
          Sign in required
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Please sign in to view your bookings.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-8 px-1">
        <div className="animate-pulse rounded-3xl border border-border/50 bg-card p-7 sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-xl space-y-4">
              <div className="h-3 w-24 rounded-full bg-muted" />
              <div className="h-10 w-52 rounded-lg bg-muted" />
              <div className="h-4 w-full max-w-md rounded-full bg-muted" />
              <div className="h-4 w-3/4 rounded-full bg-muted" />
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="space-y-2 rounded-2xl border border-border/60 bg-background/70 px-5 py-3"
                >
                  <div className="mx-auto h-8 w-10 animate-pulse rounded-lg bg-muted" />
                  <div className="mx-auto h-3 w-14 animate-pulse rounded-full bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {[1, 2].map((item) => (
            <BookingCardSkeleton key={item} />
          ))}
        </div>
      </div>
    );
  }

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-1">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-7 sm:p-10">
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-16 left-1/4 size-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Dashboard
              </span>
            </div>

            <h1 className="mt-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Track the status of your wedding service requests and manage them
              all in one place.
            </p>
          </div>

          {bookings.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <StatCard label="Total" value={bookings.length} tone="primary" />
              <StatCard
                label="Confirmed"
                value={confirmedCount}
                tone="emerald"
              />
              <StatCard label="Pending" value={pendingCount} tone="amber" />
            </div>
          )}
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!error && bookings.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-card px-8 py-20 text-center">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-8 ring-primary/5">
            <CalendarDays className="size-11 text-primary" />
          </div>

          <h2 className="mt-6 font-heading text-2xl font-semibold text-foreground">
            No bookings yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Explore wedding services and book the vendors you love to make your
            special day unforgettable.
          </p>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:opacity-90 active:scale-[0.98]"
          >
            Browse Services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {/* Booking Cards */}
      {bookings.length > 0 && (
        <div className="grid gap-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={() => handleCancelBooking(booking._id)}
              isCancelling={isCancellingId === booking._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Statistics Card */

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "emerald" | "amber";
}) {
  const tones = {
    primary: "text-primary",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-center shadow-sm backdrop-blur">
      <p
        className={`font-heading text-2xl font-bold ${tones[tone]} sm:text-3xl`}
      >
        {value}
      </p>

      <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
