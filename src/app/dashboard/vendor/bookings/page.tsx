"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CalendarDays, Loader2, RefreshCw } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
  getVendorBookings,
  acceptBooking,
  rejectBooking,
  type VendorBooking,
} from "@/lib/api/booking-api";
import { Button } from "@/components/ui/button";

import BookingRequestsHeader from "./_components/booking-requests-header";
import BookingStats from "./_components/booking-stats";
import BookingRequestCard from "./_components/booking-request-card";
import BookingRequestSkeleton from "./_components/booking-request-skeleton";
import { toast } from "@/components/ui/toast";

export default function VendorBookingRequestsPage() {
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const vendorId = session?.user?.id;

  const [bookings, setBookings] = useState<VendorBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    if (!vendorId) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await getVendorBookings(vendorId);
      setBookings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load booking requests.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (isSessionPending || !vendorId) return;

    const timeoutId = setTimeout(() => {
      fetchBookings();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [vendorId, isSessionPending, fetchBookings]);

  const handleBookingAction = async (
    bookingId: string,
    action: "accept" | "reject",
  ) => {
    if (!vendorId) {
      toast.add({
        title: "Sign in required",
        description: "Please sign in to manage booking requests.",
        type: "error",
      });
      return;
    }

    try {
      setIsUpdatingId(bookingId);
      setError("");

      if (action === "accept") {
        await acceptBooking(bookingId, vendorId);
      } else {
        await rejectBooking(bookingId, vendorId);
      }

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: action === "accept" ? "confirmed" : "rejected",
              }
            : booking,
        ),
      );

      toast.add({
        title: action === "accept" ? "Booking Accepted" : "Booking Rejected",
        description:
          action === "accept"
            ? "The booking request has been accepted successfully."
            : "The booking request has been rejected successfully.",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "Action Failed",
        description:
          err instanceof Error
            ? err.message
            : `Failed to ${action} booking request.`,
        type: "error",
      });
    } finally {
      setIsUpdatingId(null);
    }
  };

  if (isSessionPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
            <Loader2 className="size-7 animate-spin text-primary" />
          </span>
          <p className="text-sm font-medium text-muted-foreground">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-sm">
        <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
          <CalendarDays className="size-7 text-primary" />
        </div>

        <h2 className="relative mt-5 font-heading text-2xl font-semibold text-foreground">
          Sign in required
        </h2>

        <p className="relative mt-2 text-sm leading-6 text-muted-foreground">
          Please sign in to view your booking requests.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-1 sm:space-y-8">
      <BookingRequestsHeader />

      {/* Booking Statistics */}
      {!isLoading && !error && bookings.length > 0 && (
        <BookingStats
          total={bookings.length}
          pending={
            bookings.filter((booking) => booking.status === "pending").length
          }
          confirmed={
            bookings.filter((booking) => booking.status === "confirmed").length
          }
          rejected={
            bookings.filter((booking) => booking.status === "rejected").length
          }
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm text-rose-700 dark:text-rose-400">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            disabled={isLoading}
            className="shrink-0 rounded-full border-rose-500/30 text-rose-700 hover:bg-rose-500/10 dark:text-rose-400"
          >
            <RefreshCw className="mr-2 size-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-5">
          {[1, 2].map((item) => (
            <BookingRequestSkeleton key={item} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && bookings.length === 0 && (
        <div className="relative overflow-hidden rounded-3xl border border-dashed border-accent/60 bg-card/70 px-6 py-16 text-center sm:px-8 sm:py-20">
          <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

          <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-primary/10 ring-8 ring-primary/5">
            <CalendarDays className="size-9 text-primary" />
          </div>

          <h2 className="relative mt-6 font-heading text-3xl font-semibold text-foreground">
            No booking requests yet
          </h2>

          <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            When customers book your wedding services, their requests will
            appear here. You can review the event details and manage each
            request from this workspace.
          </p>
        </div>
      )}

      {/* Booking Request List */}
      {!isLoading && bookings.length > 0 && (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <BookingRequestCard
              key={booking._id}
              booking={booking}
              onAccept={() => handleBookingAction(booking._id, "accept")}
              onReject={() => handleBookingAction(booking._id, "reject")}
              isUpdating={isUpdatingId === booking._id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
