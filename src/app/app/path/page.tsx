"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Lock, MessageSquare, PawPrint, Star, Target, Heart, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { CatMascot } from "@/components/cat/cat-mascot";
import { StatsBar } from "@/components/path/stats-bar";
import { sfx } from "@/lib/audio";
import { UNITS, lessonById, type Lesson, type LessonIcon } from "@/lib/curriculum";
import { buildPlan, fill } from "@/lib/plan";
import { todayOf } from "@/lib/progress";
import { useCatz } from "@/lib/store";
import { dayKey } from "@/lib/streak";
import { cn } from "@/lib/utils";

const ICONS: Record<LessonIcon, LucideIcon> = { click: Target, target: Target, chat: MessageSquare, paw: PawPrint, star: Star, heart: Heart };
const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];

export default function PathPage() {
  const state = useCatz();
  const router = useRouter();
  const [shake, setShake] = useState<string | null>(null);
  if (!state) return null;

  const plan = buildPlan(state.profile);
  const lessons = plan.lessonIds.map((id) => lessonById(id)).filter((l): l is Lesson => !!l);
  const currentId = lessons.find((l) => !state.done.includes(l.id))?.id;
  const today = todayOf(state, dayKey());

  const open = (l: Lesson, status: "done" | "cur" | "lock") => {
    if (status === "lock") {
      sfx.error();
      setShake(l.id);
      const next = lessonById(currentId ?? "");
      toast(next ? `Finish "${next.title}" first` : "Locked");
      return;
    }
    sfx.next();
    router.push(`/app/lesson/${l.id}`);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <StatsBar state={state} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6">
        <div className="flex items-center gap-2.5 pt-3 pb-1.5 text-[13px] font-extrabold text-ink-2">
          Today
          <span className="flex gap-1.5" aria-hidden>
            {Array.from({ length: plan.roundsPerDay }, (_, i) => (
              <i key={i} className={cn("h-3 w-8 rounded-full bg-surface-2 transition-colors duration-300", i < today.rounds && "bg-mint")} />
            ))}
          </span>
          {Math.min(today.rounds, plan.roundsPerDay)} of {plan.roundsPerDay} rounds
        </div>

        {UNITS.map((unit) => {
          const items = lessons.filter((l) => l.unit === unit.id);
          if (!items.length) return null;
          return (
            <section key={unit.id}>
              <div
                className={cn(
                  "sticky top-0 z-10 mt-1.5 mb-2 flex items-center justify-between rounded-2xl px-4 pt-3 pb-3.5 text-ink shadow-[0_5px_0_var(--btn-dk)]",
                  unit.id === "foundations" ? "bg-mint [--btn-dk:var(--mint-dk)]" : "bg-sky [--btn-dk:var(--sky-dk)]",
                )}
              >
                <div className="leading-tight">
                  <small className="block text-[11px] font-extrabold tracking-widest uppercase opacity-70">Unit {UNITS.findIndex((u) => u.id === unit.id) + 1}</small>
                  <b className="font-display text-xl font-extrabold">{unit.title}</b>
                </div>
              </div>

              <ol className="flex flex-col items-center gap-7 pt-5 pb-3">
                {items.map((l, i) => {
                  const status = state.done.includes(l.id) ? "done" : l.id === currentId ? "cur" : "lock";
                  const x = OFFSETS[i % OFFSETS.length];
                  const Icon = status === "done" ? Check : status === "lock" ? Lock : ICONS[l.icon];
                  return (
                    <li key={l.id} style={{ transform: `translateX(${x}px)` }} className="relative mb-8">
                      {status === "cur" && (
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 animate-bob rounded-xl border-2 border-line bg-background px-2.5 py-0.5 font-display text-[13px] font-extrabold tracking-wider text-ginger-dk">
                          START
                        </span>
                      )}
                      {status === "cur" && (
                        <CatMascot
                          look={state.profile.look}
                          className={cn("absolute top-1 w-[70px]", x >= 40 ? "right-24" : "left-24")}
                          label="Your cat"
                        />
                      )}
                      <button
                        type="button"
                        data-no-sfx
                        aria-label={`${fill(l.title, state.profile)}, ${status === "done" ? "done, replay" : status === "cur" ? "next up" : "locked"}`}
                        onClick={() => open(l, status)}
                        onAnimationEnd={() => setShake(null)}
                        className={cn(
                          "relative grid h-[72px] w-[78px] place-items-center rounded-full text-ink transition-[transform,box-shadow] duration-100 active:translate-y-[7px] active:shadow-none",
                          status === "done" && "bg-mint shadow-[0_7px_0_var(--mint-dk)]",
                          status === "cur" && "bg-ginger shadow-[0_7px_0_var(--ginger-dk)]",
                          status === "lock" && "bg-surface-2 text-ink-2 shadow-[0_7px_0_var(--line)]",
                          shake === l.id && "animate-shake",
                        )}
                      >
                        {status === "cur" && <span aria-hidden className="absolute -inset-x-2 -top-2 -bottom-0.5 animate-ring rounded-full border-[5px] border-ginger" />}
                        <Icon className="size-8" />
                      </button>
                      <span className="absolute top-[84px] left-1/2 -translate-x-1/2 text-xs font-extrabold whitespace-nowrap text-ink-2">{l.title}</span>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}

        {!currentId && (
          <p className="mt-2 rounded-2xl bg-mint-tint px-4 py-3 text-center text-sm font-extrabold">
            All caught up. More lessons are on the way. Replay any lesson, or practice with the clicker.
          </p>
        )}
      </div>
    </div>
  );
}
