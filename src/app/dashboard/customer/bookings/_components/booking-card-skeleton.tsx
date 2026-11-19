function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

export default function BookingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row">
        {/* Image Skeleton */}
        <SkeletonBlock className="h-56 w-full rounded-none sm:h-auto sm:min-h-[260px] sm:w-72 lg:w-80" />

        {/* Content Skeleton */}
        <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-7">
          <div className="space-y-5">
            {/* Title and Status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-7 w-3/4" />
                <SkeletonBlock className="h-4 w-40" />
              </div>

              <SkeletonBlock className="h-8 w-24 rounded-full" />
            </div>

            {/* Event Information */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                <SkeletonBlock className="size-9 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-2.5 w-16" />
                  <SkeletonBlock className="h-4 w-24" />
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                <SkeletonBlock className="size-9 shrink-0 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-2.5 w-14" />
                  <SkeletonBlock className="h-4 w-28" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-6 w-24" />
              <SkeletonBlock className="h-4 w-20" />
            </div>

            <SkeletonBlock className="h-10 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
