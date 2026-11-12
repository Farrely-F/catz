import type { Metadata } from "next";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { DEFAULT_LOOK } from "@/lib/cat";

export const metadata: Metadata = { title: "Offline", robots: { index: false } };

/** Shown by the service worker when a page is not cached and there is no connection. */
export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
      <CatAvatar look={DEFAULT_LOOK} className="w-40" label="A cat waiting patiently" />
      <h1 className="font-display text-3xl font-extrabold">You are offline</h1>
      <p className="text-ink-2">
        Catz works without a connection once you have opened it online. This page was not saved yet. Reconnect and try again.
      </p>
    </main>
  );
}
