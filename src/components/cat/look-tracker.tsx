"use client";

import { useEffect } from "react";

/** Writes pointer position to --lx / --ly so every cat's eyes follow your finger. */
export function LookTracker() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const root = document.documentElement.style;
        root.setProperty("--lx", ((e.clientX / window.innerWidth - 0.5) * 10).toFixed(1));
        root.setProperty("--ly", ((e.clientY / window.innerHeight - 0.5) * 6).toFixed(1));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
