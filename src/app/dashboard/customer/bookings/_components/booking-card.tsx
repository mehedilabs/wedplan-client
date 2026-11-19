import {
  CalendarDays,
  MapPin,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wallet,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { CustomerBooking } from "@/lib/api/booking-api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const statusConfig: Record<
  CustomerBooking["status"],
  {
    bg: string;
    text: string;
    ring: string;
    icon: typeof Clock;
    label: string;
    gradient: string;
  }
> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-200",
    icon: Clock,
    label: "Pending",
    gradient: "from-amber-400 to-orange-500",
  },
  confirmed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    icon: CheckCircle2,
    label: "Confirmed",
    gradient: "from-emerald-400 to-teal-500",
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-200",
    icon: XCircle,
    label: "Rejected",
    gradient: "from-rose-400 to-red-500",
  },
  cancelled: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    ring: "ring-slate-200",
    icon: AlertCircle,
    label: "Cancelled",
    gradient: "from-slate-400 to-gray-500",
  },
};

interface BookingCardProps {
  booking: CustomerBooking;
  onCancel: () => void;
  isCancelling: boolean;
}

export default function BookingCard({
  booking,
  onCancel,
  isCancelling,
}: BookingCardProps) {
  const config = statusConfig[booking.status];

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
      <div
        className={`absolute inset-y-0 left-0 hidden w-1.5 bg-gradient-to-b sm:block ${config.gradient}`}
      />

      <div className="flex flex-col sm:flex-row">
        {/* Service Image */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden bg-muted sm:h-auto sm:w-72 lg:w-80">
          {booking.image ? (
            <img
              src={booking.image}
              alt={booking.serviceName}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center bg-gradient-to-br from-muted to-muted/40">
              <CalendarDays className="size-12 text-muted-foreground/40" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute left-3 top-3 sm:hidden">
            <StatusPill config={config} />
          </div>
        </div>

        {/* Booking Information */}
        <div className="flex flex-1 flex-col justify-between gap-5 p-5 sm:p-7">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-heading text-xl font-bold text-foreground sm:text-2xl">
                  {booking.serviceName}
                </h2>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="size-3.5 shrink-0" />
                  <span>by</span>
                  <span className="font-medium text-foreground/80">
                    {booking.vendorName}
                  </span>
                </p>
              </div>

              <div className="hidden sm:block">
                <StatusPill config={config} />
              </div>
            </div>

            {/* Event Information */}
            <div className="grid gap-2.5 text-sm text-muted-foreground sm:grid-cols-2">
              <MetaItem
                icon={<CalendarDays className="size-4 text-primary" />}
                label="Event Date"
                value={new Date(booking.eventDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />

              <MetaItem
                icon={<MapPin className="size-4 text-primary" />}
                label="Location"
                value={booking.eventLocation}
              />
            </div>
          </div>

          {/* Card Footer */}
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {booking.price !== null && (
                <div className="flex items-baseline gap-1.5">
                  <Wallet className="size-4 text-primary" />
                  <span className="font-heading text-lg font-bold text-primary">
                    ৳{booking.price.toLocaleString("en-BD")}
                  </span>
                </div>
              )}

              <span className="text-xs text-muted-foreground">
                ID:{" "}
                <span className="font-mono text-foreground/60">
                  #{booking._id.slice(-6)}
                </span>
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={`/services/${booking.serviceId}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:gap-2.5 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
              >
                View Service
                <ExternalLink className="size-3.5" />
              </Link>

              {booking.status === "pending" && (
                <AlertDialog>
                  <AlertDialogTrigger
                    disabled={isCancelling}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:pointer-events-none disabled:opacity-50"
                  >
                    <X className="size-4" />
                    Cancel Booking
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your booking for{" "}
                        <span className="font-semibold text-foreground">
                          {booking.serviceName}
                        </span>
                        ? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isCancelling}>
                        Keep Booking
                      </AlertDialogCancel>

                      <AlertDialogAction
                        onClick={onCancel}
                        disabled={isCancelling}
                        className="bg-rose-600 text-white hover:bg-rose-700"
                      >
                        {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Status Badge */

function StatusPill({
  config,
}: {
  config: (typeof statusConfig)[CustomerBooking["status"]];
}) {
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${config.bg} ${config.text} ${config.ring}`}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

/* Booking Meta Information */

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-3.5 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
