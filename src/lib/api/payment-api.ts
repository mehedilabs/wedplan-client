import { fetchWithAuth } from "./api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SubscriptionTransaction {
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  stripeSessionId: string;
}

export interface VendorSubscription {
  plan: "free" | "premium";
  transaction: SubscriptionTransaction | null;
}

interface SubscriptionResponse {
  success: boolean;
  message?: string;
  data: VendorSubscription;
}

export async function getVendorSubscription(): Promise<VendorSubscription> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetchWithAuth(`${API_URL}/payments/subscription`, {
    cache: "no-store",
  });

  const result: SubscriptionResponse = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch subscription information",
    );
  }

  return result.data;
}
