"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Dice5, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/app/components/home/Navbar";
import { quizApi } from "@/services/api/quiz-api";
import { useQuizSession } from "@/hooks/useQuizSession";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { QuizCategory } from "@/types/quiz";
import { CategoryCard } from "./CategoryCard";
import { QuizCard } from "./QuizCard";
import { QuizModal } from "./QuizModal";
import { categoryMetadata } from "./quiz-metadata";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

const categoryButtons: Array<{ label: string; category?: QuizCategory }> = [
  { label: "Random Quiz" },
  { label: "Phishing Quiz", category: "Phishing" },
  { label: "Password Security Quiz", category: "Password Security" },
  { label: "Web Security Quiz", category: "Web Security" },
  { label: "Workplace Security Quiz", category: "Workplace Security" },
  { label: "AI Threats Quiz", category: "AI Threats" },
];

export function QuizzesDashboard({ locale, dictionary }: Props) {
  const quiz = useQuizSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedCount, setLastLoadedCount] = useState<number>(0);

  const popularQuizzes = useMemo(
    () => [
      { title: "Phishing Detection", difficulty: "Medium" as const, questions: 15, estimatedTime: "8 min" },
      {
        title: "Password Audit Sprint",
        difficulty: "Beginner" as const,
        questions: 10,
        estimatedTime: "6 min",
      },
      {
        title: "Browser Risk Radar",
        difficulty: "Advanced" as const,
        questions: 18,
        estimatedTime: "11 min",
      },
    ],
    [],
  );

  const loadQuiz = async (category?: QuizCategory) => {
    setError(null);
    setIsLoading(true);
    try {
      const questions = category
        ? await quizApi.getCategoryQuiz(category)
        : await quizApi.getRandomQuiz();

      setLastLoadedCount(questions.length);
      if (!questions.length) {
        setError("No quiz questions available for this selection.");
        return;
      }

      quiz.start(questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />

      <section className="relative overflow-hidden px-4 pb-8 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]" />

        <div className="relative mx-auto w-full max-w-[1300px] space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
          >
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Cybersecurity Quizzes
            </h1>
            <p className="mt-3 max-w-2xl text-zinc-300">
              Test your skills, improve awareness, and learn to recognize real threats.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => loadQuiz()}
                disabled={isLoading}
                className="bg-blue-500/85 text-zinc-100 hover:bg-blue-500"
              >
                <Dice5 className="size-4" />
                Random Quiz
              </Button>
              <Button
                onClick={() => loadQuiz("Phishing")}
                disabled={isLoading}
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
              >
                <Flame className="size-4" />
                Daily Challenge
              </Button>
              <Button
                onClick={() => loadQuiz("AI Threats")}
                disabled={isLoading}
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
              >
                <Brain className="size-4" />
                AI Generated Quiz
              </Button>
            </div>
          </motion.div>

          <div className="grid gap-2 rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-2 md:grid-cols-2 xl:grid-cols-3">
            {categoryButtons.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                disabled={isLoading}
                onClick={() => loadQuiz(item.category)}
                className="justify-start text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              Loading quiz questions...
            </div>
          ) : null}
          {error ? (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 p-4 text-sm text-zinc-200">
              {error}
            </div>
          ) : null}
          {!isLoading && !error && lastLoadedCount === 0 ? (
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 text-sm text-zinc-300">
              Start a quiz to load questions from the backend.
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {categoryMetadata.map((category) => (
              <CategoryCard
                key={`${category.title}-${category.category}`}
                category={category}
                onStart={() => loadQuiz(category.category)}
                disabled={isLoading}
              />
            ))}
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Popular Quizzes</h2>
            <div className="space-y-3">
              {popularQuizzes.map((item) => (
                <QuizCard
                  key={item.title}
                  title={item.title}
                  difficulty={item.difficulty}
                  questions={item.questions}
                  estimatedTime={item.estimatedTime}
                  onPlay={() => loadQuiz()}
                  disabled={isLoading}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuizModal
        open={quiz.isOpen}
        questions={quiz.questions}
        onClose={quiz.close}
        onRestart={quiz.restart}
      />
    </main>
  );
}
