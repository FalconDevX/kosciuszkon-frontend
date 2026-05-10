"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Bot,
  Globe,
  Palette,
  Shield,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/app/components/home/Navbar";
import { FallingStarsBackground } from "@/app/components/effects/FallingStarsBackground";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type Props = {
  locale: Locale;
  dictionary: Dictionary;
};

function SectionCard({
  title,
  icon: Icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
    >
      <h2 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-zinc-100 md:text-xl">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400">
          <Icon className="size-4.5" aria-hidden />
        </span>
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </motion.section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  );
}

function SwitchRow({
  label,
  defaultOn,
  enabledText,
  disabledText,
}: {
  label: string;
  defaultOn: boolean;
  enabledText: string;
  disabledText: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800/90 bg-zinc-950/50 px-4 py-3">
      <span className="min-w-0 text-sm font-medium text-zinc-200">{label}</span>
      <div className="flex shrink-0 items-center gap-3">
        <span
          className={`hidden text-xs font-medium sm:inline ${on ? "text-emerald-400/90" : "text-zinc-500"}`}
        >
          {on ? enabledText : disabledText}
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          onClick={() => setOn((v) => !v)}
          className={`relative h-7 w-11 shrink-0 rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            on ? "bg-blue-500/85" : "bg-zinc-600"
          }`}
        >
          <span
            className={`block size-6 rounded-full bg-white shadow-md ring-1 ring-black/10 transition-transform duration-200 ease-out ${
              on ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function OptionChips({
  label,
  optionsLabel,
  options,
  current,
  activeOption,
}: {
  label: string;
  optionsLabel: string;
  options: string[];
  current: string;
  activeOption: string;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-zinc-800/90 bg-zinc-950/50 p-4">
      <p className="text-sm font-medium text-zinc-200">{label}</p>
      <p className="text-sm font-semibold text-zinc-100">{current}</p>
      <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">{optionsLabel}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <span
            key={opt}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              opt === activeOption
                ? "border-blue-500/50 bg-blue-500/20 text-blue-100"
                : "border-zinc-700 bg-zinc-950/80 text-zinc-400"
            }`}
          >
            {opt}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage({ locale, dictionary }: Props) {
  const s = dictionary.settings;
  const langDisplay = locale === "pl" ? s.languagePolish : s.languageEnglish;

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar locale={locale} dictionary={dictionary} />

      <section className="relative overflow-hidden px-4 pb-12 pt-6 md:px-6">
        <div className="pointer-events-none absolute inset-0 bg-zinc-950" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.18)_1px,transparent_1px)] bg-size-[28px_28px] opacity-[0.12]" />
        <FallingStarsBackground />

        <div className="relative z-10 mx-auto w-full max-w-[900px] space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-zinc-800/80 bg-zinc-900/55 p-6 backdrop-blur md:p-8"
          >
            <Link
              href={`/${locale}/dashboard`}
              className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-blue-300"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {s.backToDashboard}
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{s.title}</h1>
            <p className="mt-3 max-w-2xl text-zinc-400">{s.subtitle}</p>
          </motion.div>

          <SectionCard title={s.accountHeading} icon={UserRound} delay={0.03}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldRow label={s.usernameLabel} value={s.usernameValue} />
              <FieldRow label={s.emailLabel} value={s.emailValue} />
            </div>
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{s.changePasswordLabel}</p>
              <p className="mt-1 font-mono text-sm text-zinc-300">{s.passwordMasked}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 cursor-pointer border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800! hover:text-zinc-50!"
              >
                {s.changePasswordButton}
              </Button>
            </div>
            <SwitchRow
              label={s.twoFactorLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <FieldRow label={s.loginSessionsLabel} value={s.loginSessionsValue} />
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-200">{s.connectedDevicesLabel}</p>
              <ul className="space-y-2">
                {[s.deviceWindows, s.deviceMac, s.deviceIphone].map((d) => (
                  <li
                    key={d}
                    className="rounded-lg border border-zinc-800/80 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-300"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-rose-500/35 bg-rose-500/6 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-300/90">{s.dangerZoneTitle}</p>
              <p className="mt-1 text-sm text-zinc-400">{s.deleteAccountLabel}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 cursor-pointer border-rose-500/45 bg-rose-500/10 text-rose-200 hover:border-rose-400/60 hover:bg-rose-500/20! hover:text-rose-50!"
              >
                {s.deleteAccountLabel}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title={s.appearanceHeading} icon={Palette} delay={0.05}>
            <OptionChips
              label={s.themeLabel}
              optionsLabel={s.optionsLabel}
              options={[s.themeLight, s.themeDark, s.themeSystem]}
              current={s.themeCurrent}
              activeOption={s.themeChipActive}
            />
            <OptionChips
              label={s.accentLabel}
              optionsLabel={s.optionsLabel}
              options={[s.accentBlue, s.accentPurple, s.accentGreen, s.accentRed]}
              current={s.accentCurrent}
              activeOption={s.accentChipActive}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FieldRow label={s.uiDensityLabel} value={s.uiDensityValue} />
              <FieldRow label={s.fontSizeLabel} value={s.fontSizeValue} />
            </div>
            <SwitchRow
              label={s.glassmorphismLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.animationsLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <FieldRow label={s.sidebarModeLabel} value={s.sidebarModeValue} />
          </SectionCard>

          <SectionCard title={s.aiHeading} icon={Bot} delay={0.07}>
            <FieldRow label={s.aiModelLabel} value={s.aiModelValue} />
            <OptionChips
              label={s.aiResponseStyleLabel}
              optionsLabel={s.optionsLabel}
              options={[s.aiStyleCreative, s.aiStyleBalanced, s.aiStylePrecise]}
              current={s.aiResponseStyleValue}
              activeOption={s.aiStyleBalanced}
            />
            <SwitchRow
              label={s.streamingLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.visionLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.ocrLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <FieldRow label={s.promptOptimizationLabel} value={s.promptOptimizationValue} />
            <SwitchRow
              label={s.memoryLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
          </SectionCard>

          <SectionCard title={s.notificationsHeading} icon={Bell} delay={0.09}>
            <SwitchRow
              label={s.emailNotificationsLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.pushNotificationsLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.securityAlertsLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.weeklyReportsLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.aiActivityLabel}
              defaultOn={false}
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
          </SectionCard>

          <SectionCard title={s.privacyHeading} icon={Shield} delay={0.11}>
            <FieldRow label={s.profileVisibilityLabel} value={s.profileVisibilityValue} />
            <SwitchRow
              label={s.apiAccessLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <FieldRow label={s.sessionTimeoutLabel} value={s.sessionTimeoutValue} />
            <FieldRow label={s.dataEncryptionLabel} value={s.dataEncryptionValue} />
            <SwitchRow
              label={s.activityLogsLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/50 px-4 py-3">
              <p className="text-sm font-medium text-zinc-200">{s.downloadDataLabel}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-3 cursor-pointer border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-zinc-500 hover:bg-zinc-800! hover:text-zinc-50!"
              >
                {s.exportButton}
              </Button>
            </div>
          </SectionCard>

          <SectionCard title={s.cyberHeading} icon={ShieldCheck} delay={0.13}>
            <SwitchRow
              label={s.urlScannerLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.phishingProtectionLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <FieldRow label={s.threatDetectionLabel} value={s.threatDetectionValue} />
            <SwitchRow
              label={s.screenshotAnalyzerLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <FieldRow label={s.malwareAnalysisLabel} value={s.malwareAnalysisValue} />
          </SectionCard>

          <SectionCard title={s.systemHeading} icon={Globe} delay={0.15}>
            <FieldRow label={s.languageLabel} value={langDisplay} />
            <FieldRow label={s.timezoneLabel} value={s.timezoneValue} />
            <FieldRow label={s.regionLabel} value={s.regionValue} />
            <SwitchRow
              label={s.autoUpdatesLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
            <SwitchRow
              label={s.betaFeaturesLabel}
              defaultOn
              enabledText={s.enabled}
              disabledText={s.disabled}
            />
          </SectionCard>
        </div>
      </section>
    </main>
  );
}
