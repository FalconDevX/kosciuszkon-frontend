"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/app/components/home/Navbar";
import { WikiArticleList } from "@/app/components/wiki/WikiArticleList";
import { WikiArticleView } from "@/app/components/wiki/WikiArticleView";
import { WikiSearch } from "@/app/components/wiki/WikiSearch";
import { WikiSidebar } from "@/app/components/wiki/WikiSidebar";
import { useSelectedArticle } from "@/hooks/useSelectedArticle";
import { useWikiSearch } from "@/hooks/useWikiSearch";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import { getWikiArticles, getWikiCategories } from "@/services/wikiApi";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

const categories = getWikiCategories();
const articles = getWikiArticles();

export function CyberWikiDashboard({ locale, dictionary }: Props) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useWikiSearch(articles, selectedCategory, searchQuery);
  const { selectedArticleId, selectedArticle, setSelectedArticleId } =
    useSelectedArticle(filteredArticles);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />

      <section className="relative overflow-hidden px-4 pb-8 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]" />

        <div className="relative mx-auto w-full max-w-[1450px] space-y-5">
          <motion.header
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur"
          >
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Cybersecurity Wiki</h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-300 md:text-base">
              Learn cybersecurity concepts, recognize threats, and improve your digital safety.
            </p>
            <div className="mt-4">
              <WikiSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          </motion.header>

          <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <WikiSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />

            <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
              <WikiArticleList
                articles={filteredArticles}
                selectedArticleId={selectedArticleId}
                onSelect={setSelectedArticleId}
              />
              <WikiArticleView article={selectedArticle} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
