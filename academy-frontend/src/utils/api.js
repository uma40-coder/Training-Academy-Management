// Centralized auth-aware fetch utility
// Automatically attaches JWT token from localStorage to every request

const BASE_URL = "http://localhost:8080";

/**
 * Returns the stored JWT token (checks all role keys).
 */
export function getToken() {
  const auth =
    localStorage.getItem("adminAuth") ||
    localStorage.getItem("mentorAuth") ||
    localStorage.getItem("studentAuth");
  if (!auth) return null;
  try {
    const parsed = JSON.parse(auth);
    return parsed.token || null;
  } catch {
    return null;
  }
}

/**
 * Authenticated fetch — like window.fetch but adds Authorization header.
 * Usage: authFetch("/api/students")  or  authFetch("/api/students", { method: "POST", body: ... })
 */
export async function authFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return response;
}
