import type { Metadata } from "next";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import ServicesContent from "./_components/services-content";

export const metadata: Metadata = {
  title: "Browse Services",
};

function ServicesLoading() {
  return (
    <div className="space-y-8">
      {/* Search Bar Skeleton */}
      <div className="h-16 w-full animate-pulse rounded-2xl border border-border bg-card" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[4/3] animate-pulse bg-muted" />

            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Header from Reference Screenshot */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5 fill-primary/20 text-primary" />
            Curated Wedding Marketplace
          </span>

          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Browse Wedding Services
          </h1>

          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Search verified photographers, dream venues, florists, caterers, and
            stylists. Sign in to view full galleries and send booking requests.
          </p>
        </div>

        <Suspense fallback={<ServicesLoading />}>
          <ServicesContent />
        </Suspense>
      </section>
    </main>
  );
}
