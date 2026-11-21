import { Suspense } from "react";

import CategoriesSection from "@/components/home/categories-section";
import FeaturedServicesSection from "@/components/home/featured-services-section";
import FeaturedServicesSkeleton from "@/components/home/featured-services-skeleton";
import HeroSection from "@/components/home/hero-section";
import WhyChooseWedPlan from "@/components/home/why-choose-wedplan";
import HowWedPlanWorks from "@/components/home/how-wedplan-works";
import HomeSectionMotion from "@/components/home/home-section-motion";

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <HomeSectionMotion direction="none">
        <HeroSection />
      </HomeSectionMotion>

      <HomeSectionMotion direction="left">
        <Suspense
          fallback={
            <div className="min-h-[700px] animate-pulse bg-background" />
          }
        >
          <CategoriesSection />
        </Suspense>
      </HomeSectionMotion>

      <HomeSectionMotion direction="right">
        <Suspense fallback={<FeaturedServicesSkeleton />}>
          <FeaturedServicesSection />
        </Suspense>
      </HomeSectionMotion>

      <HomeSectionMotion direction="up">
        <WhyChooseWedPlan />
      </HomeSectionMotion>

      <HomeSectionMotion direction="up">
        <HowWedPlanWorks />
      </HomeSectionMotion>
    </main>
  );
}
