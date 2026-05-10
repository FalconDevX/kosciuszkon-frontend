export type QuizDifficulty = "Beginner" | "Medium" | "Advanced" | "Mixed";
export type QuizCategory = "Phishing" | "Password Security" | "Web Security" | "Workplace Security" | "AI Threats";
export type QuizApiQuestion = {
    id: number;
    category: string;
    difficulty: QuizDifficulty;
    question: string;
    answer_a: string;
    answer_b: string;
    answer_c: string;
    answer_d: string;
};
export type QuizOption = {
    id: string;
    sourceKey: "answer_a" | "answer_b" | "answer_c" | "answer_d";
    text: string;
};
export type QuizQuestion = {
    id: number;
    category: string;
    difficulty: QuizDifficulty;
    question: string;
    options: QuizOption[];
};
