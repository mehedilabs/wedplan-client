import { connection } from "next/server";
import { notFound } from "next/navigation";

import { getServiceById } from "@/lib/api/service-api";
import ServiceDetails from "../_components/service-details";

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
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
