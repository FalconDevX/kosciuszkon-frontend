import { API_BASE_URL } from "@/lib/api";
import { clearStoredUserId } from "@/lib/auth-storage";
export async function logoutUser(): Promise<void> {
    try {
        await fetch(`${API_BASE_URL}/users/logout`, {
            method: "POST",
            credentials: "include",
        });
    }
    catch {
    }
    clearStoredUserId();
}
