"use client";

import { Switch } from "@/components/ui/switch";
import { sfx } from "@/lib/audio";

export function SettingRow({
  id,
  title,
  note,
  checked,
  onChange,
}: {
  id: string;
  title: string;
  note: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-line px-4 py-2.5">
      <label htmlFor={id} className="leading-tight">
        <b className="block text-[0.95rem] font-extrabold">{title}</b>
        <small className="text-xs font-bold text-ink-2">{note}</small>
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={(v) => {
          onChange(v);
          sfx.toggle(v);
        }}
      />
    </div>
  );
}
