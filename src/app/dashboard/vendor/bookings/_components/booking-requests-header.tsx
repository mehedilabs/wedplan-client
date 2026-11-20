import { CalendarCheck } from "lucide-react";

export default function BookingRequestsHeader() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarCheck className="size-5" />
        </span>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
            Vendor Workspace
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Booking Requests
          </h1>
        </div>
      </div>

      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Review booking requests from couples, check their event details, and
        manage your bookings by accepting or rejecting pending requests.
      </p>
    </div>
  );
}
