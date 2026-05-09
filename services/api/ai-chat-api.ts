import { API_BASE_URL, getApiErrorMessage } from "@/lib/api";

export type AIChatResponse = {
  response: string;
  model: string;
};

export async function postAiChat(message: string): Promise<AIChatResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return response.json() as Promise<AIChatResponse>;
}
