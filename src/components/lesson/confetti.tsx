"use client";

const COLORS = ["#FF8A1F", "#2DCB8C", "#3DB7FF", "#FFC933", "#FF5E8C"];

/** Falling confetti. Deterministic spread (no Math.random), skipped for reduced motion via CSS. */
export function Confetti({ count = 42 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: (i * 37.7) % 100,
    color: COLORS[i % COLORS.length],
    d: 1.6 + ((i * 7) % 14) / 10,
    delay: ((i * 3) % 5) / 10,
    r: ((i * 97) % 720) - 360,
    round: i % 3 === 0,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden motion-reduce:hidden" aria-hidden>
      {pieces.map((c, i) => (
        <i
          key={i}
          style={{ left: `${c.left}%`, background: c.color, ["--r" as string]: `${c.r}deg`, animation: `fall ${c.d}s ${c.delay}s ease-in forwards` }}
          className={c.round ? "absolute -top-4 size-2.5 rounded-full" : "absolute -top-4 h-3.5 w-2.5 rounded-[3px]"}
        />
      ))}
    </div>
  );
}
