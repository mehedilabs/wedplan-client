import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { getServiceById } from "@/lib/api/service-api";
import ServiceDetails from "../_components/service-details";

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function ServiceDetailsContent({ params }: ServiceDetailsPageProps) {
  await connection();

  const { id } = await params;

  let service;

  try {
    service = await getServiceById(id);
  } catch {
    notFound();
  }

  return <ServiceDetails service={service} />;
}

export default function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] animate-pulse bg-background px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Back Button Skeleton */}
            <div className="h-4 w-28 rounded bg-muted" />

            {/* Main Content */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Section */}
              <div className="space-y-6">
                {/* Image Skeleton */}
                <div className="aspect-[16/10] w-full rounded-2xl bg-muted" />

                {/* Thumbnail Skeleton */}
                <div className="flex gap-3">
                  <div className="h-20 w-20 rounded-xl bg-muted" />
                  <div className="h-20 w-20 rounded-xl bg-muted" />
                  <div className="h-20 w-20 rounded-xl bg-muted" />
                </div>

                {/* Service Information */}
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                  <div className="h-5 w-1/3 rounded bg-muted" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-3">
                  <div className="h-6 w-40 rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-4/5 rounded bg-muted" />
                </div>

                {/* Vendor Skeleton */}
                <div className="flex items-center gap-4 rounded-2xl border border-border p-4">
                  <div className="size-12 shrink-0 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-3 w-48 max-w-full rounded bg-muted" />
                  </div>
                </div>
              </div>

              {/* Right Section - Booking Card */}
              <div className="h-fit rounded-2xl border border-border p-6 shadow-sm">
                <div className="mb-6 h-7 w-40 rounded bg-muted" />

                <div className="mb-6 space-y-3">
                  <div className="h-5 w-1/2 rounded bg-muted" />
                  <div className="h-8 w-2/3 rounded bg-muted" />
                </div>

                <div className="space-y-5">
                  <div className="h-12 w-full rounded-xl bg-muted" />
                  <div className="h-12 w-full rounded-xl bg-muted" />
                  <div className="h-12 w-full rounded-xl bg-muted" />
                  <div className="h-12 w-full rounded-xl bg-muted" />
                </div>

                <div className="mt-6 h-12 w-full rounded-xl bg-muted" />

                <div className="mt-5 space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
