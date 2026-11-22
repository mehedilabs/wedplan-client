import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-[55svh] flex-1 items-center justify-center overflow-hidden bg-[#F1EAE1] px-4 py-10 sm:px-6 sm:py-14 md:py-20">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-4 size-48 rounded-full border border-primary/10 sm:size-64"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-4 size-56 rounded-full border border-accent/20 sm:size-72"
      />

      <div className="relative mx-auto w-full max-w-xl text-center">
        {/* Decorative icon */}
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-accent/40 bg-secondary/70 text-primary shadow-sm sm:size-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="none"
            className="size-7 sm:size-8"
            aria-hidden="true"
          >
            <path
              d="M24 39C24 39 9 29.5 9 18.5C9 12.5 13.2 9 18 9C20.8 9 23 10.7 24 13C25 10.7 27.2 9 30 9C34.8 9 39 12.5 39 18.5C39 29.5 24 39 24 39Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 13V38"
              stroke="#C5A15A"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path
              d="M16 20C19 20 21 22 24 25M32 20C29 20 27 22 24 25"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Error code */}
        <p className="font-heading text-[clamp(5rem,18vw,8rem)] font-semibold leading-[0.8] tracking-tight text-primary/15">
          404
        </p>

        {/* Main content */}
        <div className="relative -mt-1 sm:-mt-2">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Oops! This Page Is
            <span className="block italic text-primary">Not Found.</span>
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-muted-foreground sm:text-sm">
            Looks like this page has wandered off. Don&apos;t worry, your
            perfect wedding journey is still waiting for you.
          </p>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
                aria-hidden="true"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Back to Home
            </Link>

            <Link
              href="/services"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-2.5 text-xs font-semibold text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:text-sm"
            >
              Explore Services
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
                aria-hidden="true"
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </Link>
          </div>

          {/* Footer note */}
          <div className="mt-7 flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-accent/50" />
            <p className="text-[10px] tracking-wide text-muted-foreground sm:text-xs">
              Made for your perfect day
            </p>
            <span className="h-px w-6 bg-accent/50" />
          </div>
        </div>
      </div>
    </main>
  );
}
