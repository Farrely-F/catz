import type { Metadata } from "next";
import Link from "next/link";
import { CatAvatar } from "@/components/cat/cat-avatar";
import { CatMascot } from "@/components/cat/cat-mascot";
import { CatSays } from "@/components/cat/cat-says";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_LOOK } from "@/lib/cat";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const STEPS = [
  { title: "Build your cat", text: "Pick the coat, pattern and eyes so it looks like yours. Add age, personality and the treat it loves." },
  { title: "Get a plan that fits", text: "Catz chooses the first lessons from your cat's confidence, energy and age, and splits your daily minutes into short rounds." },
  { title: "Click, treat, repeat", text: "Mark the moment your cat does the right thing with a click, then reward it. A round takes about five minutes." },
];

const FEATURES = [
  { title: "A plan for your cat", text: "A shy senior gets a gentler start than a bold kitten. No two paths are the same.", tint: "bg-ginger-tint" },
  { title: "A clicker that keeps up", text: "It fires the instant you press, with a soft mode for shy cats and a treat budget so snacks stay snacks.", tint: "bg-sky-tint" },
  { title: "Streaks without pressure", text: "No lives and no fail states. Choosing Not today still keeps your streak.", tint: "bg-mint-tint" },
  { title: "Works offline", text: "Install it on your phone. Your cat's data stays on your device, and there is no account.", tint: "bg-sun-tint" },
];

const FAQ = [
  {
    q: "Can you really train a cat?",
    a: "Yes. Cats learn the same way dogs do: they repeat what gets rewarded. Clicker training marks the exact moment a cat does the right thing, then pays it with a treat. Cats just need shorter sessions.",
  },
  {
    q: "How long should a training session be?",
    a: "About five minutes. Cats lose interest quickly, so Catz splits your daily time into two or three short rounds and ends each one on an easy win.",
  },
  {
    q: "Do I need a physical clicker?",
    a: "No. The clicker in Catz fires the moment you press it and plays a real click sound. A physical box clicker works the same way if you prefer one.",
  },
  {
    q: "What if my cat is not in the mood?",
    a: "Choose Not today. You keep your streak, and stopping when a cat is not interested counts as good training.",
  },
  {
    q: "Where is my cat's data stored?",
    a: "On your device. This version has no account and does not send your cat's profile or journal anywhere.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any (web, installable)",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="flex items-center justify-between py-5">
        <Link href="/" className="flex items-center gap-2.5 font-display text-3xl leading-none font-extrabold" aria-label="Catz home">
          <CatAvatar look={DEFAULT_LOOK} head className="w-11" />
          catz
        </Link>
        <Link href="/app" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Open app
        </Link>
      </header>

      <main>
        <section className="grid items-center gap-8 py-6 md:grid-cols-2 md:gap-12 md:py-14">
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm font-extrabold tracking-widest text-ginger-dk uppercase">Cat training app</p>
            <h1 className="font-display text-5xl leading-[1.02] font-extrabold text-balance sm:text-6xl">Training that starts with your cat.</h1>
            <p className="max-w-[34ch] text-lg leading-relaxed text-ink-2">
              Five minutes a day with a clicker and a treat. Catz builds the plan around your cat&apos;s personality, age and your schedule.
            </p>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
                Start training
              </Link>
              <a href="#how" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}>
                How it works
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-ginger-tint px-6 pt-8 pb-6">
            <CatMascot look={DEFAULT_LOOK} className="w-56 sm:w-64" label="A ginger tabby cat. Tap it to say hi." />
            <CatSays look={DEFAULT_LOOK} tone="sun" className="w-full max-w-sm bg-background">
              Tap me. I will ask for a treat after.
            </CatSays>
          </div>
        </section>

        <section id="how" className="scroll-mt-6 py-10">
          <h2 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">How it works</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2 rounded-3xl border-2 border-line p-5">
                <span className="grid size-10 place-items-center rounded-full bg-ginger font-display text-xl font-extrabold text-ink shadow-[0_4px_0_var(--ginger-dk)]">{i + 1}</span>
                <h3 className="font-display text-xl font-extrabold">{s.title}</h3>
                <p className="leading-relaxed text-ink-2">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="py-10">
          <h2 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">Made for cats, not for streak chasing</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <article key={f.title} className={cn("flex flex-col gap-1.5 rounded-3xl p-5", f.tint)}>
                <h3 className="font-display text-xl font-extrabold">{f.title}</h3>
                <p className="leading-relaxed">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-10">
          <h2 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">Questions</h2>
          <div className="flex max-w-3xl flex-col gap-3">
            {FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl border-2 border-line px-4 py-3 open:bg-surface">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-display text-lg font-extrabold">
                  {f.q}
                  <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-lg leading-none transition-transform duration-200 group-open:rotate-45">+</span>
                </summary>
                <p className="pt-2 leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-6 flex flex-col items-center gap-4 rounded-[2rem] bg-ink px-6 py-10 text-center text-background">
          <h2 className="font-display text-3xl font-extrabold text-balance sm:text-4xl">Your cat is already watching you.</h2>
          <p className="max-w-md opacity-80">Give it something to learn. It takes five minutes.</p>
          <Link href="/app" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
            Start training
          </Link>
        </section>
      </main>

      <footer className="pt-10 text-center text-sm text-ink-2">Catz. Made for cats and the people they train.</footer>
    </div>
  );
}
