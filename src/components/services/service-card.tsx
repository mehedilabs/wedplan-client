import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Images, MapPin } from "lucide-react";

import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const imageCount = service.images?.length ?? 0;

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10">
      <Link
        href={`/services/${service._id}`}
        aria-label={`View details of ${service.serviceName}`}
        className="flex h-full flex-col outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
          {service.images?.[0] ? (
            <Image
              src={service.images[0]}
              alt={service.serviceName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <Images className="size-8 opacity-50" />
              <span className="text-xs">No image available</span>
            </div>
          )}

          {/* Soft gradient for badge readability */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/20" />

          {/* Category */}
          <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
            {service.category}
          </span>

          {/* Image count */}
          {imageCount > 1 && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <Images className="size-3.5" />
              {imageCount}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h2 className="line-clamp-1 font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
            {service.serviceName}
          </h2>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{service.location}</span>
          </p>

          <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">
            {service.description}
          </p>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between border-t border-dashed border-border pt-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Starting from
              </p>
              <p className="text-xl font-bold leading-tight text-primary">
                ৳{service.price.toLocaleString("en-BD")}
              </p>
            </div>

            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md group-hover:shadow-primary/30">
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
