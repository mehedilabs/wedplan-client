"use client";

import {
  Ban,
  Check,
  Clock3,
  RotateCcw,
  Search,
  Shield,
  Store,
  UserCheck,
  Users,
  X,
} from "lucide-react";

export interface UserCounts {
  total: number;
  customers: number;
  vendors: number;
  admins: number;
  active: number;
  inactive: number;
  blocked: number;
}

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  counts: UserCounts;
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
  icon: typeof Users;
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

export default function UserFilters({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  counts,
  hasActiveFilters,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="space-y-3">
      {/* ---------- Metric / quick filter tiles ---------- */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
        <MetricTile
          label="Total"
          value={counts.total}
          icon={Users}
          tone="primary"
          isSelected={selectedRole === "all" && selectedStatus === "all"}
          onClick={() => {
            onRoleChange("all");
            onStatusChange("all");
          }}
        />

        <MetricTile
          label="Customers"
          value={counts.customers}
          icon={Users}
          tone="sky"
          isSelected={selectedRole === "customer"}
          onClick={() =>
            onRoleChange(selectedRole === "customer" ? "all" : "customer")
          }
        />

        <MetricTile
          label="Vendors"
          value={counts.vendors}
          icon={Store}
          tone="primary"
          isSelected={selectedRole === "vendor"}
          onClick={() =>
            onRoleChange(selectedRole === "vendor" ? "all" : "vendor")
          }
        />

        <MetricTile
          label="Admins"
          value={counts.admins}
          icon={Shield}
          tone="ink"
          isSelected={selectedRole === "admin"}
          onClick={() =>
            onRoleChange(selectedRole === "admin" ? "all" : "admin")
          }
        />

        <MetricTile
          label="Active"
          value={counts.active}
          icon={UserCheck}
          tone="emerald"
          isSelected={selectedStatus === "active"}
          onClick={() =>
            onStatusChange(selectedStatus === "active" ? "all" : "active")
          }
        />

        <MetricTile
          label="Inactive"
          value={counts.inactive}
          icon={Clock3}
          tone="amber"
          isSelected={selectedStatus === "inactive"}
          onClick={() =>
            onStatusChange(selectedStatus === "inactive" ? "all" : "inactive")
          }
        />

        <MetricTile
          label="Blocked"
          value={counts.blocked}
          icon={Ban}
          tone="rose"
          isSelected={selectedStatus === "blocked"}
          onClick={() =>
            onStatusChange(selectedStatus === "blocked" ? "all" : "blocked")
          }
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* ---------- Search bar (+ reset) ---------- */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-full border border-border bg-card py-2.5 pl-11 pr-10 text-sm text-foreground shadow-sm outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="Clear search query"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            aria-label="Reset filters"
            className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-4 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
