import { useMemo } from "react";
import type { WikiArticle, WikiCategory } from "@/types/wiki";

function articleMatchesQuery(article: WikiArticle, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    article.title.toLowerCase().includes(q) ||
    article.description.toLowerCase().includes(q)
  );
}

export function useWikiSearch(
  articles: WikiArticle[],
  categories: WikiCategory[],
  selectedCategory: string,
  searchQuery: string,
) {
  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      const filteredArticles = articles.filter((article) => article.category === selectedCategory);
      return { filteredArticles, sidebarCategories: categories };
    }

    const sidebarCategories = categories.filter((cat) => {
      const labelMatches = cat.label.toLowerCase().includes(query);
      const hasMatchingArticle = articles.some(
        (a) => a.category === cat.id && articleMatchesQuery(a, query),
      );
      return labelMatches || hasMatchingArticle;
    });

    const selectedCatMeta = categories.find((c) => c.id === selectedCategory);
    const selectedCategoryLabelMatches = Boolean(
      selectedCatMeta?.label.toLowerCase().includes(query),
    );

    const filteredArticles = articles.filter((article) => {
      if (article.category !== selectedCategory) return false;
      if (selectedCategoryLabelMatches) return true;
      return articleMatchesQuery(article, query);
    });

    return { filteredArticles, sidebarCategories };
  }, [articles, categories, selectedCategory, searchQuery]);
}
