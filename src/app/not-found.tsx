import Link from "next/link";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_LOOK } from "@/lib/cat";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center gap-4 px-6 text-center">
      <CatAvatar look={DEFAULT_LOOK} mood="happy" className="w-40" label="A confused cat" />
      <h1 className="font-display text-3xl font-extrabold">Nothing here</h1>
      <p className="text-ink-2">That page wandered off. Let&apos;s get back to training.</p>
      <Link href="/" className={cn(buttonVariants(), "w-full")}>
        Go home
      </Link>
    </main>
  );
}
