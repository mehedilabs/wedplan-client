function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-muted ${className ?? ""}`} />
  );
}

export default function BookingRequestSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Service Header */}
      <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:p-5">
        <SkeletonBlock className="aspect-video w-full sm:aspect-square sm:size-24" />

        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-5 w-3/4 max-w-64" />
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-4 w-28" />
        </div>
      </div>

      {/* Customer & Event Details */}
      <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-2">
        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-40" />

          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-48" />
          </div>

          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
        </div>

        <div className="space-y-4">
          <SkeletonBlock className="h-4 w-32" />

          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-40" />
          </div>

          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mx-4 mb-4 sm:mx-5 sm:mb-5">
        <SkeletonBlock className="h-24 w-full rounded-xl" />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:justify-end sm:p-5">
        <SkeletonBlock className="h-10 w-full rounded-full sm:w-32" />
        <SkeletonBlock className="h-10 w-full rounded-full sm:w-36" />
      </div>
    </div>
  );
}
