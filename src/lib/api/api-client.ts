let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Invalidate the in-memory cached JWT token.
 * Useful on logout, session expiration, or 401 Unauthorized responses.
 */
export function invalidateAuthToken(): void {
  cachedToken = null;
  tokenExpiresAt = 0;
}

/**
 * Retrieve the current JWT authentication token.
 * In the browser, queries the Better Auth /api/auth/token endpoint
 * and caches the token in memory until close to expiration.
 */
export async function getAuthToken(): Promise<string | null> {
  const now = Date.now();

  // Return cached token if valid for at least another 60 seconds
  if (cachedToken && tokenExpiresAt > now + 60 * 1000) {
    return cachedToken;
  }

  // In the browser, fetch the token from the Better Auth token endpoint
  if (typeof window !== "undefined") {
    try {
      const response = await fetch("/api/auth/token", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        invalidateAuthToken();
        return null;
      }

      const data = await response.json();
      if (data?.token && typeof data.token === "string") {
        cachedToken = data.token;
        // Default Better Auth token lifetime is 15 minutes; cache for 10 minutes
        tokenExpiresAt = now + 10 * 60 * 1000;
        return cachedToken;
      }
    } catch {
      invalidateAuthToken();
      return null;
    }
  }

  return null;
}

/**
 * Centralized fetch wrapper for protected backend API requests.
 * Automatically injects the Authorization: Bearer <token> header and
 * ensures credentials: "include" for session cookie continuity.
 */
export async function fetchWithAuth(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers || {});

  // Set default Content-Type for JSON requests if body is present and not FormData
  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  // Obtain and attach Bearer token if not already explicitly provided
  if (!headers.has("Authorization")) {
    const token = await getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: init?.credentials ?? "include",
  });

  // If unauthorized, invalidate cached token so subsequent requests re-authenticate
  if (response.status === 401) {
    invalidateAuthToken();
  }

  return response;
}
