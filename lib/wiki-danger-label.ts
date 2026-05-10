import type { Dictionary } from "@/i18n/types";
import type { DangerLevel } from "@/types/wiki";

export function wikiDangerLabel(level: DangerLevel, wiki: Dictionary["wiki"]): string {
  const labels = {
    Low: wiki.dangerLow,
    Medium: wiki.dangerMedium,
    High: wiki.dangerHigh,
    Critical: wiki.dangerCritical,
  } satisfies Record<DangerLevel, string>;
  return labels[level];
}
