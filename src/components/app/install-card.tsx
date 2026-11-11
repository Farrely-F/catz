"use client";

import { useSyncExternalStore } from "react";
import { Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    emit();
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
  };
}

type Mode = "hidden" | "prompt" | "ios";

function snapshot(): Mode {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "hidden";
  if (deferred) return "prompt";
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return ios ? "ios" : "hidden";
}

/** Install button where the browser offers it, a how-to on iOS, nothing once installed. */
export function InstallCard() {
  const mode = useSyncExternalStore(subscribe, snapshot, () => "hidden" as Mode);
  if (mode === "hidden") return null;

  return (
    <div className="flex flex-col gap-2.5 rounded-2xl bg-sky-tint px-4 py-3.5">
      <b className="font-display text-lg font-extrabold">Install Catz</b>
      <p className="text-sm leading-snug font-bold">
        {mode === "ios" ? (
          <>
            Tap <Share className="inline size-4 align-text-bottom" /> Share, then Add to Home Screen. It opens full screen and works offline.
          </>
        ) : (
          "Add it to your home screen. It opens full screen and works offline."
        )}
      </p>
      {mode === "prompt" && (
        <Button
          variant="sky"
          size="sm"
          className="self-start"
          onClick={async () => {
            await deferred?.prompt();
            await deferred?.userChoice;
            deferred = null;
            emit();
          }}
        >
          <Download /> Install
        </Button>
      )}
    </div>
  );
}
