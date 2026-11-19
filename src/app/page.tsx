import { Suspense } from "react";

import FeaturedServicesSection from "@/components/home/featured-services-section";
import FeaturedServicesSkeleton from "@/components/home/featured-services-skeleton";
import HeroSection from "@/components/home/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <Suspense fallback={<FeaturedServicesSkeleton />}>
        <FeaturedServicesSection />
      </Suspense>
    </main>
  );
}
