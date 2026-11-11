"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { CatAvatar } from "./cat-avatar";
import type { CatLook } from "@/lib/cat";

type Props = {
  look: CatLook;
  mood?: "idle" | "happy";
  head?: boolean;
  className?: string;
  label?: string;
  /** Called on every tap, e.g. to play a meow. */
  onTap?: () => void;
};

/** Interactive cat: tap it and it perks up, flicks its ears and hops. */
export function CatMascot({ look, mood = "idle", head, className, label, onTap }: Props) {
  const [cheer, setCheer] = useState(false);
  const [hop, setHop] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const tap = useCallback(() => {
    onTap?.();
    setCheer(true);
    setHop(false);
    requestAnimationFrame(() => setHop(true));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCheer(false);
      setHop(false);
    }, 800);
  }, [onTap]);

  return (
    <span
      className={cn("inline-block cursor-pointer touch-manipulation", cheer && "cat-twitch", hop && !head && "cat-hop", className)}
      onPointerDown={tap}
    >
      <CatAvatar look={look} mood={cheer ? "happy" : mood} head={head} label={label} />
    </span>
  );
}
