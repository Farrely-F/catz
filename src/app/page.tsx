import Link from "next/link";
import { CatMascot } from "@/components/cat/cat-mascot";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_LOOK } from "@/lib/cat";
import { cn } from "@/lib/utils";

/** Placeholder home. The full landing page ships with the PWA and SEO branch. */
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <CatMascot look={DEFAULT_LOOK} className="w-52" label="A ginger tabby cat" />
      <h1 className="font-display text-4xl leading-tight font-extrabold text-balance">
        Training that starts with your cat.
      </h1>
      <p className="text-ink-2">Five minutes a day. A clicker, a treat, and a cat that is learning.</p>
      <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "w-full")}>
        Get started
      </Link>
    </main>
  );
}
