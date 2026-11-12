"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, Star, Target, X } from "lucide-react";
import { toast } from "sonner";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { CatMascot } from "@/components/cat/cat-mascot";
import { ClickerButton } from "@/components/clicker/clicker-button";
import { StepScreen } from "@/components/app/app-frame";
import { Splash } from "@/components/app/splash";
import { Button, buttonVariants } from "@/components/ui/button";
import { Choice, ChoiceGroup } from "@/components/ui/choice";
import { Toggle } from "@/components/ui/toggle";
import { configureAudio, sfx } from "@/lib/audio";
import { lessonById } from "@/lib/curriculum";
import { buildPlan, fill } from "@/lib/plan";
import type { Mood } from "@/lib/progress";
import { actions, useCatz } from "@/lib/store";
import { cn } from "@/lib/utils";

type Treat = { id: number; tx: number };

export function LessonRunner({ id }: { id: string }) {
  const state = useCatz();
  const router = useRouter();
  const lesson = lessonById(id);

  const [step, setStep] = useState(0);
  const [reps, setReps] = useState(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [happy, setHappy] = useState(false);
  const [treats, setTreats] = useState<Treat[]>([]);
  const seq = useRef(0);
  const happyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Focus mode: only the clicker may make sound while the cat is being clicked.
  useEffect(() => {
    configureAudio({ training: step === 1 });
    return () => configureAudio({ training: false });
  }, [step]);
  useEffect(() => () => clearTimeout(happyTimer.current), []);

  if (!state || !lesson) return <Splash />;
  const p = state.profile;
  const plan = buildPlan(p);
  const goal = plan.goalReps;
  const replay = state.done.includes(lesson.id);
  const tip = fill(lesson.tips[Math.min(reps, lesson.tips.length - 1)], p);
  const focusNote = state.prefs.focus && state.prefs.ui;

  const click = () => {
    if (reps >= goal) return false;
    const n = reps + 1;
    setReps(n);
    setTreats((t) => [...t, { id: ++seq.current, tx: Math.round(Math.random() * 50 - 25) }]);
    setHappy(true);
    clearTimeout(happyTimer.current);
    happyTimer.current = setTimeout(() => setHappy(false), 650);
    sfx.rep(n - 1);
    setTimeout(sfx.crunch, 520);
    if (n >= goal) {
      setTimeout(sfx.success, 700);
      toast("Great timing!");
    }
  };

  const finish = () => {
    if (!mood) return;
    actions.finishLesson({ lessonId: lesson.id, mood, win: fill(lesson.win, p), reps });
    router.push("/app/win");
  };

  const next = () => {
    if (step === 0) {
      sfx.next();
      setStep(1);
    } else if (step === 1) {
      sfx.next();
      setStep(2);
    } else finish();
  };

  const label = step === 0 ? "I'm ready" : step === 1 ? (reps >= goal ? "Nice! Continue" : `${reps} of ${goal} clicks`) : "Finish";
  const disabled = (step === 1 && reps < goal) || (step === 2 && !mood);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center gap-3 px-5 pt-4">
        <Link href="/app/path" aria-label="Close lesson" data-sfx="back" className={buttonVariants({ variant: "outline", size: "icon" })}>
          <X />
        </Link>
        <div className="flex flex-1 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1} aria-label="Lesson progress">
          {[0, 1, 2].map((i) => (
            <i key={i} className={cn("h-3.5 flex-1 rounded-full bg-surface-2 transition-colors duration-300", i <= step && "bg-mint")} />
          ))}
        </div>
      </header>

      <StepScreen
        footer={
          <Button
            variant="mint"
            className={cn("w-full", step === 1 && reps >= goal && "animate-pop")}
            disabled={disabled}
            data-no-sfx={step < 2 ? "" : undefined}
            onClick={next}
          >
            {label}
          </Button>
        }
      >
        <div key={step} className="flex animate-fade-up flex-col gap-4">
          {step === 0 && (
            <>
              <div className="flex justify-center">
                <CatMascot look={p.look} className="w-32" label={p.name} />
              </div>
              <div>
                <p className="mb-1 text-xs font-extrabold tracking-widest text-ginger-dk uppercase">{replay ? "Replay" : "Lesson"}</p>
                <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">{lesson.title}</h1>
                <p className="mt-1 text-[0.95rem] leading-snug font-bold text-ink-2">{fill(lesson.blurb, p)}</p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {lesson.setup.map((item) => (
                  <li key={item}>
                    <Toggle
                      onPressedChange={(v) => v && sfx.check()}
                      className="w-full justify-start gap-3 px-3.5 py-3 text-left text-[0.95rem] whitespace-normal"
                      data-no-sfx
                    >
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg border-[3px] border-line text-transparent transition-all duration-200 ease-spring group-aria-pressed/toggle:-rotate-6 group-aria-pressed/toggle:scale-110 group-aria-pressed/toggle:border-mint-dk group-aria-pressed/toggle:bg-mint group-aria-pressed/toggle:text-ink">
                        <Check className="size-4" />
                      </span>
                      {item}
                    </Toggle>
                  </li>
                ))}
              </ul>
            </>
          )}

          {step === 1 && (
            <>
              <div className="relative rounded-2xl border-2 border-line px-3.5 py-3 text-[0.95rem] leading-snug font-extrabold after:absolute after:-bottom-[9px] after:left-1/2 after:size-3.5 after:-translate-x-1/2 after:rotate-45 after:border-r-2 after:border-b-2 after:border-line after:bg-background" aria-live="polite">
                {tip}
              </div>
              <div className="relative flex min-h-32 justify-center">
                <span className={cn("inline-block w-32", happy && "cat-twitch")}>
                  <CatAvatar look={p.look} mood={happy ? "happy" : "idle"} label={p.name} />
                </span>
                <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
                  {treats.map((t) => (
                    <span
                      key={t.id}
                      onAnimationEnd={() => setTreats((all) => all.filter((x) => x.id !== t.id))}
                      style={{ "--tx": `${t.tx}px` } as React.CSSProperties}
                      className="absolute bottom-[-120px] left-1/2 -ml-[13px] size-[26px] animate-fly-up"
                    >
                      <svg viewBox="0 0 24 24" className="size-full">
                        <path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z" fill="#3DB7FF" stroke="#1790DB" strokeWidth="1.5" strokeLinejoin="round" />
                        <circle cx="8" cy="11" r="1.2" fill="#1B2140" />
                      </svg>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2" role="img" aria-label={`${reps} of ${goal} clicks`}>
                {Array.from({ length: goal }, (_, i) => (
                  <i key={i} className={cn("size-[22px] rounded-full bg-surface-2 transition-colors", i < reps && "animate-pop bg-sky")} />
                ))}
              </div>
              <div className="flex flex-col items-center gap-2">
                <ClickerButton onClick={click} />
                {focusNote && <p className="text-xs font-extrabold text-ink-2">Focus mode: only the clicker makes sound</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h1 className="font-display text-[1.7rem] leading-tight font-extrabold">How did it go?</h1>
                <p className="mt-1 text-[0.95rem] leading-snug font-bold text-ink-2">Any answer is fine. Your streak is safe either way.</p>
              </div>
              <ChoiceGroup
                value={mood ?? ""}
                onValueChange={(v) => {
                  setMood(v as Mood);
                  if (v === "rest") toast("No problem. Streak protected.");
                }}
                className="grid-cols-1"
                aria-label="How did it go"
              >
                <Choice value="nailed" className="flex-row justify-start gap-3 px-3.5 py-3 text-left">
                  <Star className="size-6 fill-sun text-sun-dk" />
                  <span className="flex flex-col"><b>Nailed it</b><small>Got it right away</small></span>
                </Choice>
                <Choice value="close" className="flex-row justify-start gap-3 px-3.5 py-3 text-left">
                  <Target className="size-6 text-sky-dk" />
                  <span className="flex flex-col"><b>Getting there</b><small>A few sniffs, a few touches</small></span>
                </Choice>
                <Choice value="rest" className="flex-row justify-start gap-3 px-3.5 py-3 text-left">
                  <ShieldCheck className="size-6 text-rose-dk" />
                  <span className="flex flex-col"><b>Not today</b><small>Stopping is good training too</small></span>
                </Choice>
              </ChoiceGroup>
            </>
          )}
        </div>
      </StepScreen>
    </div>
  );
}
