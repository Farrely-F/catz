"use client";

import { Flame, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { catName } from "@/lib/profile";
import { actions, useCatz } from "@/lib/store";
import { dayKey, liveCount, streakCovers, weekKeys } from "@/lib/streak";
import { cn } from "@/lib/utils";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

async function shareWin(name: string, title: string) {
  const text = `${name} just learned: ${title}. Training with Catz.`;
  try {
    if (navigator.share) {
      await navigator.share({ title: "Catz", text });
      return;
    }
    await navigator.clipboard.writeText(text);
    toast("Win copied. Paste it anywhere.");
  } catch {
    /* share sheet dismissed */
  }
}

export default function JournalPage() {
  const state = useCatz();
  if (!state) return null;
  const p = state.profile;
  const today = dayKey();
  const streak = liveCount(state.streak, today);
  const freezes = state.streak.freezes;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="px-5 pt-4">
        <h1 className="font-display text-[1.7rem] font-extrabold">Journal</h1>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-3 pb-5">
        <div className="flex flex-col gap-2">
          <Label>
            This week
            <span className="flex items-center gap-1 font-display text-base font-extrabold tracking-normal text-ginger-dk normal-case">
              <Flame className="size-4 fill-current" /> {streak} day{streak === 1 ? "" : "s"}
            </span>
          </Label>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {weekKeys().map((k, i) => {
              const on = streak > 0 && streakCovers(state.streak, k);
              return (
                <div key={k} className="flex flex-col items-center gap-1.5 text-[11px] font-extrabold text-ink-2">
                  {DAYS[i]}
                  <i
                    aria-label={on ? "Trained" : k === today ? "Today" : "No session"}
                    className={cn(
                      "grid aspect-square w-full max-w-9 place-items-center rounded-full bg-surface-2 text-ink",
                      on && "bg-ginger shadow-[0_3px_0_var(--ginger-dk)]",
                      k === today && "outline-3 outline-offset-2 outline-ginger outline-dashed",
                    )}
                  >
                    {on && <Flame className="size-[18px] fill-current" />}
                  </i>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-mint-tint px-3.5 py-3 text-sm leading-snug font-extrabold">
          <ShieldCheck className="size-7 shrink-0" />
          <p>
            {freezes > 0
              ? `${freezes} streak freeze${freezes === 1 ? "" : "s"} ready. It covers one missed day. You earn one every 7 days.`
              : "No streak freeze right now. You earn one every 7 days."}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Label>Wins</Label>
          {state.wins.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line px-4 py-6 text-center">
              <CatAvatar look={p.look} head className="w-16" />
              <b className="font-display text-lg font-extrabold">Your first win goes here</b>
              <p className="text-sm font-bold text-ink-2">Finish a lesson and it is saved automatically. Add a note about how it went.</p>
            </div>
          ) : (
            state.wins.map((w) => (
              <article key={w.id} className="flex flex-col gap-2.5 rounded-2xl border-2 border-line p-3">
                <div className="grid grid-cols-[3.4rem_1fr_auto] items-center gap-3">
                  <span className="grid size-14 place-items-center rounded-2xl bg-ginger-tint">
                    <CatAvatar look={p.look} head className="w-12" />
                  </span>
                  <span className="leading-tight">
                    <b className="block text-[0.95rem] font-extrabold">{w.title}</b>
                    <small className="text-xs font-bold text-ink-2">
                      {new Date(w.day + "T12:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </small>
                  </span>
                  <Button variant="outline" size="icon" aria-label={`Share "${w.title}"`} onClick={() => shareWin(catName(p), w.title)}>
                    <Share2 />
                  </Button>
                </div>
                <Input
                  aria-label={`Note for ${w.title}`}
                  value={w.note}
                  maxLength={140}
                  placeholder="Add a note, like what worked"
                  className="h-10 rounded-xl text-sm font-bold"
                  onChange={(e) => actions.setWinNote(w.id, e.target.value)}
                />
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
