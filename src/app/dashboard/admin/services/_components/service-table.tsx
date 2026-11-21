"use client";

import Image from "next/image";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  MapPin,
  Power,
  PowerOff,
  SearchX,
  ShieldCheck,
  Store,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Service } from "@/types/service";

interface ServiceTableProps {
  services: Service[];
  onViewDetails: (service: Service) => void;
  onReviewStatus: (service: Service) => void;
  onToggleActive: (service: Service) => void;
  onDeleteService: (service: Service) => void;
  onResetFilters?: () => void;
}

const approvalConfig = {
  approved: {
    label: "Approved",
    icon: CheckCircle2,
    badge:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    bar: "from-emerald-400 to-emerald-600",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    badge:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    bar: "from-amber-400 to-amber-600",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400",
    bar: "from-rose-400 to-rose-600",
  },
};

type ApprovalKey = keyof typeof approvalConfig;

function formatDate(dateString?: string) {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

/* ---------- Action button ---------- */

function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = "default",
  ariaLabel,
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
  variant?: "primary" | "default" | "success" | "danger";
  ariaLabel: string;
}) {
  const variants = {
    primary:
      "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30",
    default:
      "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-primary",
    success:
      "border-border bg-card text-foreground hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400",
    danger:
      "border-rose-500/30 bg-rose-500/5 text-rose-600 hover:border-rose-500/60 hover:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-1 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 ${variants[variant]}`}
    >
      <Icon className="size-3.5 shrink-0" />
      {label}
    </button>
  );
}

/* ---------- Service card ---------- */

function ServiceCard({
  service,
  onViewDetails,
  onReviewStatus,
  onToggleActive,
  onDeleteService,
}: {
  service: Service;
  onViewDetails: (service: Service) => void;
  onReviewStatus: (service: Service) => void;
  onToggleActive: (service: Service) => void;
  onDeleteService: (service: Service) => void;
}) {
  const approvalKey = (service.status || "pending") as ApprovalKey;
  const approval = approvalConfig[approvalKey] ?? approvalConfig.pending;
  const ApprovalIcon = approval.icon;

  const primaryImage = service.images?.[0] ?? null;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-xl hover:shadow-primary/10">
      {/* Approval line: ছোট কার্ডে উপরে, চওড়া কার্ডে বামে */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${approval.bar} @[56rem]:inset-x-auto @[56rem]:inset-y-0 @[56rem]:left-0 @[56rem]:h-auto @[56rem]:w-1.5 @[56rem]:bg-gradient-to-b`}
      />

      <div className="pt-1.5 @[56rem]:grid @[56rem]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_10.5rem_20rem] @[56rem]:items-center @[56rem]:gap-5 @[56rem]:py-4 @[56rem]:pt-4">
        {/* ---------- Column 1: service ---------- */}
        <div className="flex items-center gap-3.5 p-5 pb-3 @[56rem]:p-0 @[56rem]:pl-6">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary ring-2 ring-accent/30 @[56rem]:size-20">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={service.serviceName}
                fill
                sizes="80px"
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  service.isActive ? "" : "opacity-70 grayscale"
                }`}
              />
            ) : (
              <Layers className="size-6 text-muted-foreground/50" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="truncate font-heading text-xl font-semibold leading-tight text-foreground"
              title={service.serviceName}
            >
              {service.serviceName}
            </h3>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="max-w-full truncate rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                {service.category}
              </span>

              <span className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0 text-accent" />
                <span className="truncate" title={service.location}>
                  {service.location}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* ---------- Column 2: vendor + date ---------- */}
        <div className="mx-5 space-y-1.5 border-t border-dashed border-border py-3 text-xs @[56rem]:mx-0 @[56rem]:border-0 @[56rem]:py-0">
          <div className="min-w-0">
            <p
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground"
              title={service.vendorName}
            >
              <Store className="size-3.5 shrink-0 text-accent" />
              <span className="truncate">
                {service.vendorName || "Unknown Vendor"}
              </span>
            </p>

            <p
              className="mt-0.5 truncate pl-5 text-[11px] text-muted-foreground"
              title={service.vendorEmail}
            >
              {service.vendorEmail || "N/A"}
            </p>
          </div>

          <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Calendar className="size-3.5 shrink-0 text-accent" />
            Submitted {formatDate(service.createdAt)}
          </p>
        </div>

        {/* ---------- Column 3: price + badges ---------- */}
        <div className="flex items-center justify-between gap-3 px-5 pb-4 @[56rem]:flex-col @[56rem]:items-start @[56rem]:justify-center @[56rem]:gap-2 @[56rem]:p-0">
          <p className="font-heading text-2xl font-semibold leading-none text-primary">
            ${service.price.toLocaleString("en-BD")}
          </p>

          <div className="flex flex-wrap items-center justify-end gap-1.5 @[56rem]:justify-start">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${approval.badge}`}
            >
              <ApprovalIcon className="size-3" />
              {approval.label}
            </span>

            {service.isActive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* ---------- Column 4: actions ---------- */}
        <div className="grid grid-cols-4 gap-2 border-t border-border bg-secondary/40 p-3 @[56rem]:border-0 @[56rem]:bg-transparent @[56rem]:p-0 @[56rem]:pr-5">
          <ActionButton
            label="View"
            icon={Eye}
            variant="primary"
            onClick={() => onViewDetails(service)}
            ariaLabel={`View details for ${service.serviceName}`}
          />
          <ActionButton
            label="Review"
            icon={ShieldCheck}
            onClick={() => onReviewStatus(service)}
            ariaLabel={`Review status for ${service.serviceName}`}
          />
          <ActionButton
            label={service.isActive ? "Pause" : "Activate"}
            icon={service.isActive ? PowerOff : Power}
            variant={service.isActive ? "default" : "success"}
            onClick={() => onToggleActive(service)}
            ariaLabel={`${service.isActive ? "Deactivate" : "Activate"} ${service.serviceName}`}
          />
          <ActionButton
            label="Delete"
            icon={Trash2}
            variant="danger"
            onClick={() => onDeleteService(service)}
            ariaLabel={`Delete service ${service.serviceName}`}
          />
        </div>
      </div>
    </article>
  );
}

/* ---------- Main component ---------- */

export default function ServiceTable({
  services,
  onViewDetails,
  onReviewStatus,
  onToggleActive,
  onDeleteService,
  onResetFilters,
}: ServiceTableProps) {
  if (services.length === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-accent/60 bg-card/70 p-10 text-center sm:p-14">
        <div className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
          <SearchX className="size-7" />
        </div>

        <h3 className="relative mt-5 font-heading text-2xl font-semibold text-foreground">
          No services match your criteria
        </h3>

        <p className="relative mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Try adjusting your search query, selecting different filters, or
          clearing your active filters.
        </p>

        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="relative mt-5 cursor-pointer rounded-full"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    // mobile: 1 • tablet: 2 • PC: 1 (চওড়া কার্ড)
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[56rem]:grid-cols-1">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onViewDetails={onViewDetails}
            onReviewStatus={onReviewStatus}
            onToggleActive={onToggleActive}
            onDeleteService={onDeleteService}
          />
        ))}
      </div>
    </div>
  );
}
