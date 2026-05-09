"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import type { DangerLevel, WikiArticle } from "@/types/wiki";

type WikiArticleViewProps = {
  article: WikiArticle | null;
};

function dangerBadgeClass(level: DangerLevel) {
  if (level === "Low") return "border-emerald-500/35 bg-emerald-500/15 text-emerald-300";
  if (level === "Medium") return "border-amber-500/35 bg-amber-500/15 text-amber-300";
  if (level === "High") return "border-orange-500/35 bg-orange-500/15 text-orange-300";
  return "border-rose-500/35 bg-rose-500/15 text-rose-300";
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-300">{title}</h3>
      <ul className="space-y-1 text-sm leading-6 text-zinc-300">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}

export function WikiArticleView({ article }: WikiArticleViewProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={article?.id ?? "empty"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        className="rounded-2xl border border-zinc-800/80 bg-zinc-900/55 p-5 backdrop-blur md:p-6"
      >
        {!article ? (
          <p className="text-sm text-zinc-400">Select an article to preview.</p>
        ) : (
          <div className="space-y-6">
            <header className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${dangerBadgeClass(article.dangerLevel)}`}
                >
                  <AlertTriangle className="size-3.5" />
                  {article.dangerLevel}
                </span>
                <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-400">
                  {article.readingTime}
                </span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">{article.title}</h2>
              <p className="max-w-3xl text-sm leading-6 text-zinc-300">{article.description}</p>
            </header>

            <Section title="How It Works" items={article.howItWorks} />
            <Section title="Examples" items={article.examples} />
            <Section title="Red Flags" items={article.redFlags} />
            <Section title="Prevention Tips" items={article.preventionTips} />
            <Section title="Related Topics" items={article.relatedTopics} />

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-rose-200">
                  <ShieldAlert className="size-4" />
                  Warning
                </p>
                <p className="mt-2 text-sm text-rose-100/90">
                  High-risk behaviors often begin with urgency and unverified requests.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-200">
                  <ShieldCheck className="size-4" />
                  Best Practice
                </p>
                <p className="mt-2 text-sm text-emerald-100/90">
                  Always validate identity and context before sharing data or approving actions.
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.article>
    </AnimatePresence>
  );
}
