"use client";

import Link from "next/link";
import { StepScreen } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { buttonVariants } from "@/components/ui/button";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Label } from "@/components/ui/label";
import type { Minutes, When } from "@/lib/profile";
import { actions, useCatz } from "@/lib/store";
import { cn } from "@/lib/utils";

const TIMES: { v: Minutes; title: string; sub: string; best?: boolean }[] = [
  { v: 5, title: "Quick wins", sub: "2 rounds of 2 to 3 minutes" },
  { v: 10, title: "Sweet spot", sub: "2 rounds of 5 minutes", best: true },
  { v: 15, title: "Going pro", sub: "3 rounds of 5 minutes" },
];

export default function TimeStep() {
  const state = useCatz();
  if (!state) return <Splash />;
  const p = state.profile;

  return (
    <StepScreen
      footer={
        <Link href="/onboarding/plan" data-sfx="next" className={cn(buttonVariants(), "w-full")}>
          Build my plan
        </Link>
      }
    >
      <div>
        <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">How much time can you give?</h1>
        <p className="mt-1 text-[0.95rem] leading-snug font-bold text-ink-2">Cats tune out after about five minutes, so we split it into short rounds.</p>
      </div>

      <ChoiceGroup value={String(p.minutes)} onValueChange={(v) => actions.patchProfile({ minutes: Number(v) as Minutes })} className="grid-cols-1" aria-label="Minutes per day">
        {TIMES.map((t) => (
          <Choice key={t.v} value={String(t.v)} className="min-h-0 flex-row justify-start gap-4 px-4 py-3 text-left">
            <span className="w-14 text-center font-display text-4xl leading-none font-extrabold">
              {t.v}
              <small className="mt-0.5 block text-[11px] font-extrabold tracking-widest uppercase">min</small>
            </span>
            <span className="flex flex-col leading-tight">
              <b className="text-base font-extrabold">
                {t.title}
                {t.best && <span className="ml-1.5 rounded-full bg-mint px-2 py-0.5 align-middle text-[10px] font-extrabold tracking-wider text-ink uppercase">Best</span>}
              </b>
              <small className="mt-0.5">{t.sub}</small>
            </span>
          </Choice>
        ))}
      </ChoiceGroup>

      <div className="flex flex-col gap-2">
        <Label>Best time of day</Label>
        <ChoiceGroup value={p.when} onValueChange={(v) => actions.patchProfile({ when: v as When })} className="grid-cols-3" aria-label="Best time of day">
          <Choice value="morning">Morning</Choice>
          <Choice value="dinner">
            Before dinner<small>Hungry cats focus</small>
          </Choice>
          <Choice value="evening">Evening</Choice>
        </ChoiceGroup>
      </div>
    </StepScreen>
  );
}
