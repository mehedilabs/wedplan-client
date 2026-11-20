import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";

interface BookingStatsProps {
  total: number;
  pending: number;
  confirmed: number;
  rejected: number;
}

const statsConfig = [
  {
    label: "Total Requests",
    description: "All booking requests",
    icon: CalendarDays,
    color: "text-primary",
  },
  {
    label: "Pending",
    description: "Awaiting your decision",
    icon: Clock3,
    color: "text-amber-600",
  },
  {
    label: "Confirmed",
    description: "Accepted bookings",
    icon: CheckCircle2,
    color: "text-emerald-600",
  },
  {
    label: "Rejected",
    description: "Declined requests",
    icon: XCircle,
    color: "text-rose-600",
  },
];

export default function BookingStats({
  total,
  pending,
  confirmed,
  rejected,
}: BookingStatsProps) {
  const values = [total, pending, confirmed, rejected];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 shadow-xs transition-shadow hover:shadow-sm sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                {stat.label}
              </p>

              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </span>
            </div>

            <div className="mt-3">
              <p className={`text-2xl font-bold tracking-tight ${stat.color}`}>
                {values[index]}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
