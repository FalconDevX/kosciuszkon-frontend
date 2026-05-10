export const SAFECLICK_USER_ID_KEY = "safeclick_user_id";
export const SAFECLICK_AUTH_EVENT = "safeclick:auth-change";

function dispatchAuthChange(userId: string | null): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string | null>(SAFECLICK_AUTH_EVENT, { detail: userId }),
  );
}

export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(SAFECLICK_USER_ID_KEY);
  return value && value.length > 0 ? value : null;
}

export function setStoredUserId(id: string | number): void {
  if (typeof window === "undefined") return;
  const value = String(id);
  window.localStorage.setItem(SAFECLICK_USER_ID_KEY, value);
  dispatchAuthChange(value);
}

export function clearStoredUserId(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAFECLICK_USER_ID_KEY);
  dispatchAuthChange(null);
}

/**
 * Subscribe to auth changes — fires for both same-tab (custom event) and cross-tab
 * (`storage` event) updates. Returns an unsubscribe function.
 */
export function subscribeAuthChange(
  callback: (userId: string | null) => void,
): () => void {
  if (typeof window === "undefined") return () => undefined;

  const onCustom = (event: Event) => {
    const detail = (event as CustomEvent<string | null>).detail;
    callback(typeof detail === "string" ? detail : null);
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SAFECLICK_USER_ID_KEY) return;
    callback(event.newValue && event.newValue.length > 0 ? event.newValue : null);
  };

  window.addEventListener(SAFECLICK_AUTH_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(SAFECLICK_AUTH_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
