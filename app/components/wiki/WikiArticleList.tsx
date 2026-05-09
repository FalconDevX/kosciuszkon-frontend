"use client";

import { motion } from "framer-motion";
import type { WikiArticle } from "@/types/wiki";
import { WikiArticleCard } from "./WikiArticleCard";

type WikiArticleListProps = {
  articles: WikiArticle[];
  selectedArticleId: string | null;
  onSelect: (id: string) => void;
};

export function WikiArticleList({
  articles,
  selectedArticleId,
  onSelect,
}: WikiArticleListProps) {
  if (!articles.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/45 p-4 text-sm text-zinc-400">
        No topics found for this category/search.
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
          />
        </motion.div>
      ))}
    </div>
  );
}
