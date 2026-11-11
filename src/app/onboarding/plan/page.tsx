"use client";

import { useRouter } from "next/navigation";
import { Clock, Heart, Sparkles, Star, Target, Zap, PawPrint, type LucideIcon } from "lucide-react";
import { StepScreen } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { CatMascot } from "@/components/cat/cat-mascot";
import { Button } from "@/components/ui/button";
import { buildPlan } from "@/lib/plan";
import { catName } from "@/lib/profile";
import { actions, useCatz } from "@/lib/store";

type Row = { label: string; value: string; Icon: LucideIcon; tint: string };

export default function PlanStep() {
  const state = useCatz();
  const router = useRouter();
  if (!state) return <Splash />;
  const p = state.profile;
  const plan = buildPlan(p);

  const rows: Row[] = [
    { label: "Start with", value: plan.start, Icon: Target, tint: "bg-ginger-tint" },
    { label: "Pace", value: plan.pace, Icon: Zap, tint: "bg-mint-tint" },
    { label: "Daily", value: plan.rounds, Icon: Clock, tint: "bg-sky-tint" },
    { label: "Tricks", value: plan.tricks, Icon: Star, tint: "bg-sun-tint" },
    { label: "Treat", value: `${p.treat} in pea-sized pieces`, Icon: Heart, tint: "bg-rose-tint" },
    ...(plan.notes.length ? [{ label: "Also", value: plan.notes.join(". "), Icon: PawPrint, tint: "bg-surface-2" }] : []),
  ];

  const start = () => {
    actions.completeOnboarding();
    router.push("/app/path");
  };

  return (
    <StepScreen
      footer={
        <Button variant="mint" className="w-full" data-sfx="next" onClick={start}>
          <Sparkles /> Start training
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-2 pt-2 text-center">
        <CatMascot look={p.look} mood="happy" className="w-44" label={`${catName(p)}, happy`} />
        <h1 className="font-display text-[1.7rem] leading-tight font-extrabold text-balance">{catName(p)}&apos;s plan is ready</h1>
      </div>

      <ul className="flex flex-col gap-2.5">
        {rows.map(({ label, value, Icon, tint }, i) => (
          <li
            key={label}
            style={{ animationDelay: `${i * 80}ms` }}
            className="grid animate-fade-up grid-cols-[2.6rem_1fr] items-center gap-3 rounded-2xl border-2 border-line px-3 py-2.5"
          >
            <span className={`grid size-10 place-items-center rounded-xl ${tint}`}>
              <Icon className="size-5" />
            </span>
            <span className="leading-tight">
              <small className="block text-[11px] font-extrabold tracking-widest text-ink-2 uppercase">{label}</small>
              <b className="text-[0.95rem] font-extrabold">{value}</b>
            </span>
          </li>
        ))}
      </ul>
    </StepScreen>
  );
}
