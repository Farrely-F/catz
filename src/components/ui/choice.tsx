"use client"

import type { ReactNode } from "react"
import { Check } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

/** Single-select group built on the shadcn ToggleGroup. A selected choice cannot be unselected. */
function ChoiceGroup({
  value,
  onValueChange,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: ReactNode
  "aria-label"?: string
}) {
  return (
    <ToggleGroup
      value={[value]}
      onValueChange={(next) => {
        if (next[0] !== undefined) onValueChange(next[0])
      }}
      aria-label={ariaLabel}
      className={cn("grid w-full gap-2.5", className)}
    >
      {children}
    </ToggleGroup>
  )
}

/** A chip. Put a `<small>` inside for a secondary line. */
function Choice({ value, className, children }: { value: string; className?: string; children: ReactNode }) {
  return (
    <ToggleGroupItem value={value} className={cn("flex-col [&_small]:text-xs [&_small]:font-bold [&_small]:text-ink-2", className)}>
      {children}
    </ToggleGroupItem>
  )
}

/** A round color swatch with a check when selected. */
function Swatch({ value, color, label }: { value: string; color: string; label: string }) {
  return (
    <ToggleGroupItem
      value={value}
      aria-label={label}
      style={{ background: color }}
      className="size-11 min-h-0 min-w-0 rounded-full border-4 border-background p-0 shadow-[0_0_0_2px_var(--line),0_4px_0_2px_var(--line)] hover:brightness-105 aria-pressed:border-background aria-pressed:shadow-[0_0_0_3px_var(--ink),0_5px_0_3px_var(--ink)]"
    >
      <Check className="size-5 scale-50 text-white opacity-0 drop-shadow-[0_1px_1px_rgb(0_0_0/0.6)] transition-all duration-200 ease-spring group-aria-pressed/toggle:scale-100 group-aria-pressed/toggle:opacity-100" />
    </ToggleGroupItem>
  )
}

export { ChoiceGroup, Choice, Swatch }
