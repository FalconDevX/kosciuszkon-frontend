"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Brain, Dice5, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/app/components/home/Navbar";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
import { buildQuizSessionBestEffort, DEFAULT_QUIZ_SESSION_QUESTIONS, } from "@/lib/quiz-limits";
import { quizDifficultyLabel } from "@/lib/quiz-difficulty-label";
import { quizApi } from "@/services/api/quiz-api";
import { useQuizSession } from "@/hooks/useQuizSession";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { QuizCategory } from "@/types/quiz";
import type { QuizDifficulty } from "@/types/quiz";

const QUIZ_CATEGORY_VALUES: QuizCategory[] = [
    "Phishing",
    "Password Security",
    "Web Security",
    "Workplace Security",
    "AI Threats",
];

function quizCategoryFromSearchParam(raw: string | null): QuizCategory | null {
    if (!raw) {
        return null;
    }
    try {
        const decoded = decodeURIComponent(raw);
        return QUIZ_CATEGORY_VALUES.includes(decoded as QuizCategory) ? decoded as QuizCategory : null;
    }
    catch {
        return null;
    }
}
import { CategoryCard } from "./CategoryCard";
import { QuizCard } from "./QuizCard";
import { QuizModal } from "./QuizModal";
import { getQuizCategoryCards } from "./quiz-metadata";
const POPULAR_DIFFICULTIES: QuizDifficulty[] = ["Medium", "Beginner", "Advanced"];
type Props = {
    locale: Locale;
    dictionary: Dictionary;
};
export function QuizzesDashboard({ locale, dictionary }: Props) {
    const q = dictionary.quiz;
    const searchParams = useSearchParams();
    const quizSession = useQuizSession();
    const [isLoading, setIsLoading] = useState(false);
    const categoryCards = useMemo(() => getQuizCategoryCards(q), [q]);
    const categoryFromUrl = useMemo(() => quizCategoryFromSearchParam(searchParams.get("category")), [searchParams]);
    useEffect(() => {
        if (!categoryFromUrl) {
            return;
        }
        const id = `quiz-cat-${encodeURIComponent(categoryFromUrl)}`;
        const timer = window.setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350);
        return () => window.clearTimeout(timer);
    }, [categoryFromUrl]);
    const popularQuizzes = useMemo(() => {
        const questions = DEFAULT_QUIZ_SESSION_QUESTIONS;
        const time = q.timeMin.replace("{{count}}", String(5));
        return q.popular.map((item, index) => ({
            title: item.title,
            difficulty: POPULAR_DIFFICULTIES[index] ?? "Medium",
            questions,
            estimatedTime: time,
            meta: q.popularMeta.replace("{{questions}}", String(questions)).replace("{{time}}", time),
            difficultyLabel: quizDifficultyLabel(POPULAR_DIFFICULTIES[index] ?? "Medium", q),
        }));
    }, [q]);
    const loadQuiz = async (category?: QuizCategory, questionCount: number = DEFAULT_QUIZ_SESSION_QUESTIONS) => {
        setIsLoading(true);
        try {
            const raw = category
                ? await quizApi.getCategoryQuiz(category)
                : await quizApi.getRandomQuiz();
            const questions = buildQuizSessionBestEffort(raw, questionCount);
            if (questions?.length) {
                quizSession.start(questions);
            }
        }
        catch {
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary}/>

      <section className="relative overflow-hidden px-4 pb-8 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950"/>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]"/>
        <FallingStarsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[1300px] space-y-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{q.pageTitle}</h1>
            <p className="mt-3 max-w-2xl text-zinc-300">{q.pageSubtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => loadQuiz(undefined, DEFAULT_QUIZ_SESSION_QUESTIONS)} disabled={isLoading} className="bg-blue-500/85 text-zinc-100 hover:bg-blue-500">
                <Dice5 className="size-4"/>
                {q.randomQuiz}
              </Button>
              <Button
                onClick={() => loadQuiz("Phishing", DEFAULT_QUIZ_SESSION_QUESTIONS)}
                disabled={isLoading}
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800! hover:text-zinc-50!"
              >
                <Flame className="size-4"/>
                {q.dailyChallenge}
              </Button>
              <Button
                onClick={() => loadQuiz("AI Threats", DEFAULT_QUIZ_SESSION_QUESTIONS)}
                disabled={isLoading}
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800! hover:text-zinc-50!"
              >
                <Brain className="size-4"/>
                {q.aiGeneratedQuiz}
              </Button>
            </div>
          </motion.div>

          {isLoading ? (<div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              {q.loading}
            </div>) : null}

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {categoryCards.map((category) => (<div key={`${category.title}-${category.category}`} id={`quiz-cat-${encodeURIComponent(category.category)}`} className="scroll-mt-28">
                <CategoryCard category={category} difficultyLabel={quizDifficultyLabel(category.difficulty, q)} questionsLabel={q.questionsCount.replace("{{count}}", String(category.quizCount))} startQuizLabel={q.startQuiz} onStart={() => loadQuiz(category.category, DEFAULT_QUIZ_SESSION_QUESTIONS)} disabled={isLoading}/>
              </div>))}
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{q.popularTitle}</h2>
            <div className="space-y-3">
              {popularQuizzes.map((item) => (<QuizCard key={item.title} title={item.title} metaLine={item.meta} difficulty={item.difficulty} difficultyLabel={item.difficultyLabel} playAriaLabel={q.playQuizAria} onPlay={() => loadQuiz(undefined, DEFAULT_QUIZ_SESSION_QUESTIONS)} disabled={isLoading}/>))}
            </div>
          </div>
        </div>
      </section>

      <QuizModal open={quizSession.isOpen} questions={quizSession.questions} onClose={quizSession.close} onRestart={quizSession.restart} modal={q.modal}/>
    </main>);
}
