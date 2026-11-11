"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { StepScreen } from "@/components/app/app-frame";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { Confetti } from "@/components/lesson/confetti";
import { buttonVariants } from "@/components/ui/button";
import { sfx } from "@/lib/audio";
import { lessonById } from "@/lib/curriculum";
import { fill } from "@/lib/plan";
import type { State } from "@/lib/progress";
import { useCatz } from "@/lib/store";
import { dayKey, liveCount } from "@/lib/streak";
import { cn } from "@/lib/utils";

function useCountUp(to: number, ms = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : ms;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, ms]);
  return n;
}

function WinScreen({ state }: { state: State }) {
  const last = state.last!;
  const p = state.profile;
  const lesson = lessonById(last.lessonId);
  const xp = useCountUp(last.xpGain);
  const streak = liveCount(state.streak, dayKey());
  const name = p.name.trim() || "Your cat";

  useEffect(() => {
    sfx.win();
    const timers = Array.from({ length: 9 }, (_, i) => setTimeout(() => sfx.tickUp(i), 200 + i * 90));
    return () => timers.forEach(clearTimeout);
  }, []);

  const title = last.rest ? "Rest day counts" : `${lesson ? fill(lesson.title, p) : "Lesson"} done`;
  const sub = last.rest
    ? `Stopping when ${name} isn't into it is good training. Your streak is safe.`
    : `${name} nailed ${last.reps} clicks. Keep going, a little every day.`;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <Confetti />
      <StepScreen
        footer={
          <Link href="/app/path" data-sfx="next" className={cn(buttonVariants(), "w-full")}>
            Continue
          </Link>
        }
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <CatAvatar look={p.look} mood="happy" className="w-44 animate-[hop_0.6s_var(--ease-out-soft)]" label={`${name}, celebrating`} />
          <div>
            <h1 className="font-display text-[1.7rem] leading-tight font-extrabold text-balance">{title}</h1>
            <p className="mt-1.5 text-[0.95rem] leading-snug font-bold text-ink-2">{sub}</p>
          </div>

          <div className="flex w-full gap-2.5">
            <div className="flex-1 overflow-hidden rounded-2xl border-2 border-line pb-2">
              <small className="mb-2 block bg-sky py-1 text-[11px] font-extrabold tracking-widest text-ink uppercase">XP earned</small>
              <b className="font-display text-3xl font-extrabold tabular-nums">+{xp}</b>
            </div>
            <div className="flex-1 overflow-hidden rounded-2xl border-2 border-line pb-2">
              <small className="mb-2 block bg-ginger py-1 text-[11px] font-extrabold tracking-widest text-ink uppercase">Day streak</small>
              <b className="inline-flex items-center gap-1.5 font-display text-3xl font-extrabold text-ginger-dk tabular-nums">
                <Flame className="size-7 fill-current" /> {streak}
              </b>
            </div>
          </div>

          {!last.rest && (
            <div className="grid w-full animate-card-in grid-cols-[4rem_1fr] items-center gap-3 rounded-2xl border-2 border-sun bg-sun-tint p-3 text-left">
              <span className="grid size-16 place-items-center rounded-2xl bg-background">
                <CatAvatar look={p.look} head className="w-14" />
              </span>
              <span className="leading-tight">
                <small className="text-[11px] font-extrabold tracking-widest text-ink-2 uppercase">Win card</small>
                <b className="block font-display text-lg font-extrabold">{last.win}</b>
                <small className="text-xs font-bold text-ink-2">{new Date(last.day + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}</small>
              </span>
            </div>
          )}
        </div>
      </StepScreen>
    </div>
  );
}

export default function WinPage() {
  const state = useCatz();
  const router = useRouter();
  const hasLast = state ? state.last !== null : undefined;

  useEffect(() => {
    if (hasLast === false) router.replace("/app/path");
  }, [hasLast, router]);

  if (!state || !state.last) return null;
  return <WinScreen state={state} />;
}
