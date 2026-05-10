"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/app/components/home/Navbar";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
type Props = {
    locale: Locale;
    dictionary: Dictionary;
};
export function SettingsPage({ locale, dictionary }: Props) {
    const s = dictionary.settings;
    return (<main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary}/>

      <section className="relative overflow-hidden px-4 pb-10 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950"/>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]"/>
        <FallingStarsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[1100px] space-y-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8">
            <Link href={`/${locale}/dashboard`} className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-blue-300">
              <ArrowLeft className="size-4" aria-hidden/>
              {s.backToDashboard}
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{s.title}</h1>
            <p className="mt-3 max-w-2xl text-zinc-300">{s.subtitle}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">{s.accountSectionTitle}</h2>
            <div className="mt-6 space-y-2">
              <label htmlFor="settings-email" className="text-sm font-medium text-zinc-200">
                {s.accountEmailLabel}
              </label>
              <p className="text-sm text-zinc-400">{s.accountEmailHint}</p>
              <input id="settings-email" type="email" readOnly disabled placeholder={s.accountEmailInputPlaceholder} className="mt-1 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-400 placeholder:text-zinc-600 disabled:cursor-not-allowed"/>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-100">{s.preferencesSectionTitle}</h2>
            <div className="mt-6 space-y-8">
              <div className="space-y-2">
                <label htmlFor="settings-language" className="text-sm font-medium text-zinc-200">
                  {s.languageSettingLabel}
                </label>
                <p className="text-sm text-zinc-400">{s.languageSettingHint}</p>
                <input id="settings-language" readOnly disabled placeholder={s.languageSettingPlaceholder} className="mt-1 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-400 placeholder:text-zinc-600 disabled:cursor-not-allowed"/>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-zinc-200">{s.notificationsLabel}</div>
                <p className="text-sm text-zinc-400">{s.notificationsHint}</p>
                <input readOnly disabled placeholder={s.notificationsPlaceholder} className="mt-1 w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-400 placeholder:text-zinc-600 disabled:cursor-not-allowed" aria-label={s.notificationsLabel}/>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>);
}
