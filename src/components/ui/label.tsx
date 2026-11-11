"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/** Small uppercase section label. */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-baseline justify-between gap-2 text-xs font-extrabold tracking-widest text-ink-2 uppercase select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
