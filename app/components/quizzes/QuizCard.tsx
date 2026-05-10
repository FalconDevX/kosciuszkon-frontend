import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { difficultyBadgeClass } from "./difficulty-badge";
import type { QuizDifficulty } from "@/types/quiz";

type Props = {
  title: string;
  metaLine: string;
  difficulty: QuizDifficulty;
  difficultyLabel: string;
  playAriaLabel: string;
  onPlay: () => void;
  disabled?: boolean;
};

export function QuizCard({
  title,
  metaLine,
  difficulty,
  difficultyLabel,
  playAriaLabel,
  onPlay,
  disabled,
}: Props) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/70 px-4 py-3 backdrop-blur"
    >
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-zinc-400">{metaLine}</p>
        <span
          className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs ${difficultyBadgeClass(difficulty)}`}
        >
          {difficultyLabel}
        </span>
      </div>
      <Button
        size="sm"
        onClick={onPlay}
        disabled={disabled}
        aria-label={playAriaLabel}
        className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700"
      >
        <Play className="size-4" />
      </Button>
    </motion.div>
  );
}
