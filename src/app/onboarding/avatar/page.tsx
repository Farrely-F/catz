"use client";

import Link from "next/link";
import { StepScreen } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { CatMascot } from "@/components/cat/cat-mascot";
import { buttonVariants } from "@/components/ui/button";
import { Choice, ChoiceGroup, Swatch } from "@/components/ui/choice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COATS, EYES, PATTERNS, type CatLook, type CatPattern, type EyeColor, type Fur } from "@/lib/cat";
import { actions, useCatz } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function AvatarStep() {
  const state = useCatz();
  if (!state) return <Splash />;
  const { name, look } = state.profile;
  const setLook = (patch: Partial<CatLook>) => actions.patchLook(patch);

  return (
    <StepScreen
      footer={
        <Link href="/onboarding/about" data-sfx="next" className={cn(buttonVariants(), "w-full")}>
          Continue
        </Link>
      }
    >
      <div className="sticky top-0 z-10 -mx-5 -mt-4 flex justify-center bg-background pt-3 pb-1">
        <div key={JSON.stringify(look)} className="animate-pop">
          <CatMascot look={look} className="w-40" label={`${name || "Your cat"}, tap to say hi`} />
        </div>
      </div>

      <div>
        <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">Build your cat</h1>
        <p className="mt-1 text-[0.95rem] leading-snug font-bold text-ink-2">Make it look like yours. It becomes your training buddy.</p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="cat-name">Name</Label>
        <Input
          id="cat-name"
          value={name}
          maxLength={14}
          autoComplete="off"
          placeholder="Your cat's name"
          onChange={(e) => actions.patchProfile({ name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Pattern</Label>
        <ChoiceGroup value={look.pattern} onValueChange={(v) => setLook({ pattern: v as CatPattern })} className="grid-cols-5 gap-2" aria-label="Pattern">
          {PATTERNS.map((p) => (
            <Choice key={p.id} value={p.id} className="min-h-0 gap-0 rounded-2xl p-1.5" >
              <CatAvatar look={{ ...look, pattern: p.id }} head className="w-full" />
              <span className="text-[11px] font-extrabold">{p.name}</span>
            </Choice>
          ))}
        </ChoiceGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Coat</Label>
        <ChoiceGroup value={look.coat} onValueChange={(v) => setLook({ coat: v })} className="flex flex-wrap gap-3" aria-label="Coat color">
          {COATS.map((c) => (
            <Swatch key={c.id} value={c.hex} color={c.hex} label={c.name} />
          ))}
        </ChoiceGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Eyes</Label>
        <ChoiceGroup value={look.eyes} onValueChange={(v) => setLook({ eyes: v as EyeColor })} className="flex flex-wrap gap-3" aria-label="Eye color">
          {(Object.keys(EYES) as EyeColor[]).map((k) => (
            <Swatch key={k} value={k} color={EYES[k].hex} label={`${EYES[k].name} eyes`} />
          ))}
        </ChoiceGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Fur</Label>
        <ChoiceGroup value={look.fur} onValueChange={(v) => setLook({ fur: v as Fur })} className="grid-cols-2" aria-label="Fur length">
          <Choice value="short">Short</Choice>
          <Choice value="fluffy">Fluffy</Choice>
        </ChoiceGroup>
      </div>
    </StepScreen>
  );
}
