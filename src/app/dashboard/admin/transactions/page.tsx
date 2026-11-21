"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Receipt, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminTransactions } from "@/lib/api/admin-transaction-api";
import type { Transaction } from "@/types/transaction";

import TransactionFilters, {
  type TransactionCounts,
} from "./_components/transaction-filters";
import TransactionTable from "./_components/transaction-table";
import TransactionDetailsDialog from "./_components/transaction-details-dialog";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");

  // Modal state
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Fetch transactions from API
  const loadTransactions = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const data = await getAdminTransactions();
      setTransactions(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load platform transactions";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    getAdminTransactions()
      .then((data) => {
        if (!ignore) {
          setTransactions(data);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load platform transactions";
          setError(message);
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Compute metrics / counts across all fetched transactions
  const counts: TransactionCounts = useMemo(() => {
    let totalRevenue = 0;
    let paid = 0;
    let pending = 0;
    let failed = 0;
    let currency = "usd";

    transactions.forEach((tx) => {
      const status = tx.status?.toLowerCase();
      if (
        status === "paid" ||
        status === "successful" ||
        status === "completed"
      ) {
        paid++;
        totalRevenue += tx.amount || 0;
        if (tx.currency) currency = tx.currency;
      } else if (status === "pending") {
        pending++;
      } else {
        failed++;
      }
    });

    return {
      total: transactions.length,
      totalRevenue,
      paid,
      pending,
      failed,
      currency,
    };
  }, [transactions]);

  // Filter transactions based on search, status, and plan
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search by vendor name, email, business name, or transaction IDs
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const vendorName = tx.vendor?.name?.toLowerCase() || "";
        const vendorEmail = tx.vendor?.email?.toLowerCase() || "";
        const businessName = tx.vendor?.businessName?.toLowerCase() || "";
        const txId = tx._id?.toLowerCase() || "";
        const stripeId = tx.stripeSessionId?.toLowerCase() || "";

        const match =
          vendorName.includes(query) ||
          vendorEmail.includes(query) ||
          businessName.includes(query) ||
          txId.includes(query) ||
          stripeId.includes(query);

        if (!match) return false;
      }

      // Filter by status
      if (selectedStatus !== "all") {
        const status = tx.status?.toLowerCase();
        if (selectedStatus === "paid") {
          const isPaid =
            status === "paid" ||
            status === "successful" ||
            status === "completed";
          if (!isPaid) return false;
        } else if (selectedStatus === "pending") {
          if (status !== "pending") return false;
        } else if (selectedStatus === "failed") {
          const isPaid =
            status === "paid" ||
            status === "successful" ||
            status === "completed";
          if (isPaid || status === "pending") return false;
        }
      }

      // Filter by plan
      if (selectedPlan !== "all") {
        const plan = tx.plan?.toLowerCase() || "";
        if (plan !== selectedPlan.toLowerCase()) return false;
      }

      return true;
    });
  }, [transactions, searchQuery, selectedStatus, selectedPlan]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedStatus !== "all" || selectedPlan !== "all",
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedPlan("all");
  };

  return (
    <div className="space-y-6">
      {/* ---------- Header Banner ---------- */}
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 sm:size-14">
              <Receipt className="size-6" />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                  Platform Administration
                </p>
              </div>

              <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                Manage <span className="italic text-primary">Transactions</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Monitor platform revenue, review vendor subscription payments, and inspect verified Stripe billing receipts.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadTransactions(true)}
            disabled={isLoading || isRefreshing}
            className="h-11 shrink-0 cursor-pointer gap-2 self-start rounded-full border-border bg-card px-5 text-sm font-semibold text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary sm:self-auto"
          >
            <RefreshCw
              className={`size-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </Button>
        </div>
      </header>

      {/* ---------- Error State ---------- */}
      {error && !isLoading && (
        <div className="relative flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center sm:p-10">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-600 shadow-inner">
            <AlertCircle className="size-7" />
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold text-rose-900">
              Unable to load transactions
            </h3>
            <p className="max-w-md text-sm text-rose-700">{error}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => loadTransactions()}
            className="rounded-full border-rose-300 bg-card px-6 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-100 cursor-pointer"
          >
            Retry Loading
          </Button>
        </div>
      )}

      {/* ---------- Loading Skeleton ---------- */}
      {isLoading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>

          <div className="h-14 rounded-2xl border border-border/60 bg-muted/30 animate-pulse" />

          <div className="rounded-2xl border border-border/60 bg-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="h-4 w-32 bg-muted/60 rounded" />
              <div className="h-4 w-20 bg-muted/60 rounded" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-2">
                <div className="size-10 rounded-full bg-muted/60 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-44 bg-muted/60 rounded" />
                  <div className="h-3 w-64 bg-muted/40 rounded" />
                </div>
                <div className="h-6 w-20 bg-muted/40 rounded-full" />
                <div className="h-6 w-16 bg-muted/40 rounded-full" />
                <div className="h-8 w-24 bg-muted/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- Main Content Area ---------- */}
      {!isLoading && !error && (
        <div className="space-y-5">
          {/* Filters & Metrics */}
          <TransactionFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            selectedPlan={selectedPlan}
            onPlanChange={setSelectedPlan}
            counts={counts}
            hasActiveFilters={hasActiveFilters}
            onReset={handleResetFilters}
          />

          {/* Table / Cards List */}
          <TransactionTable
            transactions={filteredTransactions}
            onViewDetails={(tx) => setSelectedTransaction(tx)}
            onResetFilters={hasActiveFilters ? handleResetFilters : undefined}
          />

          {/* Results summary footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing{" "}
              <strong className="text-foreground font-semibold">
                {filteredTransactions.length}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground font-semibold">
                {transactions.length}
              </strong>{" "}
              transactions
            </span>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-primary hover:underline font-medium cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Transaction Details Modal                                */}
      {/* ======================================================== */}
      <TransactionDetailsDialog
        transaction={selectedTransaction}
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}
