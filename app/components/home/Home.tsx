"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AuthPanel } from "@/app/components/auth/AuthPanel";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
import { HomeMiniChat } from "@/app/components/home/HomeMiniChat";
import { Navbar } from "./Navbar";
import { getStoredUserId } from "@/lib/auth-storage";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

const HomeLoggedInLaptop = dynamic(
  () =>
    import("@/app/components/home/HomeLoggedInLaptop").then((m) => ({
      default: m.HomeLoggedInLaptop,
    })),
  { ssr: false },
);

type HomeProps = {
  locale: Locale;
  dictionary: Dictionary;
};

export function Home({ locale, dictionary }: HomeProps) {
  const featureHighlights = dictionary.home.featureHighlights.slice(0, 4);
  const headline = dictionary.home.mainHeadline;
  const [typedLength, setTypedLength] = useState(0);
  const [storedUserState, setStoredUserState] = useState<"loading" | "in" | "out">("loading");

  useEffect(() => {
    setStoredUserState(getStoredUserId() ? "in" : "out");
  }, []);

  useEffect(() => {
    setTypedLength(0);

    const typingInterval = window.setInterval(() => {
      setTypedLength((current) => {
        if (current >= headline.length) {
          window.clearInterval(typingInterval);
          return current;
        }
        return current + 1;
      });
    }, 32);

    return () => window.clearInterval(typingInterval);
  }, [headline]);

  const isTypingFinished = typedLength >= headline.length;
  const typingHeadline = headline.slice(0, typedLength);

  const highlightedHeadline = (() => {
    const pattern =
      locale === "pl"
        ? /(cyberbezpieczeństwa|cyberbezpieczenstwa)/i
        : /(cybersecurity)/i;

    const match = headline.match(pattern);
    if (!match || match.index === undefined) {
      return headline;
    }

    const start = match.index;
    const end = start + match[0].length;

    return (
      <>
        {headline.slice(0, start)}
        <span className="cyber-gloss">{headline.slice(start, end)}</span>
        {headline.slice(end)}
      </>
    );
  })();

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />
      <section className="relative h-[calc(100vh-4rem)] overflow-hidden px-6 py-6 md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_48%,rgba(59,130,246,0.16),transparent_32%)]" />
        <FallingStarsBackground />
        <div className="relative z-10 mt-4 flex w-full items-center justify-center md:mt-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mb-2 w-full text-center font-mono text-2xl font-bold tracking-tight text-zinc-100 md:text-4xl"
          >
            {isTypingFinished ? highlightedHeadline : typingHeadline}
            {!isTypingFinished ? (
              <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-zinc-100 align-middle" />
            ) : null}
          </motion.h1>
        </div>
        <div className="relative z-10 mx-auto flex h-[calc(100vh-10rem)] w-full max-w-[1280px] flex-col items-start justify-center gap-4 lg:-translate-y-10 lg:flex-row lg:items-center xl:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:flex lg:flex-col lg:items-start lg:justify-center lg:gap-6"
          >
            <Image
              src="/safe_click_dark_small.png"
              alt="SafeClick shield logo"
              width={240}
              height={240}
              className="h-auto w-full max-w-[210px] self-center will-change-transform"
              style={{ animation: "float-soft-a 6.6s ease-in-out infinite" }}
              priority
            />
            <Image
              src="/safe_click_dark_title.png"
              alt="SafeClick title logo"
              width={640}
              height={142}
              className="h-auto w-full max-w-[440px] will-change-transform"
              style={{ animation: "float-soft-b 7.2s ease-in-out infinite" }}
              priority
            />
            <div className="max-w-[560px] text-left">
              <ul className="mt-1 space-y-2 text-base text-zinc-300">
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
            {storedUserState === "loading" ? (
              <div
                className="w-full max-w-md min-h-[min(520px,70vh)] rounded-2xl border border-zinc-800/40 bg-zinc-900/40"
                aria-hidden
              />
            ) : storedUserState === "in" ? (
              <HomeLoggedInLaptop dictionary={dictionary} locale={locale} />
            ) : (
              <AuthPanel dictionary={dictionary} locale={locale} />
            )}
          </motion.div>
        </div>
      </section>
      <HomeMiniChat locale={locale} dictionary={dictionary.home} />
    </main>
  );
}
