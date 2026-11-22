import type {
  AdminUser,
  AdminUserRole,
  AdminUserStatus,
} from "@/types/admin-user";
import { fetchWithAuth } from "./api-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ApiMessageResponse {
  message: string;
}

/**
 * Fetch all registered users for the admin dashboard
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await fetchWithAuth(`${API_URL}/admin/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch users";
    try {
      const errorData: ApiMessageResponse = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore JSON parse error on non-JSON response
    }
    throw new Error(errorMessage);
  }

  const users: AdminUser[] = await response.json();
  return users;
}

/**
 * Fetch a single user by ID
 */
export async function getAdminUserById(id: string): Promise<AdminUser> {
  const response = await fetchWithAuth(`${API_URL}/admin/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch user details";
    try {
      const errorData: ApiMessageResponse = await response.json();
      if (errorData?.message) errorMessage = errorData.message;
    } catch {
      // Ignore
    }
    throw new Error(errorMessage);
  }

  const user: AdminUser = await response.json();
  return user;
}

/**
 * Update user status (active, inactive, blocked)
 */
export async function updateAdminUserStatus(
  id: string,
  status: AdminUserStatus,
): Promise<string> {
  const response = await fetchWithAuth(`${API_URL}/admin/users/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data: ApiMessageResponse = await response.json().catch(() => ({
    message: "Failed to update user status",
  }));

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user status");
  }

  return data.message || `User status updated to ${status}`;
}

/**
 * Update user role (customer, vendor, admin)
 */
export async function updateAdminUserRole(
  id: string,
  role: AdminUserRole,
): Promise<string> {
  const response = await fetchWithAuth(`${API_URL}/admin/users/${id}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  const data: ApiMessageResponse = await response.json().catch(() => ({
    message: "Failed to update user role",
  }));

  if (!response.ok) {
    throw new Error(data.message || "Failed to update user role");
  }

  return data.message || `User role updated to ${role}`;
}

/**
 * Delete a user
 */
export async function deleteAdminUser(id: string): Promise<string> {
  const response = await fetchWithAuth(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: ApiMessageResponse = await response.json().catch(() => ({
    message: "Failed to delete user",
  }));

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete user");
  }

  return data.message || "User deleted successfully";
}
