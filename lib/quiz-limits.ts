export const MIN_QUIZ_QUESTIONS = 3;
export const MAX_QUIZ_QUESTIONS = 10;
export const MAX_QUIZ_MINUTES_ESTIMATE = 10;
export const DEFAULT_QUIZ_SESSION_QUESTIONS = 5;
export function capQuizQuestions<T>(questions: T[]): T[] {
    return questions.slice(0, MAX_QUIZ_QUESTIONS);
}
export function sessionQuestionCount(apiLength: number): number {
    return Math.min(MAX_QUIZ_QUESTIONS, apiLength);
}
function shuffleCopy<T>(items: T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
export function buildFixedQuizSession<T>(raw: T[], targetCount: number): T[] | null {
    const pool = capQuizQuestions(raw);
    if (pool.length < MIN_QUIZ_QUESTIONS || pool.length < targetCount) {
        return null;
    }
    return shuffleCopy(pool).slice(0, targetCount);
}
export function buildQuizSessionBestEffort<T>(raw: T[], targetCount: number): T[] | null {
    const pool = capQuizQuestions(raw);
    if (pool.length < MIN_QUIZ_QUESTIONS)
        return null;
    const n = Math.min(targetCount, pool.length);
    return shuffleCopy(pool).slice(0, n);
}
export function formatQuizDurationLabel(questionCount: number): string {
    const mins = Math.min(MAX_QUIZ_MINUTES_ESTIMATE, Math.max(1, questionCount));
    return `~${mins} min`;
}
