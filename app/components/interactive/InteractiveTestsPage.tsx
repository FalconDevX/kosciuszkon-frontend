"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/app/components/home/Navbar";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
import { PhishingSpotTest } from "@/app/components/interactive/PhishingSpotTest";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

export function InteractiveTestsPage({ locale, dictionary }: Props) {
  const t = dictionary.interactiveTests;

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />

      <section className="relative overflow-hidden px-4 pb-12 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]" />
        <FallingStarsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[1100px] space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
          >
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.pageTitle}</h1>
            <p className="mt-3 max-w-2xl text-zinc-300">{t.pageSubtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
          >
            <PhishingSpotTest copy={t.phishingSpot} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
