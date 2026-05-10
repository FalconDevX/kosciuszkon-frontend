import type { Dictionary } from "@/i18n/types";
import type { QuizDifficulty } from "@/types/quiz";
export function quizDifficultyLabel(difficulty: QuizDifficulty, quiz: Dictionary["quiz"]): string {
    const labels: Record<QuizDifficulty, string> = {
        Beginner: quiz.difficulties.beginner,
        Medium: quiz.difficulties.medium,
        Advanced: quiz.difficulties.advanced,
        Mixed: quiz.difficulties.mixed,
    };
    return labels[difficulty];
}
