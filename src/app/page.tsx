import { Suspense } from "react";
import { connection } from "next/server";

import CategoriesSection from "@/components/home/categories-section";
import FeaturedServicesSection from "@/components/home/featured-services-section";
import FeaturedServicesSkeleton from "@/components/home/featured-services-skeleton";
import HeroSection from "@/components/home/hero-section";

export default async function Home() {
  await connection();

  return (
    <main>
      <HeroSection />

      <Suspense
        fallback={<div className="min-h-[700px] animate-pulse bg-background" />}
      >
        <CategoriesSection />
      </Suspense>

      <Suspense fallback={<FeaturedServicesSkeleton />}>
        <FeaturedServicesSection />
      </Suspense>
    </main>
  );
}
