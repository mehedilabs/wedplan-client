import type { Service } from "@/types/service";
import ServiceCard from "@/components/services/service-card";

interface ServicesGridProps {
  services: Service[];
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  if (services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <h2 className="font-heading text-2xl font-semibold">
          No Services Available
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          There are no wedding services available right now. Please check back
          later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}
