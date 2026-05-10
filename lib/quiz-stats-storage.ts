import { getStoredUserId } from "@/lib/auth-storage";
export type QuizSessionRecord = {
    id: string;
    at: string;
    score: number;
    total: number;
    percent: number;
};
const MAX_SESSIONS = 50;
const STORAGE_PREFIX = "safeclick_quiz_sessions";
function storageKey(): string {
    const id = getStoredUserId();
    return id ? `${STORAGE_PREFIX}_${id}` : `${STORAGE_PREFIX}_guest`;
}
function readRaw(): QuizSessionRecord[] {
    if (typeof window === "undefined")
        return [];
    try {
        const raw = window.localStorage.getItem(storageKey());
        if (!raw)
            return [];
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed))
            return [];
        return parsed.filter((row): row is QuizSessionRecord => typeof row === "object" &&
            row !== null &&
            typeof (row as QuizSessionRecord).id === "string" &&
            typeof (row as QuizSessionRecord).at === "string" &&
            typeof (row as QuizSessionRecord).score === "number" &&
            typeof (row as QuizSessionRecord).total === "number" &&
            typeof (row as QuizSessionRecord).percent === "number");
    }
    catch {
        return [];
    }
}
export function getQuizSessionRecords(): QuizSessionRecord[] {
    const rows = readRaw();
    return [...rows].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}
export function appendQuizSessionRecord(payload: Omit<QuizSessionRecord, "id" | "at">): void {
    if (typeof window === "undefined")
        return;
    const prev = readRaw();
    const next: QuizSessionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        at: new Date().toISOString(),
        ...payload,
    };
    const merged = [...prev, next].slice(-MAX_SESSIONS);
    try {
        window.localStorage.setItem(storageKey(), JSON.stringify(merged));
    }
    catch {
    }
}
