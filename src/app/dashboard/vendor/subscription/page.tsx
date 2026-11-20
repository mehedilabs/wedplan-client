"use client";

import { useEffect, useState } from "react";
import { Check, Crown, Loader2, Sparkles, Store } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getVendorServices } from "@/lib/api/service-api";
import type { Service } from "@/types/service";

export default function VendorSubscriptionPage() {
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [hasError, setHasError] = useState(false);

  const user = session?.user;
  const plan = user?.subscriptionPlan === "premium" ? "premium" : "free";

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
          setHasError(true);
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

  const activeServices = services.filter(
    (service) => service.status === "approved" && service.isActive,
  ).length;

  const freeLimit = 3;

  if (isPending) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
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
          Manage your plan, track your service limit, and explore the benefits
          of Premium membership.
        </p>
      </div>

      {/* Current Plan */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {plan === "premium" ? (
                <Crown className="size-3.5" />
              ) : (
                <Store className="size-3.5" />
              )}
              Current Plan
            </span>

            <div>
              <h2 className="font-heading text-3xl font-bold capitalize text-foreground">
                {plan} Plan
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {plan === "premium"
                  ? "Enjoy unlimited active service listings."
                  : "You are currently using the Free membership."}
              </p>
            </div>
          </div>

          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {plan === "premium" ? (
              <Sparkles className="size-8" />
            ) : (
              <Store className="size-8" />
            )}
          </div>
        </div>

        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Service Usage */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Active Service Usage
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {plan === "premium"
                ? "Your Premium plan allows unlimited active services."
                : "Your Free plan allows up to 3 active services."}
            </p>
          </div>

          <div className="rounded-xl bg-primary/10 px-4 py-3 text-center">
            <span className="text-2xl font-bold text-primary">
              {isLoadingServices ? (
                <Loader2 className="mx-auto size-5 animate-spin" />
              ) : hasError ? (
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

        {hasError && (
          <p className="mt-4 text-sm text-destructive">
            Failed to load your services. Please refresh the page and try again.
          </p>
        )}
      </div>

      {/* Plan Comparison */}
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
                  <span className="text-sm text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            {plan === "free" && (
              <div className="mt-7 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-primary">
                Your Current Plan
              </div>
            )}
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
                Premium
              </span>
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
                  <span className="text-sm text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>

            {plan === "premium" ? (
              <div className="mt-7 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-center text-sm font-semibold text-[#8C6B28]">
                Your Current Plan
              </div>
            ) : (
              <div className="mt-7 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-3 text-center text-sm text-muted-foreground">
                Upgrade functionality will be available in the next step.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
