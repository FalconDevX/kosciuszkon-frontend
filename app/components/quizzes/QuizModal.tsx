"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/types";
import type { QuizQuestion } from "@/types/quiz";
import { appendQuizSessionRecord } from "@/lib/quiz-stats-storage";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
type ModalCopy = Dictionary["quiz"]["modal"];
type Props = {
    open: boolean;
    questions: QuizQuestion[];
    onClose: () => void;
    onRestart: () => void;
    modal: ModalCopy;
};
export function QuizModal({ open, questions, onClose, onRestart, modal }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
    const savedStatsForSessionRef = useRef(false);
    const sessionFingerprint = useMemo(() => questions.map((q) => q.id).join(","), [questions]);
    useEffect(() => {
        if (!open)
            return;
        const onEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open, onClose]);
    useEffect(() => {
        if (!open) {
            savedStatsForSessionRef.current = false;
            return;
        }
        setCurrentIndex(0);
        setAnswers({});
        setShowResults(false);
        savedStatsForSessionRef.current = false;
    }, [open]);
    useEffect(() => {
        savedStatsForSessionRef.current = false;
    }, [sessionFingerprint]);
    const current = questions[currentIndex];
    const progress = questions.length ? ((currentIndex + 1) / questions.length) * 100 : 0;
    const score = useMemo(() => {
        return questions.reduce((acc, question) => {
            if (answers[question.id] === "answer_a")
                return acc + 1;
            return acc;
        }, 0);
    }, [answers, questions]);
    const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
    useEffect(() => {
        if (!open || !showResults || !questions.length)
            return;
        if (savedStatsForSessionRef.current)
            return;
        savedStatsForSessionRef.current = true;
        appendQuizSessionRecord({
            score,
            total: questions.length,
            percent: percentage,
        });
    }, [open, showResults, questions.length, score, percentage]);
    const isLast = currentIndex === questions.length - 1;
    const restart = () => {
        setCurrentIndex(0);
        setAnswers({});
        setShowResults(false);
        savedStatsForSessionRef.current = false;
        onRestart();
    };
    const questionProgress = modal.questionProgress
        .replace("{{current}}", String(currentIndex + 1))
        .replace("{{total}}", String(questions.length));
    const scoreLine = modal.scoreLine
        .replace("{{score}}", String(score))
        .replace("{{total}}", String(questions.length))
        .replace("{{percent}}", String(percentage));
    return (<AnimatePresence>
      {open ? (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <FallingStarsBackground density="sparse" className="z-0"/>
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <button type="button" onClick={onClose} className="absolute right-4 top-4 inline-flex cursor-pointer items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 p-1.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100" aria-label={modal.closeAria}>
              <X className="size-4"/>
            </button>
            {!showResults ? (<>
                <div className="mb-4 flex items-center justify-between pr-10">
                  <h3 className="text-xl font-semibold">{modal.sessionTitle}</h3>
                  <p className="mr-2 text-sm text-zinc-400">{questionProgress}</p>
                </div>
                <div className="mb-5 h-2 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-blue-500/80 transition-all" style={{ width: `${progress}%` }}/>
                </div>

                <motion.p key={current?.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-lg font-medium">
                  {current?.question}
                </motion.p>

                <div className="space-y-2">
                  {current?.options.map((option) => {
                    const selected = answers[current.id] === option.sourceKey;
                    return (<button key={option.id} type="button" onClick={() => setAnswers((prev) => ({
                            ...prev,
                            [current.id]: option.sourceKey,
                        }))} className={`w-full rounded-lg border px-4 py-2.5 text-left transition ${selected
                            ? "border-blue-400/35 bg-zinc-800 text-zinc-100"
                            : "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500"}`}>
                        {option.text}
                      </button>);
                })}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Button variant="outline" onClick={() => setCurrentIndex((q) => Math.max(0, q - 1))} disabled={currentIndex === 0} className="cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100">
                    {modal.previous}
                  </Button>

                  {isLast ? (<Button onClick={() => setShowResults(true)} className="cursor-pointer bg-blue-500/90 text-zinc-100 hover:bg-blue-500">
                      {modal.finishQuiz}
                    </Button>) : (<Button onClick={() => setCurrentIndex((q) => Math.min(q + 1, questions.length - 1))} className="cursor-pointer bg-blue-500/90 text-zinc-100 hover:bg-blue-500">
                      {modal.next}
                    </Button>)}
                </div>
              </>) : (<div className="space-y-4">
                <h3 className="text-2xl font-semibold">{modal.resultsTitle}</h3>
                <p className="text-zinc-300">{scoreLine}</p>
                <div className="space-y-2">
                  {questions.map((question) => {
                    const selectedKey = answers[question.id];
                    const isCorrect = selectedKey === "answer_a";
                    const selectedOption = question.options.find((option) => option.sourceKey === selectedKey);
                    const correctOption = question.options.find((option) => option.sourceKey === "answer_a");
                    return (<div key={question.id} className={`rounded-lg border p-3 text-sm ${isCorrect
                            ? "border-emerald-500/45 bg-emerald-500/10"
                            : "border-rose-500/45 bg-rose-500/10"}`}>
                        <p className="font-medium">{question.question}</p>
                        <p className="mt-1 text-zinc-300">
                          {modal.yourAnswer}{" "}
                          {selectedOption?.text ?? modal.noAnswerSelected}
                        </p>
                        {!isCorrect ? (<p className="text-zinc-200">
                            {modal.correctAnswer} {correctOption?.text ?? modal.unavailable}
                          </p>) : null}
                      </div>);
                })}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button onClick={restart} className="cursor-pointer bg-blue-500/90 text-zinc-100 hover:bg-blue-500">
                    {modal.restartQuiz}
                  </Button>
                  <Button variant="outline" onClick={onClose} className="cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-zinc-100">
                    {modal.close}
                  </Button>
                </div>
              </div>)}
          </motion.div>
        </motion.div>) : null}
    </AnimatePresence>);
}
