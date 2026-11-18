import { Suspense } from "react";
import ServicesContent from "./_components/services-content";

function ServicesLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-border bg-card"
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
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Find Your Perfect Wedding Services
          </p>

          <h1 className="font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Browse Wedding Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover trusted wedding professionals and find everything you need
            to make your special day unforgettable.
          </p>
        </div>

        <Suspense fallback={<ServicesLoading />}>
          <ServicesContent />
        </Suspense>
      </section>
    </main>
  );
}
