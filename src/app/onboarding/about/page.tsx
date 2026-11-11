"use client";

import Link from "next/link";
import { StepScreen } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { CatSays } from "@/components/cat/cat-says";
import { AgeStepper } from "@/components/onboarding/age-stepper";
import { buttonVariants } from "@/components/ui/button";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { sfx } from "@/lib/audio";
import { ageBand, catName, pronouns, type Home, type Sex } from "@/lib/profile";
import { actions, useCatz } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AboutStep() {
  const state = useCatz();
  if (!state) return <Splash />;
  const p = state.profile;
  const pr = pronouns(p.sex);
  const band = ageBand(p.age);
  const note =
    band === "kitten"
      ? "Kitten: super short rounds, with plenty of play in between."
      : band === "senior"
        ? "Senior: we skip jumps and keep every move low-impact."
        : `Adult: the full trick list is open to ${catName(p)}.`;

  return (
    <StepScreen
      footer={
        <Link href="/onboarding/traits" data-sfx="next" className={cn(buttonVariants(), "w-full")}>
          Continue
        </Link>
      }
    >
      <div>
        <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">About {catName(p)}</h1>
        <p className="mt-1 text-[0.95rem] leading-snug font-bold text-ink-2">This decides which tricks come first, and which to skip.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Age</Label>
        <AgeStepper value={p.age} onChange={(age) => actions.patchProfile({ age })} />
      </div>
      <CatSays look={p.look} key={band}>
        {note}
      </CatSays>

      <div className="flex flex-col gap-2">
        <Label>Sex</Label>
        <ChoiceGroup value={p.sex} onValueChange={(v) => actions.patchProfile({ sex: v as Sex })} className="grid-cols-2" aria-label="Sex">
          <Choice value="girl">Girl</Choice>
          <Choice value="boy">Boy</Choice>
        </ChoiceGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Where {pr.she} lives</Label>
        <ChoiceGroup value={p.home} onValueChange={(v) => actions.patchProfile({ home: v as Home })} className="grid-cols-2" aria-label="Where your cat lives">
          <Choice value="indoor">
            Indoors<small>Home only</small>
          </Choice>
          <Choice value="both">
            In and out<small>Goes outside</small>
          </Choice>
        </ChoiceGroup>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-line px-4 py-3">
        <label htmlFor="others" className="leading-tight">
          <b className="block text-[0.95rem] font-extrabold">Other cats at home</b>
          <small className="text-xs font-bold text-ink-2">We train each cat in a separate room</small>
        </label>
        <Switch
          id="others"
          checked={p.others}
          onCheckedChange={(others) => {
            actions.patchProfile({ others });
            sfx.toggle(others);
          }}
        />
      </div>
    </StepScreen>
  );
}
