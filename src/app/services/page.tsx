import { getServices } from "@/lib/api/service-api";
import ServicesGrid from "./_components/services-grid";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Find Your Perfect Wedding Services
          </p>

          <h1 className="font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Browse Wedding Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover trusted wedding professionals and find everything you need
            to make your special day unforgettable.
          </p>
        </div>

        <ServicesGrid services={services} />
      </section>
    </main>
  );
}
