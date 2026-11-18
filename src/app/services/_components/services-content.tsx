import { getServices } from "@/lib/api/service-api";
import ServicesGrid from "./services-grid";

export default async function ServicesContent() {
  const services = await getServices();

  return <ServicesGrid services={services} />;
}
