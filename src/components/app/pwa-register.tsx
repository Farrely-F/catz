"use client";

import { useEffect } from "react";
import { LESSONS } from "@/lib/curriculum";

/** Routes cached up front so the whole app opens offline after the first visit. */
const WARM = [
  "/app",
  "/app/path",
  "/app/clicker",
  "/app/journal",
  "/app/cat",
  "/app/win",
  "/onboarding/avatar",
  "/onboarding/about",
  "/onboarding/traits",
  "/onboarding/time",
  "/onboarding/plan",
  ...LESSONS.map((l) => `/app/lesson/${l.id}`),
];

/** Registers the service worker in production only (it would fight hot reload in dev). */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    let cancelled = false;
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" });
        const ready = await navigator.serviceWorker.ready;
        if (!cancelled) (ready.active ?? reg.active)?.postMessage({ type: "WARM", urls: WARM });
      } catch {
        /* unsupported or blocked: the app still works online */
      }
    };
    if (document.readyState === "complete") void register();
    else window.addEventListener("load", register, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", register);
    };
  }, []);
  return null;
}
