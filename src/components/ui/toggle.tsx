"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Selectable chip: a ledge underneath, sky-tinted and springy when pressed (on). */
const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 rounded-2xl border-2 border-line bg-background text-center text-sm leading-tight font-extrabold whitespace-nowrap shadow-[0_4px_0_var(--line)] transition-[transform,box-shadow,background-color,border-color] duration-100 outline-none hover:bg-surface focus-visible:ring-4 focus-visible:ring-ring/40 active:translate-y-1 active:shadow-[0_0_0_var(--line)] disabled:pointer-events-none disabled:opacity-50 aria-pressed:animate-pop aria-pressed:border-sky-dk aria-pressed:bg-sky-tint aria-pressed:shadow-[0_4px_0_var(--sky-dk)] aria-pressed:active:shadow-[0_0_0_var(--sky-dk)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg.lucide:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "min-h-12 px-3 py-2",
        sm: "min-h-10 px-3 py-1.5",
        lg: "min-h-16 px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
