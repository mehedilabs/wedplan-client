import type { AdminOverviewStats } from "@/types/admin-overview";
import { fetchWithAuth } from "./api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiMessageResponse {
  message: string;
}

/**
 * Fetch platform overview metrics for the admin dashboard
 */
export async function getAdminOverview(): Promise<AdminOverviewStats> {
  const response = await fetchWithAuth(`${API_URL}/admin/overview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch admin overview";
    try {
      const errorData: ApiMessageResponse = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMessage);
  }

  const data: AdminOverviewStats = await response.json();
  return data;
}
