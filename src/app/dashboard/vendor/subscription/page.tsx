"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Crown,
  Loader2,
  ShieldCheck,
  Sparkles,
  Store,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Infinity,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getVendorServices } from "@/lib/api/service-api";
import type { Service } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Plan = "free" | "premium";

interface Transaction {
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  stripeSessionId: string;
}

interface SubscriptionResponse {
  success: boolean;
  message: string;
  data?: {
    plan: Plan;
    transaction: Transaction | null;
  };
}

interface CheckoutResponse {
  success: boolean;
  message: string;
  data?: {
    url: string | null;
  };
}

export default function VendorSubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [hasServicesError, setHasServicesError] = useState(false);

  const [plan, setPlan] = useState<Plan>("free");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState("");

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const user = session?.user;

  // Load verified subscription information from the backend
  useEffect(() => {
    let ignore = false;

    const loadSubscription = async () => {
      if (!user?.id) {
        if (!isPending) {
          setIsLoadingSubscription(false);
        }
        return;
      }

      if (!API_URL) {
        setSubscriptionError("API URL is not configured.");
        setIsLoadingSubscription(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/payments/subscription`, {
          method: "GET",
          credentials: "include",
        });

        const result: SubscriptionResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(
            result.message || "Unable to load subscription information.",
          );
        }

        if (!ignore) {
          setPlan(result.data.plan);
          setTransaction(result.data.transaction);
          setSubscriptionError("");
        }
      } catch (error) {
        if (!ignore) {
          setSubscriptionError(
            error instanceof Error
              ? error.message
              : "Failed to load subscription information.",
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingSubscription(false);
        }
      }
    };

    loadSubscription();

    return () => {
      ignore = true;
    };
  }, [user?.id, isPending]);

  // Load vendor services
  useEffect(() => {
    let ignore = false;

    const loadServices = async () => {
      if (!user?.id) {
        setIsLoadingServices(false);
        return;
      }

      try {
        const result = await getVendorServices(user.id);

        if (!ignore) {
          setServices(result);
        }
      } catch {
        if (!ignore) {
          setHasServicesError(true);
        }
      } finally {
        if (!ignore) {
          setIsLoadingServices(false);
        }
      }
    };

    loadServices();

    return () => {
      ignore = true;
    };
  }, [user?.id]);

  const handleUpgrade = async () => {
    if (!API_URL) {
      setCheckoutError("API URL is not configured.");
      return;
    }

    setIsCheckoutLoading(true);
    setCheckoutError("");

    try {
      const response = await fetch(
        `${API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const result: CheckoutResponse = await response.json();

      if (!response.ok || !result.success || !result.data?.url) {
        throw new Error(
          result.message || "Unable to start checkout. Please try again.",
        );
      }

      window.location.assign(result.data.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      setIsCheckoutLoading(false);
    }
  };

  const activeServices = services.filter(
    (service) => service.status === "approved" && service.isActive,
  ).length;

  const freeLimit = 3;

  const formattedPaymentDate = transaction
    ? new Date(transaction.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const formattedAmount = transaction
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: transaction.currency.toUpperCase(),
      }).format(transaction.amount)
    : "$49.00";

  if (isPending || isLoadingSubscription) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (subscriptionError) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldCheck className="size-7" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Unable to Load Subscription
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {subscriptionError}
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Crown className="size-5" />
          <span className="text-sm font-semibold">Vendor Subscription</span>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Manage Your Subscription
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Manage your membership, track your service usage, and explore your
          subscription benefits.
        </p>
      </div>

      {/* Active Service Usage */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Active Service Usage
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {plan === "premium"
                ? "Your Premium membership allows unlimited active services."
                : "Your Free membership allows up to 3 active services."}
            </p>
          </div>

          <div className="rounded-xl bg-primary/10 px-5 py-3 text-center">
            <span className="text-2xl font-bold text-primary">
              {isLoadingServices ? (
                <Loader2 className="mx-auto size-5 animate-spin" />
              ) : hasServicesError ? (
                "--"
              ) : (
                activeServices
              )}
            </span>

            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {plan === "premium"
                ? "Active Services"
                : `/ ${freeLimit} Services`}
            </p>
          </div>
        </div>

        {plan === "free" && (
          <div className="mt-5 space-y-3">
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${Math.min((activeServices / freeLimit) * 100, 100)}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{activeServices} active services</span>
              <span>{freeLimit} maximum</span>
            </div>
          </div>
        )}

        {hasServicesError && (
          <p className="mt-4 text-sm text-destructive">
            Failed to load your services. Please refresh the page and try again.
          </p>
        )}
      </div>

      {plan === "premium" ? (
        /* Premium Membership Dashboard */
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl border border-[#D9A441]/40 bg-[#17302A] p-6 text-white shadow-lg sm:p-9">
            <div className="absolute -right-16 -top-20 size-64 rounded-full bg-[#D9A441]/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 size-64 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D9A441]/40 bg-[#D9A441]/15 px-3 py-1.5 text-xs font-semibold text-[#F3D58E]">
                  <Sparkles className="size-3.5" />
                  PREMIUM MEMBER
                </div>

                <div className="space-y-2">
                  <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                    Welcome to Premium!
                  </h2>
                  <p className="max-w-lg text-sm leading-6 text-white/75">
                    Your membership is active. Enjoy unlimited active service
                    listings and grow your wedding business with WedPlan.
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#F3D58E]">
                  <ShieldCheck className="size-4" />
                  Your payment has been verified
                </div>
              </div>

              <div className="flex size-24 shrink-0 items-center justify-center self-start rounded-3xl border border-[#D9A441]/40 bg-[#D9A441]/15 text-[#F3D58E] sm:size-28 sm:self-center">
                <Crown className="size-12 sm:size-14" />
              </div>
            </div>
          </div>

          {/* Membership Details */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Infinity className="size-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Membership Type
                  </p>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Lifetime Premium
                  </h3>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">
                    Membership status
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-green-700">
                    <span className="size-2 rounded-full bg-green-600" />
                    Active
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Service limit</span>
                  <span className="font-semibold text-foreground">
                    Unlimited
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-accent/20 text-[#8C6B28]">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Amount
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {formattedAmount}
                  </h3>
                </div>
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Payment status</span>
                  <span className="font-semibold capitalize text-green-700">
                    {transaction?.status ?? "Paid"}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Payment date</span>
                  <span className="text-right font-medium text-foreground">
                    {formattedPaymentDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Reference */}
          {transaction && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Transaction Details
                </h2>
              </div>

              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transaction reference
                  </span>
                  <span className="break-all text-xs font-medium text-foreground sm:max-w-[65%] sm:text-right">
                    {transaction.stripeSessionId}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">Plan purchased</span>
                  <span className="font-semibold text-foreground">
                    Premium Lifetime
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Premium Benefits */}
          <div className="rounded-2xl border border-[#D9A441]/30 bg-[#D9A441]/5 p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-[#8C6B28]" />
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Your Premium Benefits
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                "Unlimited Active Services",
                "Premium Vendor Badge",
                "Booking Request Management",
                "All Free Plan Features",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#D9A441]/20 text-[#8C6B28]">
                    <Check className="size-3.5" />
                  </span>
                  <span className="text-sm font-medium text-foreground/80">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Free Vendor Plan Comparison */
        <div className="space-y-4">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Choose Your Plan
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore the features available with each membership.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <div className="space-y-2">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Free Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get started with your wedding service business.
                </p>
              </div>

              <div className="mt-6">
                <span className="text-3xl font-bold text-foreground">Free</span>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Maximum 3 Active Services",
                  "Basic Vendor Dashboard",
                  "Booking Request Management",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-foreground/80">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary">
                Your Current Plan
              </div>
            </div>

            {/* Premium Plan */}
            <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-card p-6 shadow-sm sm:p-7">
              <div className="absolute right-0 top-0 rounded-bl-xl bg-accent px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                Premium
              </div>

              <div className="space-y-2 pr-16">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  Premium Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Grow your business with unlimited service listings.
                </p>
              </div>

              <div className="mt-6">
                <span className="text-3xl font-bold text-foreground">
                  $49.00
                </span>
                <p className="mt-1 text-xs text-muted-foreground">
                  One-time payment · Lifetime access
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Unlimited Active Services",
                  "Premium Vendor Badge",
                  "All Free Plan Features",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-[#8C6B28]">
                      <Check className="size-3" />
                    </span>
                    <span className="text-sm text-foreground/80">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-3">
                <button
                  type="button"
                  onClick={handleUpgrade}
                  disabled={isCheckoutLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Redirecting to Checkout...
                    </>
                  ) : (
                    <>
                      <Crown className="size-4" />
                      Upgrade to Premium
                      <ArrowUpRight className="size-4" />
                    </>
                  )}
                </button>

                {checkoutError && (
                  <p className="text-center text-sm text-destructive">
                    {checkoutError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
