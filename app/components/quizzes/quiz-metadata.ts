import { Bot, Building, Globe, KeyRound, MailWarning, ShieldCheck, type LucideIcon, } from "lucide-react";
import type { Dictionary } from "@/i18n/types";
import type { QuizCategory, QuizDifficulty } from "@/types/quiz";
export type CategoryMeta = {
    category: QuizCategory;
    icon: LucideIcon;
    difficulty: QuizDifficulty;
    quizCount: number;
    estimatedMinutes: number;
    title: string;
    description: string;
    estimatedTime: string;
};
type LayoutRow = {
    category: QuizCategory;
    icon: LucideIcon;
    difficulty: QuizDifficulty;
    quizCount: number;
    estimatedMinutes: number;
};
const quizCategoryLayout: LayoutRow[] = [
    {
        category: "Phishing",
        icon: MailWarning,
        difficulty: "Medium",
        quizCount: 5,
        estimatedMinutes: 5,
    },
    {
        category: "Password Security",
        icon: KeyRound,
        difficulty: "Beginner",
        quizCount: 5,
        estimatedMinutes: 5,
    },
    {
        category: "Web Security",
        icon: Globe,
        difficulty: "Medium",
        quizCount: 5,
        estimatedMinutes: 5,
    },
    {
        category: "Workplace Security",
        icon: Building,
        difficulty: "Advanced",
        quizCount: 5,
        estimatedMinutes: 5,
    },
    {
        category: "AI Threats",
        icon: Bot,
        difficulty: "Advanced",
        quizCount: 5,
        estimatedMinutes: 5,
    },
    {
        category: "Password Security",
        icon: ShieldCheck,
        difficulty: "Mixed",
        quizCount: 5,
        estimatedMinutes: 5,
    },
];
export const QUIZ_CATEGORY_COUNT = quizCategoryLayout.length;
export function getQuizCategoryCards(quiz: Dictionary["quiz"]): CategoryMeta[] {
    return quizCategoryLayout.map((row, index) => {
        const copy = quiz.categories[index];
        return {
            ...row,
            title: copy.title,
            description: copy.description,
            estimatedTime: quiz.timeMin.replace("{{count}}", String(row.estimatedMinutes)),
        };
    });
}
