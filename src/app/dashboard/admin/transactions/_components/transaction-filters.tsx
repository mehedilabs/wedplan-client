"use client";

import {
  Search,
  X,
  RotateCcw,
  Filter,
  Receipt,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TransactionCounts {
  total: number;
  totalRevenue: number;
  paid: number;
  pending: number;
  failed: number;
  currency: string;
}

interface TransactionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedPlan: string;
  onPlanChange: (plan: string) => void;
  counts: TransactionCounts;
  hasActiveFilters: boolean;
  onReset: () => void;
}

export default function TransactionFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPlan,
  onPlanChange,
  counts,
  hasActiveFilters,
  onReset,
}: TransactionFiltersProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase() || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Metric / Quick Filter Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">
              {formatCurrency(counts.totalRevenue, counts.currency)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              From {counts.paid} paid subscription{counts.paid === 1 ? "" : "s"}
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DollarSign className="size-5" />
          </span>
        </div>

        {/* Total Transactions */}
        <button
          type="button"
          onClick={() => {
            onStatusChange("all");
            onPlanChange("all");
          }}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition cursor-pointer shadow-xs ${
            selectedStatus === "all" && selectedPlan === "all"
              ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
              : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
          }`}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Total Transactions
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">
              {counts.total}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              All payment attempts
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
            <Receipt className="size-5" />
          </span>
        </button>

        {/* Paid / Successful */}
        <button
          type="button"
          onClick={() => {
            onStatusChange(selectedStatus === "paid" ? "all" : "paid");
          }}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition cursor-pointer shadow-xs ${
            selectedStatus === "paid"
              ? "border-emerald-400 bg-emerald-50/60 ring-1 ring-emerald-300"
              : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
          }`}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Successful Payments
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-emerald-700">
              {counts.paid}
            </p>
            <p className="mt-0.5 text-[11px] text-emerald-600/90">
              Verified & activated
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="size-5" />
          </span>
        </button>

        {/* Pending / Failed */}
        <button
          type="button"
          onClick={() => {
            if (counts.failed > 0 && selectedStatus !== "failed") {
              onStatusChange("failed");
            } else if (counts.pending > 0 && selectedStatus !== "pending") {
              onStatusChange("pending");
            } else {
              onStatusChange("all");
            }
          }}
          className={`flex items-center justify-between rounded-2xl border p-4 text-left transition cursor-pointer shadow-xs ${
            selectedStatus === "pending" || selectedStatus === "failed"
              ? "border-amber-400 bg-amber-50/60 ring-1 ring-amber-300"
              : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
          }`}
        >
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Pending / Failed
            </p>
            <p className="mt-1 font-heading text-2xl font-bold text-foreground">
              <span className="text-amber-700">{counts.pending}</span>
              <span className="text-muted-foreground text-lg font-normal"> / </span>
              <span className="text-rose-700">{counts.failed}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Incomplete or cancelled
            </p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <Clock className="size-5" />
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by vendor name, email, business name, or session ID..."
            className="w-full rounded-xl border border-border/80 bg-background py-2.5 pl-10 pr-9 text-sm text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Status Selector */}
          <div className="relative min-w-[140px] flex-1 sm:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by payment status"
              className="w-full appearance-none rounded-xl border border-border/80 bg-background px-3.5 py-2.5 pr-8 text-sm font-medium text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              <option value="all">All Statuses ({counts.total})</option>
              <option value="paid">Paid / Successful ({counts.paid})</option>
              <option value="pending">Pending ({counts.pending})</option>
              <option value="failed">Failed ({counts.failed})</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Filter className="size-3.5" />
            </div>
          </div>

          {/* Plan Selector */}
          <div className="relative min-w-[130px] flex-1 sm:flex-none">
            <select
              value={selectedPlan}
              onChange={(e) => onPlanChange(e.target.value)}
              aria-label="Filter by subscription plan"
              className="w-full appearance-none rounded-xl border border-border/80 bg-background px-3.5 py-2.5 pr-8 text-sm font-medium text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 cursor-pointer"
            >
              <option value="all">All Plans</option>
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Crown className="size-3.5" />
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-10 shrink-0 gap-1.5 rounded-xl border-border/80 px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
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
