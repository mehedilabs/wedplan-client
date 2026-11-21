"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Ban,
  Check,
  CheckCircle2,
  Clock3,
  ImageOff,
  Mail,
  MapPin,
  Quote,
  X,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { VendorBooking } from "@/lib/api/booking-api";

interface BookingRequestCardProps {
  booking: VendorBooking;
  onAccept: (bookingId: string) => void;
  onReject: (bookingId: string) => void;
  isUpdating?: boolean;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock3,
    badge:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    bar: "from-amber-400 to-amber-600",
    dot: "bg-amber-500",
    note: "Waiting for your decision",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    badge:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    bar: "from-emerald-400 to-emerald-600",
    dot: "bg-emerald-500",
    note: "You accepted this request",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    bar: "from-rose-400 to-rose-600",
    dot: "bg-rose-500",
    note: "You declined this request",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    badge: "border-border bg-muted text-muted-foreground",
    bar: "from-muted-foreground/40 to-muted-foreground/60",
    dot: "bg-muted-foreground",
    note: "This request was cancelled",
  },
};

function getCountdown(date: string) {
  const eventDay = new Date(date);
  const today = new Date();

  eventDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diff = Math.round(
    (eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diff < 0) return { label: "Event passed", tone: "muted" as const };
  if (diff === 0) return { label: "Today", tone: "hot" as const };
  if (diff === 1) return { label: "Tomorrow", tone: "hot" as const };
  if (diff <= 14) return { label: `In ${diff} days`, tone: "hot" as const };

  return { label: `In ${diff} days`, tone: "normal" as const };
}

const countdownStyle = {
  hot: "border-accent/50 bg-accent/15 text-foreground",
  normal: "border-border bg-card text-muted-foreground",
  muted: "border-border bg-muted text-muted-foreground",
};

export default function BookingRequestCard({
  booking,
  onAccept,
  onReject,
  isUpdating = false,
}: BookingRequestCardProps) {
  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "accept" | "reject" | null
  >(null);

  const openConfirmation = (action: "accept" | "reject") => {
    setSelectedAction(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedAction || isUpdating) return;

    if (selectedAction === "accept") {
      onAccept(booking._id);
    } else {
      onReject(booking._id);
    }

    setDialogOpen(false);
    setSelectedAction(null);
  };

  const eventDate = new Date(booking.eventDate);
  const month = eventDate.toLocaleDateString("en-US", { month: "short" });
  const day = eventDate.getDate();
  const weekday = eventDate.toLocaleDateString("en-US", { weekday: "long" });
  const fullDate = eventDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const countdown = getCountdown(booking.eventDate);

  const customerInitial = booking.customerName?.charAt(0).toUpperCase() ?? "C";

  return (
    <>
      <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-xl hover:shadow-primary/10">
        {/* Status gradient line */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${status.bar}`} />

        {/* ---------- Header ---------- */}
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-2xl bg-muted ring-2 ring-accent/30 sm:aspect-square sm:size-24">
            {booking.image ? (
              <Image
                src={booking.image}
                alt={booking.serviceName}
                fill
                sizes="(max-width: 640px) 100vw, 96px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <ImageOff className="size-5 opacity-60" />
                <span className="text-[10px]">No image</span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}
            >
              <span className="relative flex size-1.5">
                {booking.status === "pending" && (
                  <span
                    className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 ${status.dot}`}
                  />
                )}
                <span
                  className={`relative inline-flex size-1.5 rounded-full ${status.dot}`}
                />
              </span>
              {status.label}
            </span>

            <h2 className="mt-2 font-heading text-xl font-semibold leading-tight text-foreground sm:text-2xl">
              {booking.serviceName}
            </h2>

            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Received on{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {booking.price !== null && (
            <div className="flex shrink-0 flex-col rounded-2xl border border-accent/40 bg-accent/10 px-4 py-2.5 sm:items-end">
              <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Package Price
              </span>
              <span className="mt-0.5 font-heading text-2xl font-semibold leading-none text-primary">
                ${booking.price.toLocaleString("en-BD")}
              </span>
            </div>
          )}
        </div>

        {/* ---------- Event & Customer ---------- */}
        <div className="grid gap-3 px-4 pb-4 sm:px-6 sm:pb-5 lg:grid-cols-2">
          {/* Event */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/50 p-4">
            {/* Calendar badge */}
            <div className="w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-card text-center shadow-sm">
              <div className="bg-primary py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                {month}
              </div>
              <div className="py-1.5 font-heading text-3xl font-semibold leading-none text-foreground">
                {day}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                Event Date
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {weekday}
              </p>
              <p className="text-xs text-muted-foreground">{fullDate}</p>

              <span
                className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${countdownStyle[countdown.tone]}`}
              >
                {countdown.label}
              </span>
            </div>
          </div>

          {/* Customer + location */}
          <div className="rounded-2xl border border-border bg-secondary/50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Customer
            </p>

            <div className="mt-2.5 flex items-center gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground ring-2 ring-accent/40">
                {customerInitial}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {booking.customerName}
                </p>

                <a
                  href={`mailto:${booking.customerEmail}`}
                  className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate">{booking.customerEmail}</span>
                </a>
              </div>
            </div>

            <div className="mt-3 flex items-start gap-2 border-t border-dashed border-border pt-3 text-sm text-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" />
              <span className="break-words">{booking.eventLocation}</span>
            </div>
          </div>
        </div>

        {/* ---------- Message ---------- */}
        {booking.message && (
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="relative rounded-2xl border-l-4 border-accent bg-background/70 py-4 pl-5 pr-4">
              <Quote className="absolute right-3 top-3 size-6 text-accent/30" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Customer Message
              </p>

              <p className="mt-1.5 whitespace-pre-wrap break-words pr-6 text-sm italic leading-7 text-foreground">
                {booking.message}
              </p>
            </div>
          </div>
        )}

        {/* ---------- Footer ---------- */}
        {booking.status === "pending" ? (
          <div className="flex flex-col gap-3 border-t border-border bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Clock3 className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              {status.note}
            </p>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button
                variant="outline"
                className="w-full cursor-pointer rounded-full border-destructive/30 text-destructive hover:bg-destructive/5 sm:w-auto"
                disabled={isUpdating}
                onClick={() => openConfirmation("reject")}
              >
                <X className="size-4" />
                Reject
              </Button>

              <Button
                className="w-full rounded-full cursor-pointer shadow-md shadow-primary/25 sm:w-auto"
                disabled={isUpdating}
                onClick={() => openConfirmation("accept")}
              >
                <Check className="size-4" />
                Accept Request
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground sm:px-6 sm:text-sm">
            <StatusIcon className="size-4 shrink-0" />
            {status.note}
          </div>
        )}
      </article>

      {/* ---------- Confirmation dialog ---------- */}
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!isUpdating) {
            setDialogOpen(open);

            if (!open) {
              setSelectedAction(null);
            }
          }
        }}
      >
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <span
              className={`mx-auto flex size-14 items-center justify-center rounded-full ring-8 sm:mx-0 ${
                selectedAction === "reject"
                  ? "bg-rose-500/10 text-rose-600 ring-rose-500/5 dark:text-rose-400"
                  : "bg-emerald-500/10 text-emerald-600 ring-emerald-500/5 dark:text-emerald-400"
              }`}
            >
              {selectedAction === "reject" ? (
                <AlertTriangle className="size-6" />
              ) : (
                <CheckCircle2 className="size-6" />
              )}
            </span>

            <AlertDialogTitle className="font-heading text-2xl">
              {selectedAction === "accept"
                ? "Accept this booking request?"
                : "Reject this booking request?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {selectedAction === "accept"
                ? `You are about to confirm the booking request from ${booking.customerName}.`
                : `You are about to reject the booking request from ${booking.customerName}. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isUpdating}
              className="rounded-full cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={isUpdating}
              onClick={handleConfirm}
              className={`rounded-full cursor-pointer ${
                selectedAction === "reject"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : ""
              }`}
            >
              {isUpdating
                ? "Processing..."
                : selectedAction === "accept"
                  ? "Confirm Accept"
                  : "Confirm Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
