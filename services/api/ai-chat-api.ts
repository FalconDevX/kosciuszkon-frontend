import { API_BASE_URL, getApiErrorMessage } from "@/lib/api";

export type AIChatResponse = {
  response: string;
  model: string;
};

export type AiChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type PostAiChatOptions = {
  file?: File | null;
  history?: AiChatHistoryItem[];
};

/**
 * POST /ai/chat — JSON when no file, multipart (message + history + file) when a file is attached
 * so the backend can forward bytes to RAG → VirusTotal file scan.
 */
export async function postAiChat(
  message: string,
  options: PostAiChatOptions = {},
): Promise<AIChatResponse> {
  const { file, history = [] } = options;

  if (file) {
    const formData = new FormData();
    formData.set("message", message);
    formData.set("history", JSON.stringify(history));
    formData.set("file", file, file.name);

    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(await getApiErrorMessage(response));
    }

    return response.json() as Promise<AIChatResponse>;
  }

  const response = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response));
  }

  return response.json() as Promise<AIChatResponse>;
}
