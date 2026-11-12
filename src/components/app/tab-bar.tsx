"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Cat, Home, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function ClickerTabIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4.5" y="3" width="15" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
    </svg>
  );
}

const TABS: { href: string; label: string; Icon: LucideIcon | typeof ClickerTabIcon }[] = [
  { href: "/app/path", label: "Path", Icon: Home },
  { href: "/app/clicker", label: "Clicker", Icon: ClickerTabIcon },
  { href: "/app/journal", label: "Journal", Icon: BookOpen },
  { href: "/app/cat", label: "My cat", Icon: Cat },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="grid grid-cols-4 gap-1 border-t-2 border-line bg-background px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            data-sfx="tab"
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-px rounded-2xl border-2 border-transparent py-1.5 text-[11px] font-extrabold tracking-wide text-ink-2 uppercase transition-colors hover:bg-surface",
              active && "border-ginger bg-ginger-tint text-ginger-dk",
            )}
          >
            <Icon className={cn("size-6", active && "animate-pop")} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
