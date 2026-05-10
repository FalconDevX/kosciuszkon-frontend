export const SAFECLICK_USER_ID_KEY = "safeclick_user_id";

export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(SAFECLICK_USER_ID_KEY);
  return value && value.length > 0 ? value : null;
}

export function setStoredUserId(id: string | number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAFECLICK_USER_ID_KEY, String(id));
}

export function clearStoredUserId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAFECLICK_USER_ID_KEY);
}
