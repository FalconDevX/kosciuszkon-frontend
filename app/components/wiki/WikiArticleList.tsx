"use client";

import { motion } from "framer-motion";
import type { Dictionary } from "@/i18n/types";
import { wikiDangerLabel } from "@/lib/wiki-danger-label";
import type { WikiArticle } from "@/types/wiki";
import { WikiArticleCard } from "./WikiArticleCard";

type WikiArticleListProps = {
  articles: WikiArticle[];
  selectedArticleId: string | null;
  onSelect: (id: string) => void;
  emptyMessage: string;
  wiki: Dictionary["wiki"];
};

export function WikiArticleList({
  articles,
  selectedArticleId,
  onSelect,
  emptyMessage,
  wiki,
}: WikiArticleListProps) {
  if (!articles.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/45 p-4 text-sm text-zinc-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {articles.map((article, index) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
        >
          <WikiArticleCard
            article={article}
            selected={selectedArticleId === article.id}
            onSelect={() => onSelect(article.id)}
            dangerLevelLabel={wikiDangerLabel(article.dangerLevel, wiki)}
          />
        </motion.div>
      ))}
    </div>
  );
}
