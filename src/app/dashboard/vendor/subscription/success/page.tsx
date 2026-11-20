import Link from "next/link";
import { CheckCircle2, Crown, ArrowRight, ShieldCheck } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="size-11" />
        </div>

        <div className="mt-6 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-[#8C6B28]">
            <Crown className="size-3.5" />
            Premium Upgrade
          </div>

          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Payment Completed!
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            Thank you for upgrading to WedPlan Premium. Your payment has been
            submitted successfully.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-border bg-muted/40 p-5 text-left">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Secure Payment Verification
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Your Premium membership is activated after Stripe verifies your
                payment through its secure webhook.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 space-y-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Subscription
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="/dashboard/vendor"
            className="block rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
