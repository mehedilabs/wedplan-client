import type { Transaction } from "@/types/transaction";
import { fetchWithAuth } from "./api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiMessageResponse {
  message: string;
}

/**
 * Fetch all platform transactions with vendor details for the admin dashboard
 */
export async function getAdminTransactions(): Promise<Transaction[]> {
  const response = await fetchWithAuth(`${API_URL}/admin/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch transactions";
    try {
      const errorData: ApiMessageResponse = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMessage);
  }

  const transactions: Transaction[] = await response.json();
  return transactions;
}
