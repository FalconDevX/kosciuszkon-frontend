"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";

type Props = {
  className?: string;
  density?: "default" | "sparse";
};

const COUNT_DEFAULT = 72;
const COUNT_SPARSE = 34;

type Orb = {
  id: number;
  leftPct: number;
  topPct: number;
  sizePx: number;
  duration: number;
  delay: number;
  variant: "a" | "b";
};

export function FallingStarsBackground({ className, density = "default" }: Props) {
  const count = density === "sparse" ? COUNT_SPARSE : COUNT_DEFAULT;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const orbs = useMemo((): Orb[] => {
    if (!ready) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      leftPct: -5 + Math.random() * 110,
      topPct: -5 + Math.random() * 110,
      sizePx: 1.4 + Math.random() * 4.2,
      duration: 3.8 + Math.random() * 5.2,
      delay: -(Math.random() * 40),
      variant: i % 2 === 0 ? "a" : "b",
    }));
  }, [ready, count]);

  return (
    <div
      className={clsx(
        "sparkle-orb-layer pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {orbs.map((o) => (
        <span
          key={o.id}
          className={clsx("sparkle-orb", o.variant === "a" ? "sparkle-orb--a" : "sparkle-orb--b")}
          style={{
            left: `${o.leftPct}%`,
            top: `${o.topPct}%`,
            width: `${o.sizePx}px`,
            height: `${o.sizePx}px`,
            marginLeft: `${-o.sizePx / 2}px`,
            marginTop: `${-o.sizePx / 2}px`,
            animationDuration: `${o.duration}s`,
            animationDelay: `${o.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
