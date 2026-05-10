import { API_BASE_URL, getApiErrorMessage } from "@/lib/api";
import type { QuizApiQuestion } from "@/types/quiz";
async function request<T>(path: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error(await getApiErrorMessage(response));
    }
    return response.json() as Promise<T>;
}
export const quizApi = {
    getRandomQuiz: () => request<QuizApiQuestion[]>("/quiz/random"),
    getCategoryQuiz: (category: string) => request<QuizApiQuestion[]>(`/quiz/random/category/${encodeURIComponent(category)}`),
    getDifficultyQuiz: (difficulty: string) => request<QuizApiQuestion[]>(`/quiz/random/difficulty/${encodeURIComponent(difficulty)}`),
};
