import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Images, MapPin } from "lucide-react";

import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const imageCount = service.images?.length ?? 0;

  // ⚠️ তোমার Service type-এ vendor-এর email যে field-এ আছে সেটা এখানে বসাও
  const vendorName: string | undefined = service.vendorName;
  const vendorInitial = vendorName?.charAt(0).toUpperCase() ?? "V";

  return (
    <article className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-accent/60 hover:shadow-2xl hover:shadow-primary/15">
      <Link
        href={`/services/${service._id}`}
        aria-label={`View details of ${service.serviceName}`}
        className="flex h-full flex-col outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        {/* ---------- Image ---------- */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
          {service.images?.[0] ? (
            <Image
              src={service.images[0]}
              alt={service.serviceName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Images className="size-8 opacity-50" />
              <span className="text-xs">No image available</span>
            </div>
          )}

          {/* Gradient for badge readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15" />

          {/* Category */}
          <span className="absolute left-3 top-3 max-w-[65%] truncate rounded-full border border-white/30 bg-card/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            {service.category}
          </span>

          {/* Image count */}
          {imageCount > 1 && (
            <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              <Images className="size-3.5" />
              {imageCount}
            </span>
          )}

          {/* Floating price */}
          <div className="absolute bottom-3 left-3 rounded-2xl bg-primary px-4 py-2 text-primary-foreground shadow-lg shadow-black/20">
            <p className="text-[10px] font-medium uppercase leading-none tracking-wider text-primary-foreground/70">
              Starting from
            </p>
            <p className="mt-1 text-lg font-bold leading-none">
              ৳{service.price.toLocaleString("en-BD")}
            </p>
          </div>
        </div>

        {/* ---------- Content ---------- */}
        <div className="flex flex-1 flex-col px-2.5 pb-2 pt-5">
          <h3 className="line-clamp-1 font-heading text-2xl font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {service.serviceName}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-accent" />
            <span className="truncate">{service.location}</span>
          </p>

          <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {service.description}
          </p>

          {/* ---------- Footer: vendor + arrow ---------- */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-base font-semibold text-primary ring-2 ring-accent/40">
                {vendorInitial}
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase leading-none tracking-wider text-muted-foreground">
                  Listed by
                </p>
                <p className="mt-1 truncate text-xs font-medium text-foreground">
                  {vendorName ?? "WedPlan Vendor"}
                </p>
              </div>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/30">
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>

      {/* Bottom gold line animation */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-accent to-primary transition-transform duration-500 group-hover:scale-x-100" />
    </article>
  );
}
