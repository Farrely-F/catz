"use client";

import Link from "next/link";
import { StepScreen } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { CatMascot } from "@/components/cat/cat-mascot";
import { TraitSlider } from "@/components/onboarding/trait-slider";
import { buttonVariants } from "@/components/ui/button";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Label } from "@/components/ui/label";
import { TREATS, affectionWord, catName, confidenceWord, energyWord, type Food } from "@/lib/profile";
import { actions, useCatz } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TraitsStep() {
  const state = useCatz();
  if (!state) return <Splash />;
  const p = state.profile;

  return (
    <StepScreen
      footer={
        <Link href="/onboarding/time" data-sfx="next" className={cn(buttonVariants(), "w-full")}>
          Continue
        </Link>
      }
    >
      <div className="flex items-center gap-4">
        <CatMascot look={p.look} className="w-24 shrink-0" label={catName(p)} />
        <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">What&apos;s {catName(p)} like?</h1>
      </div>

      <TraitSlider label="Confidence" word={confidenceWord(p.conf)} value={p.conf} left="Shy" right="Bold" onChange={(conf) => actions.patchProfile({ conf })} />
      <TraitSlider label="Energy" word={energyWord(p.energy)} value={p.energy} left="Couch potato" right="Zoomies" onChange={(energy) => actions.patchProfile({ energy })} />
      <TraitSlider label="Affection" word={affectionWord(p.aff)} value={p.aff} left="Independent" right="Cuddly" onChange={(aff) => actions.patchProfile({ aff })} />

      <div className="flex flex-col gap-2">
        <Label>Food motivation</Label>
        <ChoiceGroup value={p.food} onValueChange={(v) => actions.patchProfile({ food: v as Food })} className="grid-cols-3" aria-label="Food motivation">
          <Choice value="hunter">Treat hunter</Choice>
          <Choice value="picky">Picky</Choice>
          <Choice value="unsure">Not sure</Choice>
        </ChoiceGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Favorite treat</Label>
        <ChoiceGroup value={p.treat} onValueChange={(treat) => actions.patchProfile({ treat })} className="grid-cols-2" aria-label="Favorite treat">
          {TREATS.map((t) => (
            <Choice key={t} value={t}>
              {t}
            </Choice>
          ))}
        </ChoiceGroup>
      </div>
    </StepScreen>
  );
}
