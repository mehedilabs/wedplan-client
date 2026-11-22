"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  useEffect(() => {
    document.title = "Unexpected Error | WedPlan";
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F1EAE1] font-sans text-[#30272A] antialiased">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-10 size-56 rounded-full border border-[#702B3D]/10 sm:size-72"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 bottom-10 size-64 rounded-full border border-[#C5A15A]/25 sm:size-80"
          />

          <div className="relative mx-auto w-full max-w-xl text-center">
            {/* Decorative icon */}
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full border border-[#C5A15A]/50 bg-[#F0EAE2] text-[#702B3D] shadow-sm sm:size-20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                fill="none"
                className="size-8 sm:size-10"
                aria-hidden="true"
              >
                <path
                  d="M24 7L44 41H4L24 7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M24 19V28"
                  stroke="#C5A15A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="34" r="1.3" fill="#C5A15A" />
              </svg>
            </div>

            {/* Error label */}
            <p className="font-serif text-[clamp(4.5rem,16vw,7rem)] font-semibold leading-[0.85] tracking-tight text-[#702B3D]/15">
              Oops!
            </p>

            {/* Main content */}
            <div className="relative -mt-1 sm:-mt-2">
              <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Something Went
                <span className="block font-serif italic text-[#702B3D]">
                  Seriously Wrong.
                </span>
              </h1>

              <p className="mx-auto mt-4 max-w-sm text-xs leading-6 text-[#756B6B] sm:text-sm">
                We&apos;re sorry! An unexpected application error occurred.
                Please try reloading the experience. We&apos;ll help you get
                back on track.
              </p>

              {/* Action buttons */}
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#702B3D] px-7 py-3 text-xs font-semibold text-white shadow-md shadow-[#702B3D]/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#702B3D]/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#702B3D] focus-visible:ring-offset-2 sm:text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d="M20 7v5h-5" />
                    <path d="M4 17v-5h5" />
                    <path d="M5.6 9a7 7 0 0 1 11.8-2L20 12" />
                    <path d="M18.4 15a7 7 0 0 1-11.8 2L4 12" />
                  </svg>
                  Try Again
                </button>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#E8DFD6] bg-white/70 px-7 py-3 text-xs font-semibold text-[#30272A] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#702B3D]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#702B3D] focus-visible:ring-offset-2 sm:text-sm"
                >
                  Reload Page
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path d="M23 4v6h-6" />
                    <path d="M1 20v-6h6" />
                    <path d="M3.5 9a9 9 0 0 1 15-3L23 10" />
                    <path d="M20.5 15a9 9 0 0 1-15 3L1 14" />
                  </svg>
                </button>
              </div>

              {/* Footer note */}
              <div className="mt-9 flex items-center justify-center gap-3">
                <span className="h-px w-7 bg-[#C5A15A]/60" />
                <p className="text-[10px] tracking-wide text-[#756B6B] sm:text-xs">
                  WedPlan — Made for your perfect day
                </p>
                <span className="h-px w-7 bg-[#C5A15A]/60" />
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
