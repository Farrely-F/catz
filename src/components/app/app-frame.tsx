import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Full-bleed on a phone, a centered column on larger screens. */
export function AppFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-background sm:border-x-2 sm:border-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Scrolling body with an optional pinned footer that clears the home indicator. */
export function StepScreen({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 pt-4 pb-4">{children}</div>
      {footer && (
        <div className="border-t-2 border-line bg-background px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>
      )}
    </div>
  );
}
