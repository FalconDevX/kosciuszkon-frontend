import { API_BASE_URL } from "@/lib/api";
import { clearStoredUserId } from "@/lib/auth-storage";

/**
 * Stateless logout — calls backend /users/logout (best-effort) so it can clear any
 * future session cookies, then clears the local user id. Always succeeds locally:
 * a network failure does not block sign-out client-side.
 */
export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    /* ignore — logout is local-first */
  }
  clearStoredUserId();
}
