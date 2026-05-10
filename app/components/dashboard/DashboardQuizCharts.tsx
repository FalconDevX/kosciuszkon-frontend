"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { QuizSessionRecord } from "@/lib/quiz-stats-storage";
import { getQuizSessionRecords } from "@/lib/quiz-stats-storage";
type Props = {
    locale: Locale;
    dictionary: Dictionary["dashboard"]["quizStats"];
};
const LAST_N = 12;
function formatShortDate(iso: string, locale: Locale): string {
    try {
        const d = new Date(iso);
        return new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
            day: "numeric",
            month: "short",
        }).format(d);
    }
    catch {
        return "";
    }
}
export function DashboardQuizCharts({ locale, dictionary }: Props) {
    const [sessions, setSessions] = useState<QuizSessionRecord[]>([]);
    useEffect(() => {
        setSessions(getQuizSessionRecords().slice(-LAST_N));
    }, []);
    const barMetrics = useMemo(() => {
        if (!sessions.length)
            return null;
        const maxScore = Math.max(...sessions.map((s) => s.score), 1);
        const padding = { top: 12, right: 8, bottom: 28, left: 36 };
        const w = 560;
        const h = 200;
        const innerW = w - padding.left - padding.right;
        const innerH = h - padding.top - padding.bottom;
        const barGap = 4;
        const barW = Math.max(8, (innerW - barGap * (sessions.length - 1)) / sessions.length);
        const baselineY = padding.top + innerH;
        const bars = sessions.map((s, i) => {
            const x = padding.left + i * (barW + barGap);
            const bh = (s.score / maxScore) * innerH;
            const y = padding.top + innerH - bh;
            return {
                id: s.id,
                x,
                y,
                w: barW,
                h: bh,
                score: s.score,
                label: formatShortDate(s.at, locale),
            };
        });
        return { w, h, padding, innerH, baselineY, bars, maxScore };
    }, [sessions, locale]);
    const lineMetrics = useMemo(() => {
        if (!sessions.length)
            return null;
        let cum = 0;
        const points = sessions.map((s) => {
            cum += s.score;
            return { cum, percent: s.percent };
        });
        const maxCum = Math.max(points[points.length - 1]?.cum ?? 1, 1);
        const padding = { top: 16, right: 12, bottom: 28, left: 40 };
        const w = 560;
        const h = 200;
        const innerW = w - padding.left - padding.right;
        const innerH = h - padding.top - padding.bottom;
        const baselineY = padding.top + innerH;
        const coords = points.map((p, i) => {
            const x = sessions.length === 1
                ? padding.left + innerW / 2
                : padding.left + (i / (sessions.length - 1)) * innerW;
            const y = padding.top + innerH - (p.cum / maxCum) * innerH;
            return { x, y, id: sessions[i].id };
        });
        let linePath = "";
        if (coords.length === 1) {
            const c = coords[0];
            linePath = `M ${c.x - 24},${c.y} L ${c.x + 24},${c.y}`;
        }
        else {
            linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`;
        }
        return {
            w,
            h,
            padding,
            innerH,
            baselineY,
            linePath,
            dots: coords,
            maxCum,
            lastPercent: points[points.length - 1]?.percent ?? 0,
        };
    }, [sessions]);
    if (!sessions.length) {
        return (<div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 backdrop-blur">
        <h3 className="text-base font-semibold text-zinc-100">{dictionary.sectionTitle}</h3>
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-4 py-6 text-center sm:flex-row sm:text-left">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-black">
            <Image src="/safe_click_dark_small.png" alt="" width={40} height={40} className="h-10 w-10 object-contain"/>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium tracking-tight text-zinc-100">{dictionary.emptyBrandLine}</p>
            <p className="mt-2 text-sm text-zinc-500">{dictionary.emptyHint}</p>
          </div>
        </div>
      </div>);
    }
    return (<div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="size-5 text-blue-400" aria-hidden/>
        <h3 className="text-base font-semibold text-zinc-100">{dictionary.sectionTitle}</h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4 backdrop-blur">
          <p className="mb-3 text-sm font-medium text-zinc-200">{dictionary.pointsChartTitle}</p>
          <p className="mb-2 text-xs text-zinc-500">{dictionary.pointsChartSubtitle}</p>
          {barMetrics ? (<svg viewBox={`0 0 ${barMetrics.w} ${barMetrics.h}`} className="max-h-[220px] h-auto w-full" role="img" aria-label={dictionary.pointsChartTitle}>
              <text x={barMetrics.padding.left - 6} y={barMetrics.padding.top + 4} fill="rgb(113 113 122)" fontSize={10} textAnchor="end">
                {barMetrics.maxScore}
              </text>
              <text x={barMetrics.padding.left - 6} y={barMetrics.baselineY} fill="rgb(113 113 122)" fontSize={10} textAnchor="end">
                0
              </text>
              <line x1={barMetrics.padding.left} y1={barMetrics.baselineY} x2={barMetrics.w - barMetrics.padding.right} y2={barMetrics.baselineY} stroke="rgb(63 63 70)" strokeWidth={1}/>
              {barMetrics.bars.map((b) => (<g key={b.id}>
                  <title>{`${b.label}: ${b.score}`}</title>
                  <rect x={b.x} y={b.y} width={b.w} height={Math.max(b.h, 1)} rx={3} fill="rgb(59 130 246 / 0.75)"/>
                  <text x={b.x + b.w / 2} y={barMetrics.baselineY + 16} fill="rgb(113 113 122)" fontSize={9} textAnchor="middle">
                    {b.label}
                  </text>
                </g>))}
            </svg>) : null}
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4 backdrop-blur">
          <p className="mb-3 text-sm font-medium text-zinc-200">{dictionary.progressChartTitle}</p>
          <p className="mb-2 text-xs text-zinc-500">{dictionary.progressChartSubtitle}</p>
          {lineMetrics ? (<svg viewBox={`0 0 ${lineMetrics.w} ${lineMetrics.h}`} className="max-h-[220px] h-auto w-full" role="img" aria-label={dictionary.progressChartTitle}>
              <text x={lineMetrics.padding.left - 8} y={lineMetrics.padding.top + 4} fill="rgb(113 113 122)" fontSize={10} textAnchor="end">
                {lineMetrics.maxCum}
              </text>
              <text x={lineMetrics.padding.left - 8} y={lineMetrics.baselineY} fill="rgb(113 113 122)" fontSize={10} textAnchor="end">
                0
              </text>
              <line x1={lineMetrics.padding.left} y1={lineMetrics.baselineY} x2={lineMetrics.w - lineMetrics.padding.right} y2={lineMetrics.baselineY} stroke="rgb(63 63 70)" strokeWidth={1}/>
              <path d={lineMetrics.linePath} fill="none" stroke="rgb(52 211 153 / 0.9)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
              {lineMetrics.dots.map((c) => (<circle key={c.id} cx={c.x} cy={c.y} r={4} fill="rgb(52 211 153)" opacity={0.95}/>))}
              <text x={lineMetrics.w - lineMetrics.padding.right} y={lineMetrics.padding.top + 12} fill="rgb(161 161 170)" fontSize={10} textAnchor="end">
                {dictionary.lastSessionAccuracy.replace("{{percent}}", String(lineMetrics.lastPercent))}
              </text>
            </svg>) : null}
        </div>
      </div>
    </div>);
}
