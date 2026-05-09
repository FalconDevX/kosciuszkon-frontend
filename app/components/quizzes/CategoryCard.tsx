import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { difficultyBadgeClass } from "./difficulty-badge";
import type { CategoryMeta } from "./quiz-metadata";

type Props = {
  category: CategoryMeta;
  difficultyLabel: string;
  questionsLabel: string;
  startQuizLabel: string;
  onStart: () => void;
  disabled?: boolean;
};

export function CategoryCard({
  category,
  difficultyLabel,
  questionsLabel,
  startQuizLabel,
  onStart,
  disabled,
}: Props) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-5 backdrop-blur"
    >
      <div className="flex items-center justify-between">
        <category.icon className="size-5 text-zinc-300" />
        <span
          className={`rounded-full border px-2 py-0.5 text-xs ${difficultyBadgeClass(category.difficulty)}`}
        >
          {difficultyLabel}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold">{category.title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{category.description}</p>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
        <span>{questionsLabel}</span>
        <span>{category.estimatedTime}</span>
      </div>

      <Button
        onClick={onStart}
        disabled={disabled}
        className="mt-4 w-full bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-55"
      >
        {startQuizLabel}
      </Button>
    </motion.article>
  );
}
