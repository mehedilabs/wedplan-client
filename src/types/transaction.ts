export interface TransactionVendor {
  _id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  businessName?: string | null;
}

export interface Transaction {
  _id: string;
  vendorId: string;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId?: string | null;
  stripeSubscriptionId?: string | null;
  status: "paid" | "successful" | "completed" | "pending" | "failed" | string;
  createdAt: string;
  vendor?: TransactionVendor | null;
}
