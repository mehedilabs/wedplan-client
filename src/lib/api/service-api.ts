import type { Service } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ServicesResponse {
  success: boolean;
  message: string;
  data: Service[];
}

export async function getServices(): Promise<Service[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch services");
  }

  const result: ServicesResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}