"use client";

import { Flame, Zap } from "lucide-react";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { level } from "@/lib/progress";
import type { State } from "@/lib/progress";
import { dayKey, liveCount } from "@/lib/streak";
import { cn } from "@/lib/utils";

const pill = "flex items-center gap-1.5 rounded-xl bg-surface px-2.5 py-1 font-display text-lg leading-none font-extrabold";

export function StatsBar({ state }: { state: State }) {
  const streak = liveCount(state.streak, dayKey());
  return (
    <header className="flex items-center gap-2 border-b-2 border-line px-4 pt-3.5 pb-2.5">
      <div className={cn(pill, streak > 0 ? "text-ginger-dk" : "text-ink-2")} title="Day streak">
        <Flame className="size-5 fill-current" />
        <b key={streak} className="animate-bump">{streak}</b>
      </div>
      <div className={cn(pill, "text-sky-dk")} title="XP">
        <Zap className="size-5 fill-current" />
        <b key={state.xp} className="animate-bump">{state.xp}</b>
      </div>
      <div className={pill}>
        Lv <b>{level(state.xp)}</b>
      </div>
      <CatAvatar look={state.profile.look} head className="ml-auto w-11" />
    </header>
  );
}
