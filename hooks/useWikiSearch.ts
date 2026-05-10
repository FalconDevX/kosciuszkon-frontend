import { useMemo } from "react";
import type { WikiArticle } from "@/types/wiki";
export function useWikiSearch(articles: WikiArticle[], selectedCategory: string, searchQuery: string) {
    return useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return articles.filter((article) => {
            if (article.category !== selectedCategory) {
                return false;
            }
            if (!query) {
                return true;
            }
            return (article.title.toLowerCase().includes(query) ||
                article.description.toLowerCase().includes(query));
        });
    }, [articles, selectedCategory, searchQuery]);
}
