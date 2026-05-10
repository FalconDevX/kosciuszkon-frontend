"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/types";

/**
 * Centers match reference overlay on the clean screenshot (`phishing-email-spot-test.jpg`, 1024×875).
 * Coordinates from editor reference image (same pixel size).
 */
const HOTSPOTS = [
  { id: 1, leftPct: 48, topPct: 8 },
  { id: 2, leftPct: 38, topPct: 28 },
  { id: 3, leftPct: 20, topPct: 42 },
  { id: 4, leftPct: 74, topPct: 46 },
  { id: 5, leftPct: 48, topPct: 62 },
  { id: 6, leftPct: 31, topPct: 76 },
  { id: 7, leftPct: 14, topPct: 91 },
] as const;

const TOTAL = HOTSPOTS.length;

type Props = {
  copy: Dictionary["interactiveTests"]["phishingSpot"];
};

export function PhishingSpotTest({ copy }: Props) {
  const [found, setFound] = useState<Set<number>>(() => new Set());
  const [finishedEarly, setFinishedEarly] = useState(false);
  const [banner, setBanner] = useState<{ variant: "hit" | "miss" | "dup"; title: string; body: string } | null>(
    null,
  );

  const progressLine = useMemo(
    () => copy.progressLabel.replace("{{found}}", String(found.size)).replace("{{total}}", String(TOTAL)),
    [copy.progressLabel, found.size],
  );

  const complete = found.size >= TOTAL;
  const locked = complete || finishedEarly;

  const missedIds = useMemo(
    () => HOTSPOTS.map((h) => h.id).filter((id) => !found.has(id)),
    [found],
  );

  const reset = () => {
    setFound(new Set());
    setFinishedEarly(false);
    setBanner(null);
  };

  const onFinish = () => {
    if (complete || finishedEarly) return;
    setFinishedEarly(true);
    setBanner(null);
  };

  const onHotspotClick = (id: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (locked) return;

    const spot = copy.spots[id - 1];
    if (!spot) return;

    if (found.has(id)) {
      setBanner({ variant: "dup", title: copy.feedbackTitle, body: copy.alreadyFound });
      return;
    }

    const next = new Set(found);
    next.add(id);
    setFound(next);
    setBanner({
      variant: "hit",
      title: spot.title,
      body: spot.detail,
    });
  };

  const onBackdropClick = () => {
    if (locked) return;
    setBanner({ variant: "miss", title: copy.feedbackTitle, body: copy.miss });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-50">{copy.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-300">{copy.subtitle}</p>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">{copy.instructions}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-zinc-200" aria-live="polite">
          {progressLine}
          {complete ? (
            <span className="ml-2 inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="size-4" aria-hidden />
              {copy.complete}
            </span>
          ) : null}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onFinish}
            disabled={locked}
            className="bg-zinc-800 text-zinc-100 hover:bg-zinc-700 disabled:opacity-40"
          >
            {copy.finish}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={reset} className="border-zinc-600 bg-zinc-900 text-zinc-100">
            {copy.reset}
          </Button>
        </div>
      </div>

      <motion.div
        layout
        className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-[0_0_0_1px_rgba(39,39,42,0.6)]"
      >
        <Image
          src="/interactive/phishing-email-spot-test.jpg"
          alt={copy.imageAlt}
          width={1024}
          height={875}
          className="relative z-0 block h-auto w-full select-none"
          draggable={false}
          priority
        />

        <div
          role="presentation"
          className={`absolute inset-0 z-[1] ${locked ? "cursor-default" : "cursor-crosshair"}`}
          onClick={onBackdropClick}
        />

        {HOTSPOTS.map(({ id, leftPct, topPct }) => {
          const isFound = found.has(id);
          const showMissedReveal = finishedEarly && !isFound;
          return (
            <button
              key={id}
              type="button"
              aria-label={copy.spotAriaLabel.replace("{{n}}", String(id))}
              aria-pressed={isFound}
              tabIndex={locked ? -1 : 0}
              className={`absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 transition-[colors,box-shadow] focus:outline-none min-h-[44px] min-w-[44px] w-[11%] max-w-[92px] aspect-square ${
                isFound
                  ? "border-emerald-400/90 bg-emerald-500/25 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]"
                  : showMissedReveal
                    ? "cursor-default border-amber-400/95 bg-amber-500/20 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]"
                    : "cursor-crosshair border-transparent bg-transparent"
              } ${locked ? "pointer-events-none" : ""} ${!locked && !isFound ? "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950" : ""}`}
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
              onClick={(e) => onHotspotClick(id, e)}
            >
              {isFound ? (
                <CheckCircle2 className="size-[42%] min-w-[22px] text-emerald-200" aria-hidden />
              ) : showMissedReveal ? (
                <CircleDot className="size-[42%] min-w-[22px] text-amber-200" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </motion.div>

      {finishedEarly && missedIds.length > 0 ? (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-amber-900/50 bg-amber-950/25 px-4 py-4 text-amber-50"
          aria-labelledby="missed-spots-heading"
        >
          <h3 id="missed-spots-heading" className="text-base font-semibold text-amber-100">
            {copy.missedSectionTitle}
          </h3>
          <p className="mt-1 text-sm text-amber-200/90">{copy.missedSectionSubtitle}</p>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-zinc-100 marker:text-amber-400">
            {missedIds.map((id) => {
              const spot = copy.spots[id - 1];
              if (!spot) return null;
              return (
                <li key={id} className="pl-1">
                  <span className="font-medium text-zinc-50">{spot.title}</span>
                  <p className="mt-1 leading-relaxed text-zinc-300">{spot.detail}</p>
                </li>
              );
            })}
          </ol>
        </motion.section>
      ) : null}

      {banner ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${
            banner.variant === "hit"
              ? "border-emerald-800/80 bg-emerald-950/45 text-emerald-50"
              : banner.variant === "dup"
                ? "border-amber-800/80 bg-amber-950/40 text-amber-50"
                : "border-zinc-700 bg-zinc-900/80 text-zinc-100"
          }`}
        >
          <p className="font-semibold">{banner.title}</p>
          <p className="mt-1 text-[0.925rem] leading-relaxed opacity-95">{banner.body}</p>
        </motion.div>
      ) : null}
    </div>
  );
}
