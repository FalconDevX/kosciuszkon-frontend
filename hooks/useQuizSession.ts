"use client";
import { useMemo, useState } from "react";
import type { QuizApiQuestion, QuizQuestion } from "@/types/quiz";
const answerKeys = ["answer_a", "answer_b", "answer_c", "answer_d"] as const;
function shuffle<T>(items: T[]) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
function mapApiQuestions(questions: QuizApiQuestion[]): QuizQuestion[] {
    return questions.map((question) => {
        const options = shuffle(answerKeys.map((key, index) => ({
            id: `${question.id}-${index}`,
            sourceKey: key,
            text: question[key],
        })));
        return {
            id: question.id,
            category: question.category,
            difficulty: question.difficulty,
            question: question.question,
            options,
        };
    });
}
export function useQuizSession() {
    const [isOpen, setIsOpen] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const currentQuestion = questions[currentIndex];
    const progress = questions.length
        ? ((currentIndex + 1) / questions.length) * 100
        : 0;
    const score = useMemo(() => {
        return questions.reduce((acc, question) => {
            const selectedSourceKey = answers[question.id];
            if (selectedSourceKey === "answer_a")
                return acc + 1;
            return acc;
        }, 0);
    }, [answers, questions]);
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const start = (apiQuestions: QuizApiQuestion[]) => {
        setQuestions(mapApiQuestions(apiQuestions));
        setAnswers({});
        setCurrentIndex(0);
        setIsOpen(true);
    };
    const close = () => setIsOpen(false);
    const next = () => setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
    const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
    const restart = () => {
        setAnswers({});
        setCurrentIndex(0);
    };
    const selectAnswer = (questionId: number, sourceKey: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: sourceKey }));
    };
    return {
        isOpen,
        questions,
        currentQuestion,
        currentIndex,
        answers,
        score,
        percentage,
        progress,
        start,
        close,
        next,
        prev,
        restart,
        selectAnswer,
    };
}
