export default function FeaturedServicesSkeleton() {
  return (
    <section className="relative isolate overflow-hidden bg-background px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading skeleton */}
        <div className="mx-auto flex max-w-2xl flex-col items-center">
          <div className="h-3 w-56 animate-pulse rounded-full bg-muted" />

          <div className="mt-6 h-11 w-full max-w-lg animate-pulse rounded-lg bg-muted sm:h-14" />

          <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
          <div className="mt-2 h-4 w-3/4 max-w-md animate-pulse rounded-full bg-muted" />
        </div>

        {/* Cards skeleton */}
        <div className="mt-14 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="aspect-[4/3] animate-pulse bg-muted" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
                <div className="h-4 w-full animate-pulse rounded-full bg-muted" />

                <div className="flex items-center justify-between pt-3">
                  <div className="h-7 w-1/3 animate-pulse rounded-full bg-muted" />
                  <div className="size-9 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="mt-14 flex justify-center">
          <div className="h-13 w-52 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </section>
  );
}
