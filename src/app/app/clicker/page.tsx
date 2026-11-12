"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { SettingRow } from "@/components/app/setting-row";
import { ClickerButton } from "@/components/clicker/clicker-button";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { configureAudio, sfx } from "@/lib/audio";
import { todayOf } from "@/lib/progress";
import { actions, useCatz } from "@/lib/store";
import { dayKey } from "@/lib/streak";
import { cn } from "@/lib/utils";

const BUDGET = 20;
const CIRC = 2 * Math.PI * 20;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export default function ClickerPage() {
  const state = useCatz();
  const [clicks, setClicks] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [pluses, setPluses] = useState<number[]>([]);
  const seq = useRef(0);
  const elapsedRef = useRef(0);
  const total = state?.profile.minutes === 5 ? 150 : 300;

  // Focus mode applies on this tab: only the clicker is heard while you train.
  useEffect(() => {
    configureAudio({ training: true });
    return () => configureAudio({ training: false });
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= total) {
        clearInterval(id);
        elapsedRef.current = 0;
        setElapsed(0);
        setRunning(false);
        configureAudio({ training: false });
        sfx.chime();
        configureAudio({ training: true });
        toast("Round over. End on an easy win.");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [running, total]);

  if (!state) return null;
  const treats = todayOf(state, dayKey()).treats;
  const pct = Math.min(100, (treats / BUDGET) * 100);
  const left = Math.max(0, total - elapsed);
  const note =
    pct >= 100 ? "Budget reached. Switch to praise or a lick of food." : pct >= 80 ? "Nearly there. Use smaller treats from here." : "Treats should stay under 10% of daily food.";
  const prefs = state.prefs;

  const click = () => {
    setClicks((c) => c + 1);
    actions.addTreats(1);
    setPluses((p) => [...p, ++seq.current]);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pt-4">
        <h1 className="font-display text-[1.7rem] font-extrabold">Clicker</h1>
        <div className="flex items-center gap-2.5 rounded-2xl border-2 border-line bg-surface py-1.5 pr-2 pl-2">
          <svg viewBox="0 0 50 50" className="size-11 -rotate-90" aria-hidden>
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="7" className="stroke-surface-2" />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              className="stroke-mint transition-[stroke-dashoffset] duration-1000 ease-linear"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (elapsed / total)}
            />
          </svg>
          <b className="min-w-[3.1rem] font-display text-xl font-extrabold tabular-nums" aria-label="Time left in this round">
            {fmt(left)}
          </b>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={running ? "Pause round timer" : "Start round timer"}
            onClick={() => {
              setRunning((r) => !r);
              sfx.toggle(!running);
            }}
          >
            {running ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-3 pb-5">
        <div className="relative flex justify-center pt-1">
          <ClickerButton size="lg" onClick={click} />
          {pluses.map((id) => (
            <span
              key={id}
              aria-hidden
              onAnimationEnd={() => setPluses((p) => p.filter((x) => x !== id))}
              className="pointer-events-none absolute top-0 left-1/2 animate-float-up font-display text-2xl font-extrabold text-sky-dk"
            >
              +1
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border-2 border-line px-3 py-2">
            <small className="block text-[11px] font-extrabold tracking-widest text-ink-2 uppercase">Clicks</small>
            <b key={clicks} className="inline-block animate-bump font-display text-3xl leading-tight font-extrabold tabular-nums">{clicks}</b>
          </div>
          <div className="rounded-2xl border-2 border-line px-3 py-2">
            <small className="block text-[11px] font-extrabold tracking-widest text-ink-2 uppercase">Treats today</small>
            <b key={treats} className="inline-block animate-bump font-display text-3xl leading-tight font-extrabold tabular-nums">{treats}</b>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>
            Treat budget
            <b className="font-display text-base font-extrabold tracking-normal text-ink normal-case tabular-nums">
              {treats} / {BUDGET}
            </b>
          </Label>
          <Progress
            value={pct}
            aria-label="Treat budget used"
            indicatorClassName={cn(pct >= 100 ? "bg-rose" : pct >= 80 ? "bg-sun" : "bg-mint")}
          />
          <div className="flex items-center justify-between gap-2">
            <small className="text-[13px] font-bold text-ink-2">{note}</small>
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0 normal-case"
              disabled={treats === 0}
              onClick={() => {
                actions.addTreats(-1);
                setClicks((c) => Math.max(0, c - 1));
              }}
            >
              <Undo2 /> Undo
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <SettingRow id="s-sound" title="Clicker sound" note={prefs.sound ? (prefs.soft ? "Soft click" : "Sharp click") : "Muted"} checked={prefs.sound} onChange={(sound) => actions.setPrefs({ sound })} />
          <SettingRow id="s-soft" title="Soft click" note="Gentler for shy cats" checked={prefs.soft} onChange={(soft) => actions.setPrefs({ soft })} />
          <SettingRow id="s-haptic" title="Vibration" note="Phones with haptics only" checked={prefs.haptic} onChange={(haptic) => actions.setPrefs({ haptic })} />
          <SettingRow id="s-focus" title="Focus mode" note="Only the clicker makes sound while training" checked={prefs.focus} onChange={(focus) => actions.setPrefs({ focus })} />
          <SettingRow id="s-ui" title="App sounds" note="Taps, chimes and meows" checked={prefs.ui} onChange={(ui) => actions.setPrefs({ ui })} />
        </div>
      </div>
    </div>
  );
}
