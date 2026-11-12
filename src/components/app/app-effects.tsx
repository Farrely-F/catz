"use client";

import { useEffect } from "react";
import { configureAudio, sfx } from "@/lib/audio";
import { useCatz } from "@/lib/store";

type SfxName = "press" | "pop" | "next" | "back" | "tab" | "success" | "error";

/**
 * Mounted once in the root layout.
 * - keeps the audio engine in sync with saved preferences
 * - sets the cat's tail speed from the energy trait
 * - plays sounds for any element marked `data-sfx="next|back|tab|pop|..."`
 *   (shadcn buttons also get a soft press sound; add `data-no-sfx` to opt out)
 */
export function AppEffects() {
  const state = useCatz();
  const prefs = state?.prefs;
  const boy = state?.profile.sex === "boy";
  const energy = state?.profile.energy;

  useEffect(() => {
    if (prefs) configureAudio({ ...prefs, boy });
  }, [prefs, boy]);

  useEffect(() => {
    if (energy === undefined) return;
    document.documentElement.style.setProperty("--wag", `${(3.2 - (energy / 100) * 2.7).toFixed(2)}s`);
  }, [energy]);

  useEffect(() => {
    const isOff = (el: Element) => el.matches(":disabled,[data-disabled],[aria-disabled='true']") || el.closest("[data-no-sfx]");
    const onDown = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest('[data-slot="button"],[data-sfx]');
      if (el && !isOff(el)) sfx.press();
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const el = target?.closest('[data-slot="toggle-group-item"],[data-sfx]');
      if (!el || isOff(el)) return;
      const name = (el.getAttribute("data-sfx") ?? "pop") as SfxName;
      if (name !== "press") sfx[name]?.();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
