
const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface CreateBookingData {
  serviceId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventLocation: string;
  message: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface BookingStatusData {
  hasActiveBooking: boolean;
}

export interface CustomerBooking {
  _id: string;
  serviceId: string;
  serviceName: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  createdAt: string;
  vendorName: string;
  price: number | null;
  image: string | null;
}

// Check whether the customer already has an active booking
export async function getBookingStatus(
  serviceId: string,
  customerId: string,
): Promise<boolean> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const params = new URLSearchParams({
    serviceId,
    customerId,
  });

  const response = await fetch(
    `${API_URL}/bookings/status?${params.toString()}`,
    { cache: "no-store" },
  );

  const result: ApiResponse<BookingStatusData> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to check booking status");
  }

  return result.data.hasActiveBooking;
}

// Create a customer booking request
export async function createBooking(
  bookingData: CreateBookingData,
): Promise<void> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to submit booking request");
  }
}


// Get all bookings submitted by a customer
export async function getCustomerBookings(
  customerId: string,
): Promise<CustomerBooking[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_URL}/bookings/customer/${encodeURIComponent(customerId)}`,
    { cache: "no-store" },
  );

  const result: ApiResponse<CustomerBooking[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch customer bookings");
  }

  return result.data;
}

// Cancel a customer's pending booking
export async function cancelBooking(
  bookingId: string,
  customerId: string,
): Promise<void> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/cancel`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customerId }),
    },
  );

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to cancel booking");
  }
}

// Vendor booking request type
export interface VendorBooking {
  _id: string;
  serviceId: string;
  serviceName: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  createdAt: string;
  price: number | null;
  image: string | null;
}

// Get all booking requests submitted to a vendor
export async function getVendorBookings(
  vendorId: string,
): Promise<VendorBooking[]> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_URL}/bookings/vendor/${encodeURIComponent(vendorId)}`,
    { cache: "no-store" },
  );

  const result: ApiResponse<VendorBooking[]> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch vendor bookings");
  }

  return result.data;
}

// Accept a pending booking request
export async function acceptBooking(
  bookingId: string,
  vendorId: string,
): Promise<void> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/accept`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendorId }),
    },
  );

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to accept booking request");
  }
}

// Reject a pending booking request
export async function rejectBooking(
  bookingId: string,
  vendorId: string,
): Promise<void> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const response = await fetch(
    `${API_URL}/bookings/${bookingId}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ vendorId }),
    },
  );

  const result: ApiResponse<unknown> = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to reject booking request");
  }
}