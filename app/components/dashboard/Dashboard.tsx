"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Settings } from "lucide-react";
import { Navbar } from "@/app/components/home/Navbar";
import { getStoredUserId } from "@/lib/auth-storage";
import { DASHBOARD_RECOMMENDED_WIKI_IDS } from "@/lib/dashboard-recommended-articles";
import { DEFAULT_QUIZ_SESSION_QUESTIONS } from "@/lib/quiz-limits";
import { fetchUsernameByUserId } from "@/lib/user-profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { WikiArticle } from "@/types/wiki";
import { categoryMetadata } from "@/app/components/quizzes/quiz-metadata";
import { getWikiArticles } from "@/services/wikiApi";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Dashboard({ locale, dictionary }: Props) {
  const d = dictionary.dashboard;
  const [displayUsername, setDisplayUsername] = useState<string | null>(null);

  useEffect(() => {
    const userId = getStoredUserId();
    if (!userId) {
      setDisplayUsername(null);
      return;
    }

    let cancelled = false;
    fetchUsernameByUserId(userId).then((name) => {
      if (!cancelled && name) setDisplayUsername(name);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const articles = getWikiArticles();
  const recommended = DASHBOARD_RECOMMENDED_WIKI_IDS.map((id) =>
    articles.find((a) => a.id === id),
  ).filter((a): a is WikiArticle => a != null);

  const quizBody = d.quizCardBody
    .replace("{{count}}", String(categoryMetadata.length))
    .replace("{{questions}}", String(DEFAULT_QUIZ_SESSION_QUESTIONS))
    .replace("{{minutes}}", String(DEFAULT_QUIZ_SESSION_QUESTIONS));

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />

      <section className="relative overflow-hidden px-4 pb-10 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]" />

        <div className="relative mx-auto w-full max-w-[1100px] space-y-8">
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{d.title}</h1>
                <p className="mt-3 max-w-2xl text-zinc-300">{d.subtitle}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
                {displayUsername ? (
                  <div className="rounded-full border border-zinc-700/90 bg-zinc-950/70 px-4 py-2 text-sm text-zinc-200 shadow-[0_0_0_1px_rgba(59,130,246,0.12)]">
                    <span className="text-zinc-300">{d.greetingHello}</span>{" "}
                    <span className="font-medium text-blue-200">{displayUsername}</span>
                  </div>
                ) : null}
                <Link
                  href={`/${locale}/settings`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-950 px-4 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-50"
                >
                  <Settings className="size-4 text-zinc-400" aria-hidden />
                  {d.settings}
                </Link>
              </div>
            </div>
          </motion.header>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-6 backdrop-blur"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-950">
                  <ClipboardList className="size-5 text-blue-400" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-3">
                  <h2 className="text-lg font-semibold text-zinc-100">{d.quizCardTitle}</h2>
                  <p className="text-sm leading-relaxed text-zinc-400">{quizBody}</p>
                  <Link
                    href={`/${locale}/quiz`}
                    className="mt-2 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-500 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-blue-400"
                  >
                    {d.quizCta}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/70 p-6 backdrop-blur"
            >
              <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4">
                <BookOpen className="size-5 text-blue-400" aria-hidden />
                <div>
                  <h2 className="text-lg font-semibold text-zinc-100">{d.recommendedTitle}</h2>
                  <p className="text-sm text-zinc-400">{d.recommendedSubtitle}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-3">
                {recommended.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/${locale}/wiki-concepts?article=${encodeURIComponent(article.id)}`}
                      className="group flex items-start justify-between gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/50 px-4 py-3 transition-colors hover:border-blue-500/35 hover:bg-zinc-900/90"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-zinc-100 group-hover:text-blue-100">
                          {article.title}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-500">
                          {article.description}
                        </p>
                        <p className="mt-2 text-xs text-zinc-500">{article.readingTime}</p>
                      </div>
                      <span className="shrink-0 pt-0.5 text-xs font-medium text-blue-400/90">
                        {d.readArticle}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>
        </div>
      </section>
    </main>
  );
}
