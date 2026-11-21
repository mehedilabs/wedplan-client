"use client";

import {
  Check,
  Search,
  X,
  RotateCcw,
  Filter,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ServiceCounts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  inactive: number;
}

export const WEDDING_CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

interface ServiceFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (avail: string) => void;
  counts: ServiceCounts;
  hasActiveFilters: boolean;
  onReset: () => void;
}

type Tone = "primary" | "sky" | "ink" | "emerald" | "amber" | "rose";

const toneStyles: Record<
  Tone,
  { icon: string; value: string; selected: string; tick: string }
> = {
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-foreground",
    selected: "border-primary bg-primary/5 ring-2 ring-primary/20",
    tick: "bg-primary text-primary-foreground",
  },
  sky: {
    icon: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    value: "text-foreground",
    selected: "border-sky-500 bg-sky-500/5 ring-2 ring-sky-500/20",
    tick: "bg-sky-500 text-white",
  },
  ink: {
    icon: "bg-foreground text-background",
    value: "text-foreground",
    selected: "border-foreground bg-foreground/5 ring-2 ring-foreground/15",
    tick: "bg-foreground text-background",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-400",
    selected: "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/20",
    tick: "bg-emerald-500 text-white",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    value: "text-amber-600 dark:text-amber-400",
    selected: "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/20",
    tick: "bg-amber-500 text-white",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    value: "text-rose-600 dark:text-rose-400",
    selected: "border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/20",
    tick: "bg-rose-500 text-white",
  },
};

function MetricTile({
  label,
  value,
  icon: Icon,
  tone,
  isSelected,
  onClick,
  className = "",
}: {
  label: string;
  value: number;
  icon: typeof Layers;
  tone: Tone;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}) {
  const styles = toneStyles[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`relative flex cursor-pointer items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isSelected
          ? styles.selected
          : "border-border bg-card hover:border-accent/50"
      } ${className}`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
      >
        <Icon className="size-4" />
      </span>

      <span className="min-w-0 leading-tight">
        <span
          className={`block font-heading text-xl font-semibold leading-none ${styles.value}`}
        >
          {value}
        </span>

        <span className="mt-0.5 block truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </span>

      {isSelected && (
        <span
          className={`absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full ${styles.tick}`}
        >
          <Check className="size-2.5" />
        </span>
      )}
    </button>
  );
}

export default function ServiceFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedAvailability,
  onAvailabilityChange,
  counts,
  hasActiveFilters,
  onReset,
}: ServiceFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Metric / Quick Filter Tiles */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Services */}
        <MetricTile
          label="Total Services"
          value={counts.total}
          icon={Layers}
          tone="primary"
          isSelected={
            selectedStatus === "all" &&
            selectedCategory === "all" &&
            selectedAvailability === "all"
          }
          onClick={onReset}
        />

        {/* Pending Services */}
        <MetricTile
          label="Pending"
          value={counts.pending}
          icon={Clock}
          tone="amber"
          isSelected={selectedStatus === "pending"}
          onClick={() =>
            onStatusChange(selectedStatus === "pending" ? "all" : "pending")
          }
        />

        {/* Approved Services */}
        <MetricTile
          label="Approved"
          value={counts.approved}
          icon={CheckCircle2}
          tone="emerald"
          isSelected={selectedStatus === "approved"}
          onClick={() =>
            onStatusChange(selectedStatus === "approved" ? "all" : "approved")
          }
        />

        {/* Rejected Services */}
        <MetricTile
          label="Rejected"
          value={counts.rejected}
          icon={XCircle}
          tone="rose"
          isSelected={selectedStatus === "rejected"}
          onClick={() =>
            onStatusChange(selectedStatus === "rejected" ? "all" : "rejected")
          }
        />

        {/* Active Services */}
        <MetricTile
          label="Active"
          value={counts.active}
          icon={Power}
          tone="emerald"
          isSelected={selectedAvailability === "active"}
          onClick={() =>
            onAvailabilityChange(
              selectedAvailability === "active" ? "all" : "active",
            )
          }
        />

        {/* Inactive Services */}
        <MetricTile
          label="Inactive"
          value={counts.inactive}
          icon={PowerOff}
          tone="ink"
          isSelected={selectedAvailability === "inactive"}
          onClick={() =>
            onAvailabilityChange(
              selectedAvailability === "inactive" ? "all" : "inactive",
            )
          }
        />
      </div>

      {/* Search and Dropdowns Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs lg:flex-row lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by service name, vendor name, email, or location..."
            className="w-full rounded-xl border border-border/80 bg-background py-2.5 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search query"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Selector */}
          <div className="relative min-w-[130px] flex-1 sm:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by approval status"
              className="w-full cursor-pointer appearance-none rounded-xl border border-border/80 bg-background px-3.5 py-2.5 pr-8 text-sm font-medium text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="all">All Statuses ({counts.total})</option>
              <option value="pending">Pending ({counts.pending})</option>
              <option value="approved">Approved ({counts.approved})</option>
              <option value="rejected">Rejected ({counts.rejected})</option>
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Filter className="size-3.5" />
            </div>
          </div>

          {/* Category Selector */}
          <div className="relative min-w-[170px] flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              aria-label="Filter by category"
              className="w-full cursor-pointer appearance-none rounded-xl border border-border/80 bg-background px-3.5 py-2.5 pr-8 text-sm font-medium text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="all">All Categories</option>
              {WEDDING_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Filter className="size-3.5" />
            </div>
          </div>

          {/* Availability Selector */}
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select
              value={selectedAvailability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              aria-label="Filter by availability"
              className="w-full cursor-pointer appearance-none rounded-xl border border-border/80 bg-background px-3.5 py-2.5 pr-8 text-sm font-medium text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            >
              <option value="all">All Availability</option>
              <option value="active">Active ({counts.active})</option>
              <option value="inactive">Inactive ({counts.inactive})</option>
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Filter className="size-3.5" />
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-10 shrink-0 cursor-pointer gap-1.5 rounded-xl border-border/80 px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
