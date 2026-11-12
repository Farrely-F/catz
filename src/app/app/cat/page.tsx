"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { InstallCard } from "@/components/app/install-card";
import { CatMascot } from "@/components/cat/cat-mascot";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { buildPlan } from "@/lib/plan";
import { WHEN_LABEL, affectionWord, ageBand, catName, confidenceWord, energyWord } from "@/lib/profile";
import { actions, useCatz } from "@/lib/store";

export default function CatPage() {
  const state = useCatz();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  if (!state) return null;
  const p = state.profile;
  const plan = buildPlan(p);

  const facts: [string, string][] = [
    ["Age", `${p.age < 1 ? "<1" : p.age} ${p.age === 1 ? "year" : "years"} (${ageBand(p.age)})`],
    ["Sex", p.sex === "girl" ? "Girl" : "Boy"],
    ["Lives", p.home === "indoor" ? "Indoors" : "In and out"],
    ["Daily time", `${p.minutes} min ${WHEN_LABEL[p.when]}`],
    ["Favorite treat", p.treat],
    ["Other cats", p.others ? "Yes" : "No"],
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="px-5 pt-4">
        <h1 className="font-display text-[1.7rem] font-extrabold">My cat</h1>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-3 pb-5">
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-ginger-tint px-4 pt-4 pb-4 text-center">
          <CatMascot look={p.look} className="w-36" label={`${catName(p)}, tap to say hi`} />
          <h2 className="font-display text-2xl font-extrabold">{catName(p)}</h2>
          <div className="flex flex-wrap justify-center gap-1.5">
            {[confidenceWord(p.conf), energyWord(p.energy), affectionWord(p.aff)].map((t) => (
              <span key={t} className="rounded-full border-2 border-line bg-background px-2.5 py-0.5 text-xs font-extrabold">
                {t}
              </span>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-2.5">
          {facts.map(([k, v]) => (
            <div key={k} className="rounded-2xl border-2 border-line px-3 py-2">
              <dt className="text-[11px] font-extrabold tracking-widest text-ink-2 uppercase">{k}</dt>
              <dd className="text-[0.95rem] leading-tight font-extrabold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-2">
          <Label>Your plan</Label>
          <ul className="flex flex-col gap-1.5 rounded-2xl bg-surface px-4 py-3 text-sm leading-snug font-bold">
            <li><b className="font-extrabold">Pace:</b> {plan.pace}</li>
            <li><b className="font-extrabold">Daily:</b> {plan.rounds}</li>
            <li><b className="font-extrabold">Tricks:</b> {plan.tricks}</li>
            {plan.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>

        <InstallCard />

        <Link href="/onboarding/avatar" data-sfx="next" className={buttonVariants({ variant: "outline", className: "w-full" })}>
          Edit cat and plan
        </Link>

        <div className="mt-2 flex flex-col gap-2 border-t-2 border-line pt-4">
          <Button
            variant={confirm ? "rose" : "ghost"}
            className="w-full normal-case"
            onClick={() => {
              if (!confirm) {
                setConfirm(true);
                return;
              }
              actions.reset();
              router.replace("/onboarding/avatar");
            }}
          >
            {confirm ? "Tap again to erase everything" : "Reset all data"}
          </Button>
          <p className="text-center text-xs font-bold text-ink-2">Everything is stored on this device only.</p>
        </div>
      </div>
    </div>
  );
}
