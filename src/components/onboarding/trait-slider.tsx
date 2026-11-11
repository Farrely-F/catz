"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { sfx } from "@/lib/audio";

export function TraitSlider({
  label,
  word,
  value,
  onChange,
  left,
  right,
}: {
  label: string;
  word: string;
  value: number;
  onChange: (v: number) => void;
  left: string;
  right: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label>
        {label}
        <b className="font-display text-base font-extrabold tracking-normal text-ink normal-case">{word}</b>
      </Label>
      <Slider
        value={[value]}
        min={0}
        max={100}
        aria-label={`${left} to ${right}`}
        onValueChange={(v) => {
          const n = Array.isArray(v) ? v[0] : (v as number);
          onChange(n);
          sfx.slide(n);
        }}
      />
      <div className="flex justify-between text-xs font-extrabold text-ink-2">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}
