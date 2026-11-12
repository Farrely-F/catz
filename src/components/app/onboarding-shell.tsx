"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { AppFrame } from "@/components/app/app-frame";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const STEPS = ["avatar", "about", "traits", "time", "plan"] as const;

export function OnboardingShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const step = pathname.split("/").pop() as (typeof STEPS)[number];
  const i = STEPS.indexOf(step);
  const back = i > 0 ? `/onboarding/${STEPS[i - 1]}` : "/";

  return (
    <AppFrame>
      {step !== "plan" && (
        <header className="flex items-center gap-3 px-5 pt-4">
          <Link href={back} aria-label="Back" data-sfx="back" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ChevronLeft />
          </Link>
          <Progress value={((i + 1) / STEPS.length) * 100} aria-label="Setup progress" className="flex-1" />
        </header>
      )}
      <div key={pathname} className="flex min-h-0 flex-1 animate-slide-in flex-col">
        {children}
      </div>
    </AppFrame>
  );
}
