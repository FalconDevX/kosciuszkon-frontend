"use client";

import { useEffect, useMemo, useState } from "react";
import { clsx } from "clsx";

type Props = {
  className?: string;
  density?: "default" | "sparse";
};

const COUNT_DEFAULT = 10;
const COUNT_SPARSE = 5;

/** Unit vector UR → LL (45° to horizontal): left and down, same for every star. */
const INV_SQRT2 = 0.7071067811865476;

type ShootingStar = {
  id: number;
  startLeftPct: number;
  startTopPct: number;
  mag: number;
  tailPx: number;
  streakH: number;
  duration: number;
  delay: number;
};

export function FallingStarsBackground({ className, density = "default" }: Props) {
  const count = density === "sparse" ? COUNT_SPARSE : COUNT_DEFAULT;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const stars = useMemo((): ShootingStar[] => {
    if (!ready) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startLeftPct: -12 + Math.random() * 124,
      startTopPct: -12 + Math.random() * 124,
      mag: 72 + Math.random() * 56,
      tailPx: 96 + Math.random() * 140,
      streakH: 1.4 + Math.random() * 1.2,
      duration: 3.2 + Math.random() * 3.8,
      delay: -(Math.random() * 48),
    }));
  }, [ready, count]);

  return (
    <div
      className={clsx(
        "shooting-star-layer pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {stars.map((s) => {
        const dx = `${-INV_SQRT2 * s.mag}vw`;
        const dy = `${INV_SQRT2 * s.mag}vh`;
        return (
          <div
            key={s.id}
            className="shooting-star"
            style={{
              left: `${s.startLeftPct}%`,
              top: `${s.startTopPct}%`,
              ["--dx" as string]: dx,
              ["--dy" as string]: dy,
              ["--tail" as string]: `${s.tailPx}px`,
              ["--streak-h" as string]: `${s.streakH}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
            }}
          >
            <div className="shooting-star__rotate">
              <div className="shooting-star__streak" />
              <div className="shooting-star__head" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
