import { API_BASE_URL } from "@/lib/api";

/** Best-effort parse of user id from login/register JSON bodies (backend shapes vary). */
export function extractUserIdFromAuthResponse(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const o = payload as Record<string, unknown>;
  const nested =
    typeof o.user === "object" && o.user !== null
      ? (o.user as Record<string, unknown>)
      : null;

  const candidates = [
    o.user_id,
    o.userId,
    o.id,
    nested?.id,
    nested?.user_id,
    nested?.userId,
  ];

  for (const c of candidates) {
    if (c === undefined || c === null) continue;
    const s = String(c).trim();
    if (s.length > 0) return s;
  }
  return null;
}

export function extractUsernameFromUserPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const o = payload as Record<string, unknown>;
  const nested =
    typeof o.user === "object" && o.user !== null
      ? (o.user as Record<string, unknown>)
      : null;

  const candidates = [o.username, o.name, o.user_name, nested?.username, nested?.name];

  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

/** GET /users/{user_id} — returns display username or null. */
export async function fetchUsernameByUserId(userId: string): Promise<string | null> {
  const response = await fetch(
    `${API_BASE_URL}/users/${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) return null;

  try {
    const data: unknown = await response.json();
    return extractUsernameFromUserPayload(data);
  } catch {
    return null;
  }
}
