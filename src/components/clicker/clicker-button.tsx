"use client";

import { useRef, useState } from "react";
import { clickerDown, clickerUp } from "@/lib/audio";
import { cn } from "@/lib/utils";

function ClickerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4.5" y="3" width="15" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
    </svg>
  );
}

/**
 * The clicker. It fires on pointer DOWN, not on release, because in clicker training the
 * marker must land on the exact moment of the behavior. Release plays the small "tick".
 * Return `false` from `onClick` to say nothing happened (no sound, no animation).
 */
export function ClickerButton({
  onClick,
  size = "md",
  className,
}: {
  onClick?: () => boolean | void;
  size?: "md" | "lg";
  className?: string;
}) {
  const [down, setDown] = useState(false);
  const [ripple, setRipple] = useState(0);
  const held = useRef(false);

  const press = () => {
    if (held.current) return;
    if (onClick?.() === false) return;
    held.current = true;
    setDown(true);
    setRipple((n) => n + 1);
    clickerDown();
  };
  const release = (play: boolean) => {
    if (!held.current) return;
    held.current = false;
    setDown(false);
    if (play) clickerUp();
  };

  return (
    <button
      type="button"
      aria-label="Click"
      data-no-sfx
      className={cn(
        "relative touch-manipulation select-none [-webkit-touch-callout:none]",
        size === "lg" ? "h-[216px] w-[208px]" : "h-[176px] w-[168px]",
        className,
      )}
      onPointerDown={(e) => {
        if (e.button > 0) return;
        e.preventDefault();
        press();
      }}
      onPointerUp={() => release(true)}
      onPointerLeave={() => release(true)}
      onPointerCancel={() => release(false)}
      onKeyDown={(e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat) {
          e.preventDefault();
          press();
        }
      }}
      onKeyUp={() => release(true)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <span
        key={ripple}
        aria-hidden
        className={cn("absolute inset-x-0 top-0 h-[calc(100%-8px)] rounded-full border-[5px] border-sky opacity-0", ripple > 0 && "animate-ripple")}
      />
      <span
        className={cn(
          "absolute inset-x-0 top-0 flex h-[calc(100%-8px)] flex-col items-center justify-center gap-0.5 rounded-full bg-sky text-ink transition-[transform,box-shadow] duration-75",
          down
            ? "translate-y-2 shadow-[0_0_0_var(--sky-dk),inset_0_-8px_0_rgb(0_0_0/0.09),inset_0_8px_0_rgb(255_255_255/0.35)]"
            : "shadow-[0_8px_0_var(--sky-dk),inset_0_-8px_0_rgb(0_0_0/0.09),inset_0_8px_0_rgb(255_255_255/0.35)]",
        )}
      >
        <ClickerIcon />
        <em className="font-display text-lg font-extrabold tracking-widest not-italic">CLICK</em>
      </span>
    </button>
  );
}
