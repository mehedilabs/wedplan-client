import type { Service } from "@/types/service";
import { fetchWithAuth } from "./api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiMessageResponse {
  message: string;
}

/**
 * Fetch all submitted services for the admin dashboard
 */
export async function getAdminServices(): Promise<Service[]> {
  const response = await fetchWithAuth(`${API_URL}/admin/services`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch services";
    try {
      const errorData: ApiMessageResponse = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMessage);
  }

  const services: Service[] = await response.json();
  return services;
}

/**
 * Approve or reject a service
 */
export async function updateAdminServiceStatus(
  id: string,
  status: "approved" | "rejected",
): Promise<string> {
  const response = await fetchWithAuth(
    `${API_URL}/admin/services/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const data: ApiMessageResponse = await response.json().catch(() => ({
    message: "Failed to update service status",
  }));

  if (!response.ok) {
    throw new Error(data.message || "Failed to update service status");
  }

  return data.message || `Service ${status} successfully`;
}

/**
 * Activate or deactivate a service
 */
export async function updateAdminServiceActive(
  id: string,
  isActive: boolean,
): Promise<string> {
  const response = await fetchWithAuth(
    `${API_URL}/admin/services/${id}/active`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    },
  );

  const data: ApiMessageResponse = await response.json().catch(() => ({
    message: "Failed to update service availability",
  }));

  if (!response.ok) {
    throw new Error(data.message || "Failed to update service availability");
  }

  return (
    data.message ||
    `Service ${isActive ? "activated" : "deactivated"} successfully`
  );
}

/**
 * Delete a service
 */
export async function deleteAdminService(id: string): Promise<string> {
  const response = await fetchWithAuth(`${API_URL}/admin/services/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ApiMessageResponse = await response.json().catch(() => ({
    message: "Failed to delete service",
  }));

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete service");
  }

  return data.message || "Service deleted successfully";
}
