"use client";

import { useEffect, useState } from "react";
import {
  X,
  Receipt,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  ShieldCheck,
  Calendar,
  Hash,
  CreditCard,
  Store,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/types/transaction";

interface TransactionDetailsDialogProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailsDialog({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailsDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !transaction) return null;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      toast.add({
        title: "Copied",
        description: `${label} copied to clipboard`,
        type: "success",
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.add({
        title: "Copy Failed",
        description: `Could not copy ${label}`,
        type: "error",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "N/A";
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase() || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const status = transaction.status?.toLowerCase();
  const isPaid =
    status === "paid" || status === "successful" || status === "completed";
  const isPending = status === "pending";

  const vendor = transaction.vendor;
  const vendorName = vendor?.name || "Unknown Vendor";
  const vendorEmail = vendor?.email || "N/A";
  const businessName = vendor?.businessName;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border/70 bg-card shadow-2xl animate-in slide-in-from-bottom-4 duration-300 sm:max-h-[90vh] sm:max-w-xl sm:rounded-2xl sm:slide-in-from-bottom-0 sm:zoom-in-95">
        {/* Gold accent bar */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />

        {/* ═══════ HEADER ═══════ */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Receipt className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-heading text-base font-bold text-foreground sm:text-lg">
                Transaction Receipt
              </h2>
              <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                Verified Stripe payment record
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ═══════ CONTENT ═══════ */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* ─── AMOUNT HERO CARD ─── */}
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/[0.06] via-card to-accent/[0.08] p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-accent/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 left-1/4 size-24 rounded-full bg-primary/10 blur-2xl" />

            <div className="relative">
              {/* Plan badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground ring-1 ring-accent/30">
                  <Sparkles className="size-3" />
                  {transaction.plan || "Premium"} Plan
                </span>
              </div>

              {/* Amount */}
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Amount Paid
              </p>
              <h3 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {formatCurrency(transaction.amount, transaction.currency)}
              </h3>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Currency: {transaction.currency.toUpperCase()}
              </p>

              {/* Status pill */}
              <div className="mt-4">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Payment Successful
                  </span>
                ) : isPending ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
                    <Clock className="size-4 text-amber-600" />
                    Payment Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 ring-1 ring-rose-200">
                    <XCircle className="size-4 text-rose-600" />
                    Payment Failed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ─── VENDOR CARD ─── */}
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Vendor
              </h4>
              <Store className="size-3.5 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-gradient-to-br from-primary/15 to-accent/15 shadow-sm ring-1 ring-border/50">
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
                <p className="truncate text-sm font-bold text-foreground">
                  {vendorName}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <Mail className="size-3 shrink-0" />
                  {vendorEmail}
                </p>
                {businessName && (
                  <span className="mt-1.5 inline-flex max-w-full truncate rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/20">
                    {businessName}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-secondary/40 px-2.5 py-1.5 text-[11px]">
              <span className="shrink-0 text-muted-foreground">Vendor ID</span>
              <div className="flex min-w-0 items-center gap-1">
                <span className="truncate font-mono text-[10px] text-foreground">
                  {transaction.vendorId}
                </span>
                <CopyButton
                  copied={copiedField === "Vendor ID"}
                  onClick={() => handleCopy(transaction.vendorId, "Vendor ID")}
                />
              </div>
            </div>
          </div>

          {/* ─── PAYMENT IDENTIFIERS ─── */}
          <div className="rounded-2xl border border-border/60 bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Payment Identifiers
              </h4>
              <CreditCard className="size-3.5 text-muted-foreground" />
            </div>

            <div className="space-y-2.5">
              <IdentifierRow
                label="Transaction ID"
                value={transaction._id}
                copied={copiedField === "Transaction ID"}
                onCopy={() => handleCopy(transaction._id, "Transaction ID")}
              />

              {transaction.stripeSessionId && (
                <IdentifierRow
                  label="Stripe Session"
                  value={transaction.stripeSessionId}
                  copied={copiedField === "Stripe Session ID"}
                  onCopy={() =>
                    handleCopy(
                      transaction.stripeSessionId!,
                      "Stripe Session ID",
                    )
                  }
                />
              )}

              <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2.5 text-[11px]">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" />
                  Processed
                </span>
                <span className="font-semibold text-foreground">
                  {formatDate(transaction.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* ─── SECURITY NOTICE ─── */}
          <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.04] p-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-bold text-primary">
                Payment Integrity
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                Records are finalized by Stripe webhooks and cannot be manually
                modified.
              </p>
            </div>
          </div>
        </div>

        {/*FOOTER */}
        <div className="flex items-center justify-between gap-2 border-t border-border/60 bg-secondary/30 px-4 py-3 sm:px-6 sm:py-4">
          <p className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
            Receipt ID · {transaction._id.slice(-8)}
          </p>
          <Button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 sm:w-auto sm:px-6"
          >
            Close Receipt
          </Button>
        </div>
      </div>
    </div>
  );
}

//  Helper components

function IdentifierRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate rounded border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-foreground">
          {value}
        </span>
        <CopyButton copied={copied} onClick={onCopy} />
      </div>
    </div>
  );
}

function CopyButton({
  copied,
  onClick,
}: {
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Copy"
      className="flex size-6 shrink-0 items-center justify-center rounded text-primary transition hover:bg-primary/10"
    >
      {copied ? (
        <Check className="size-3 text-emerald-600" />
      ) : (
        <Copy className="size-3" />
      )}
    </button>
  );
}
