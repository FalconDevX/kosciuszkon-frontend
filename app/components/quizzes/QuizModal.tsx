"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/types/quiz";

type Props = {
  open: boolean;
  questions: QuizQuestion[];
  onClose: () => void;
  onRestart: () => void;
};

export function QuizModal({ open, questions, onClose, onRestart }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
  }, [open]);

  const current = questions[currentIndex];
  const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const score = useMemo(() => {
    return questions.reduce((acc, question) => {
      if (answers[question.id] === "answer_a") return acc + 1;
      return acc;
    }, 0);
  }, [answers, questions]);

  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const isLast = currentIndex === questions.length - 1;

  const restart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResults(false);
    onRestart();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 inline-flex cursor-pointer items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Close quiz"
            >
              <X className="size-4" />
            </button>
            {!showResults ? (
              <>
                <div className="mb-4 flex items-center justify-between pr-10">
                  <h3 className="text-xl font-semibold">Quiz Session</h3>
                  <p className="text-sm text-zinc-400 mr-2">
                    Question {currentIndex + 1}/{questions.length}
                  </p>
                </div>
                <div className="mb-5 h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-blue-500/80 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <motion.p
                  key={current?.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-lg font-medium"
                >
                  {current?.question}
                </motion.p>

                <div className="space-y-2">
                  {current?.options.map((option) => {
                    const selected = answers[current.id] === option.sourceKey;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() =>
                          setAnswers((prev) => ({
                            ...prev,
                            [current.id]: option.sourceKey,
                          }))
                        }
                        className={`w-full rounded-lg border px-4 py-2.5 text-left transition ${
                          selected
                            ? "border-blue-400/35 bg-zinc-800 text-zinc-100"
                            : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500"
                        }`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((q) => Math.max(0, q - 1))}
                    disabled={currentIndex === 0}
                    className="cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    Previous
                  </Button>

                  {isLast ? (
                    <Button
                      onClick={() => setShowResults(true)}
                      className="cursor-pointer bg-blue-500/90 text-zinc-100 hover:bg-blue-500"
                    >
                      Finish Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentIndex((q) => Math.min(q + 1, questions.length - 1))}
                      className="cursor-pointer bg-blue-500/90 text-zinc-100 hover:bg-blue-500"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Results</h3>
                <p className="text-zinc-300">
                  Score: {score}/{questions.length} ({percentage}%)
                </p>
                <div className="space-y-2">
                  {questions.map((question) => {
                    const selectedKey = answers[question.id];
                    const isCorrect = selectedKey === "answer_a";
                    const selectedOption = question.options.find(
                      (option) => option.sourceKey === selectedKey,
                    );
                    const correctOption = question.options.find(
                      (option) => option.sourceKey === "answer_a",
                    );

                    return (
                      <div
                        key={question.id}
                        className={`rounded-lg border p-3 text-sm ${
                          isCorrect
                            ? "border-emerald-500/45 bg-emerald-500/10"
                            : "border-rose-500/45 bg-rose-500/10"
                        }`}
                      >
                        <p className="font-medium">{question.question}</p>
                        <p className="mt-1 text-zinc-300">
                          Your answer: {selectedOption?.text ?? "No answer selected"}
                        </p>
                        {!isCorrect ? (
                          <p className="text-zinc-200">
                            Correct answer: {correctOption?.text ?? "Unavailable"}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={restart}
                    className="cursor-pointer bg-blue-500/90 text-zinc-100 hover:bg-blue-500"
                  >
                    Restart Quiz
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
