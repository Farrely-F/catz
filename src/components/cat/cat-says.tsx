import type { ReactNode } from "react";
import { CatAvatar } from "./cat-avatar";
import { cn } from "@/lib/utils";
import type { CatLook } from "@/lib/cat";

/** A short note from the cat. */
export function CatSays({
  look,
  children,
  tone = "sun",
  className,
}: {
  look: CatLook;
  children: ReactNode;
  tone?: "sun" | "mint" | "sky";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm leading-snug font-extrabold",
        tone === "sun" && "bg-sun-tint",
        tone === "mint" && "bg-mint-tint",
        tone === "sky" && "bg-sky-tint",
        className,
      )}
    >
      <CatAvatar look={look} head className="w-11 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
