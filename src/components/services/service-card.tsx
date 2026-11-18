import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/types/service";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/services/${service._id}`}>
        <div className="relative h-56 overflow-hidden bg-secondary">
          {service.images?.[0] ? (
            <Image
              src={service.images[0]}
              alt={service.serviceName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {service.category}
            </span>

            <span className="text-sm text-muted-foreground">
              {service.location}
            </span>
          </div>

          <h2 className="line-clamp-1 text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
            {service.serviceName}
          </h2>

          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {service.description}
          </p>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-lg font-semibold text-primary">
                ৳{service.price.toLocaleString("en-BD")}
              </p>
            </div>

            <span className="text-sm font-medium text-primary">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
