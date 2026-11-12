"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sfx } from "@/lib/audio";

export function AgeStepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const step = (dir: 1 | -1) => {
    onChange(Math.max(0, Math.min(20, value + dir)));
    sfx.step(dir);
  };
  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-line bg-surface p-2">
      <Button variant="outline" size="icon" aria-label="Younger" disabled={value <= 0} onClick={() => step(-1)}>
        <Minus />
      </Button>
      <div className="text-center leading-none" aria-live="polite">
        <b key={value} className="inline-block animate-bump font-display text-4xl font-extrabold">
          {value < 1 ? "<1" : value}
        </b>
        <span className="mt-1 block text-xs font-extrabold tracking-widest text-ink-2 uppercase">
          {value === 1 ? "year" : "years"}
        </span>
      </div>
      <Button variant="outline" size="icon" aria-label="Older" disabled={value >= 20} onClick={() => step(1)}>
        <Plus />
      </Button>
    </div>
  );
}
