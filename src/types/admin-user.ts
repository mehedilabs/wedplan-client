export type AdminUserRole = "customer" | "vendor" | "admin";

export type AdminUserStatus = "active" | "inactive" | "blocked";

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified?: boolean;
  role: AdminUserRole;
  businessName?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: string | null;
  status?: AdminUserStatus | null;
  createdAt?: string;
  updatedAt?: string;
}
