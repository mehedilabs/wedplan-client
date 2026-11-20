import Link from "next/link";
import { XCircle, RefreshCw, Crown } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-7 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <XCircle className="size-11" />
        </div>

        <div className="mt-6 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Crown className="size-3.5" />
            Premium Upgrade
          </div>

          <h1 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
            Payment Cancelled
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            Your checkout process was cancelled. Your subscription has not been
            upgraded, and you can try again whenever you are ready.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-border bg-muted/40 p-5 text-left">
          <h2 className="text-sm font-semibold text-foreground">No worries!</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            You can continue using your current plan or return to the
            subscription page to upgrade to Premium.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <Link
            href="/dashboard/vendor/subscription"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="size-4" />
            Try Again
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
