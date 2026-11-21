"use client";

import {
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Calendar,
  SearchX,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewDetails: (transaction: Transaction) => void;
  onResetFilters?: () => void;
}

type StatusKey = "paid" | "pending" | "failed";

const statusConfig: Record<
  StatusKey,
  {
    label: string;
    icon: typeof CheckCircle2;
    badge: string;
    dot: string;
    bar: string;
  }
> = {
  paid: {
    label: "Paid",
    icon: CheckCircle2,
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
    bar: "from-emerald-500 to-teal-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
    bar: "from-amber-500 to-yellow-400",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    badge: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
    bar: "from-rose-500 to-red-400",
  },
};

const getStatus = (status?: string) => {
  const normalized = status?.toLowerCase();

  const key: StatusKey =
    normalized === "paid" ||
    normalized === "successful" ||
    normalized === "completed"
      ? "paid"
      : normalized === "pending"
        ? "pending"
        : "failed";

  return {
    key,
    config: statusConfig[key],
  };
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase() || "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

function TransactionCard({
  tx,
  onViewDetails,
}: {
  tx: Transaction;
  onViewDetails: (transaction: Transaction) => void;
}) {
  const vendor = tx.vendor;
  const vendorName = vendor?.name || "Unknown Vendor";
  const vendorEmail = vendor?.email || "N/A";
  const businessName = vendor?.businessName;
  const status = getStatus(tx.status);
  const StatusIcon = status.config.icon;

  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md`}
    >
      {/* Status accent */}
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${status.config.bar}`}
      />

      <div className="space-y-4 p-4 sm:p-5">
        {/* Vendor */}
        <div className="flex items-start gap-3">
          <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-primary/15 bg-primary/10">
            {vendor?.image ? (
              <Image
                src={vendor.image}
                alt={vendorName}
                fill
                sizes="48px"
                className="object-cover"
              />
            ) : (
              <span className="font-heading text-lg font-bold text-primary">
                {vendorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold text-foreground sm:text-base">
              {vendorName}
            </h3>

            <p className="truncate text-xs text-muted-foreground">
              {vendorEmail}
            </p>

            {businessName && (
              <p
                className="mt-1 truncate text-xs font-medium text-primary"
                title={businessName}
              >
                {businessName}
              </p>
            )}
          </div>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.config.badge}`}
          >
            <StatusIcon className="size-3.5" />
            {status.config.label}
          </span>
        </div>

        {/* Transaction information */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/30 p-3">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Subscription
            </p>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-800 ring-1 ring-amber-500/20">
              <Crown className="size-3.5" />
              {tx.plan || "Premium"}
            </span>
          </div>

          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Payment Amount
            </p>

            <p className="font-heading text-base font-bold text-foreground sm:text-lg">
              {formatCurrency(tx.amount, tx.currency)}
            </p>
          </div>

          <div className="col-span-2 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="size-3.5" />
              Transaction Date
            </span>

            <span className="text-xs font-medium text-foreground">
              {formatDate(tx.createdAt)}
            </span>
          </div>
        </div>

        {/* Action */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(tx)}
          className="h-9 w-full cursor-pointer gap-2 rounded-xl text-xs font-semibold transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Eye className="size-4" />
          View Transaction Details
        </Button>
      </div>
    </article>
  );
}

export default function TransactionTable({
  transactions,
  onViewDetails,
  onResetFilters,
}: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center sm:p-12">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <SearchX className="size-7" />
        </div>

        <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
          No transactions match your criteria
        </h3>

        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Try adjusting your search query, selecting different filters, or
          checking back later as new subscriptions are processed.
        </p>

        {onResetFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetFilters}
            className="mt-4 cursor-pointer rounded-full text-xs font-semibold"
          >
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 @lg:grid-cols-2 @[44rem]:grid-cols-1">
        {transactions.map((tx) => (
          <TransactionCard key={tx._id} tx={tx} onViewDetails={onViewDetails} />
        ))}
      </div>
    </div>
  );
}
