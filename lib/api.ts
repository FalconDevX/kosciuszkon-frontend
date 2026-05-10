export const API_BASE_URL = "/api/backend";
export async function getApiErrorMessage(response: Response) {
    try {
        const payload = await response.json();
        if (typeof payload?.detail === "string")
            return payload.detail;
        if (typeof payload?.message === "string")
            return payload.message;
    }
    catch {
    }
    return response.statusText || "Request failed";
}
