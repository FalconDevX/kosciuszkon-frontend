"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { DangerLevel, WikiArticle } from "@/types/wiki";

type WikiArticleCardProps = {
  article: WikiArticle;
  selected: boolean;
  onSelect: () => void;
  dangerLevelLabel: string;
};

function dangerBadgeClass(level: DangerLevel) {
  if (level === "Low") return "border-emerald-500/35 bg-emerald-500/15 text-emerald-300";
  if (level === "Medium") return "border-amber-500/35 bg-amber-500/15 text-amber-300";
  if (level === "High") return "border-orange-500/35 bg-orange-500/15 text-orange-300";
  return "border-rose-500/35 bg-rose-500/15 text-rose-300";
}

export function WikiArticleCard({
  article,
  selected,
  onSelect,
  dangerLevelLabel,
}: WikiArticleCardProps) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition ${
        selected
          ? "border-blue-400/25 bg-zinc-800/85"
          : "border-zinc-800 bg-zinc-900/55 hover:border-zinc-700 hover:bg-zinc-900/75"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-zinc-100">{article.title}</h3>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${dangerBadgeClass(article.dangerLevel)}`}
        >
          <AlertTriangle className="size-3" />
          {dangerLevelLabel}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{article.description}</p>
      <p className="mt-3 text-xs text-zinc-500">{article.readingTime}</p>
    </motion.button>
  );
}
