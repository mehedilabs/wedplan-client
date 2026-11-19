
import type { Service } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ServicesResponse {
  success: boolean;
  message: string;
  data: Service[];
}

interface ImageUploadData {
  url: string;
}

interface CreateServiceData {
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

// Get all approved and active services
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


 // Get all services created by a specific vendor
export async function getVendorServices(
  vendorId: string,
): Promise<Service[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_URL}/services/vendor/${encodeURIComponent(vendorId)}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch vendor services");
  }

  const result: ServicesResponse = await response.json();

  if (!result.success) {
    throw new Error(result.message);
  }

  return result.data;
}


// Upload a single service image to ImgBB
export async function uploadServiceImage(file: File): Promise<string> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/services/upload-image`, {
    method: "POST",
    body: formData,
  });

  const result: ApiResponse<ImageUploadData> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Image upload failed");
  }

  return result.data.url;
}

// Create a new service
export async function createService(
  serviceData: CreateServiceData,
): Promise<void> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create service");
  }
}
