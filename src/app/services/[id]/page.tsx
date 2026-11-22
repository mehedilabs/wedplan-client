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
        <div className="flex min-h-[60vh] items-center justify-center">
          <p>Loading service details...</p>
        </div>
      }
    >
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
