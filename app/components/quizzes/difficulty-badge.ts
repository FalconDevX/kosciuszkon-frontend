import type { QuizDifficulty } from "@/types/quiz";

export function difficultyBadgeClass(difficulty: QuizDifficulty) {
  if (difficulty === "Beginner") {
    return "border-zinc-700 bg-zinc-800/70 text-zinc-300";
  }
  if (difficulty === "Medium") {
    return "border-zinc-700 bg-zinc-800/70 text-zinc-300";
  }
  if (difficulty === "Advanced") {
    return "border-blue-400/30 bg-blue-500/12 text-blue-200";
  }
  return "border-zinc-700 bg-zinc-800/70 text-zinc-300";
}
