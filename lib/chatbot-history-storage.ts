import type { AIChatSource } from "@/services/api/ai-chat-api";

export type StoredChatMessage = {
    id: number;
    role: "user" | "assistant";
    content: string;
    fileName?: string;
    model?: string;
    sources?: AIChatSource[];
    searchingWeb?: boolean;
};

export type ChatSessionRecord = {
    id: string;
    title: string;
    updatedAt: number;
    messages: StoredChatMessage[];
};

export function chatbotHistoryStorageKey(locale: string): string {
    return `safeclickai-chatbot-history-v1-${locale}`;
}

export function loadChatSessions(locale: string): ChatSessionRecord[] {
    if (typeof window === "undefined") {
        return [];
    }
    try {
        const raw = window.localStorage.getItem(chatbotHistoryStorageKey(locale));
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter(
            (item): item is ChatSessionRecord =>
                typeof item === "object"
                && item !== null
                && typeof (item as ChatSessionRecord).id === "string"
                && typeof (item as ChatSessionRecord).title === "string"
                && typeof (item as ChatSessionRecord).updatedAt === "number"
                && Array.isArray((item as ChatSessionRecord).messages),
        );
    }
    catch {
        return [];
    }
}

export function saveChatSessions(locale: string, sessions: ChatSessionRecord[]): void {
    if (typeof window === "undefined") {
        return;
    }
    try {
        window.localStorage.setItem(chatbotHistoryStorageKey(locale), JSON.stringify(sessions));
    }
    catch {
    }
}

export function sessionTitleFromMessages(
    messages: StoredChatMessage[],
    previousTitle: string,
    emptyLabel: string,
): string {
    const first = messages.find((m) => m.role === "user");
    if (!first) {
        return previousTitle || emptyLabel;
    }
    const text = (first.content.trim() || first.fileName || "").replace(/\s+/g, " ");
    if (!text) {
        return previousTitle || emptyLabel;
    }
    return text.length > 52 ? `${text.slice(0, 51)}…` : text;
}
