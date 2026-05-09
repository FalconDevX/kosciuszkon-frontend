import { useEffect, useState } from "react";
import type { WikiArticle } from "@/types/wiki";

export function useSelectedArticle(articles: WikiArticle[]) {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    articles[0]?.id ?? null,
  );

  useEffect(() => {
    if (!articles.length) {
      setSelectedArticleId(null);
      return;
    }

    const stillExists = articles.some((article) => article.id === selectedArticleId);
    if (!stillExists) {
      setSelectedArticleId(articles[0].id);
    }
  }, [articles, selectedArticleId]);

  const selectedArticle =
    articles.find((article) => article.id === selectedArticleId) ?? null;

  return {
    selectedArticleId,
    selectedArticle,
    setSelectedArticleId,
  };
}
