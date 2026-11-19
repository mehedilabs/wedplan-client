
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
