import { getServices } from "@/lib/api/service-api";
import ServicesExplorer from "./services-explorer";

export default async function ServicesContent() {
  const services = await getServices();

  return <ServicesExplorer initialServices={services} />;
}
