"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { AuthPanel } from "@/app/components/auth/AuthPanel";
import { Navbar } from "./Navbar";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

type HomeProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Home({ locale, dictionary }: HomeProps) {
  const featureHighlights = dictionary.home.featureHighlights.slice(0, 4);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />
      <section className="relative min-h-[calc(100vh-4rem)] px-6 py-10 md:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_48%,rgba(59,130,246,0.16),transparent_32%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-9rem)] w-full max-w-[1280px] flex-col items-start justify-center gap-6 lg:flex-row lg:items-center xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center lg:gap-6"
          >
            <Image
              src="/safe_click_dark_small.png"
              alt="SafeClick shield logo"
              width={280}
              height={280}
              className="h-auto w-full max-w-[260px] self-center will-change-transform"
              style={{ animation: "float-soft-a 6.6s ease-in-out infinite" }}
              priority
            />
            <Image
              src="/safe_click_dark_title.png"
              alt="SafeClick title logo"
              width={720}
              height={160}
              className="h-auto w-full max-w-[520px] will-change-transform"
              style={{ animation: "float-soft-b 7.2s ease-in-out infinite" }}
              priority
            />
            <div className="max-w-[560px] text-left">
              <ul className="mt-1 space-y-2 text-sm text-zinc-300">
                {featureHighlights.map((feature, index) => (
                  <motion.li
                    key={feature}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.28 + index * 0.14,
                      ease: "easeOut",
                    }}
                  >
                    <span className="pr-2 text-blue-400">-</span>
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: "easeOut" }}
          >
            <AuthPanel dictionary={dictionary} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
