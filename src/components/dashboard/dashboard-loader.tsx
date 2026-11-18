import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

interface DashboardLoaderProps {
  title: string;
  description?: string;
  fullScreen?: boolean;
}

export function DashboardLoader({
  title,
  description,
  fullScreen = false,
}: DashboardLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-background px-6",
        fullScreen ? "min-h-svh" : "min-h-[70vh]",
      )}
    >
      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-0 size-80 rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative flex max-w-xs flex-col items-center text-center">
        {/* Animated logo */}
        <div className="relative flex size-24 items-center justify-center">
          <span className="absolute inset-1 animate-ping rounded-3xl bg-primary/15" />
          <span className="absolute inset-0 rounded-[1.75rem] border border-primary/15 bg-primary/5" />

          <span className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-xl shadow-primary/30">
            <Heart className="size-8 animate-pulse fill-primary-foreground text-primary-foreground" />
          </span>
        </div>

        <h2 className="mt-6 font-heading text-xl font-bold tracking-tight text-foreground">
          {title}
        </h2>

        {description && (
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {/* Bouncing dots */}
        <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-2 animate-bounce rounded-full bg-primary"
              style={{ animationDelay: `${dot * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
