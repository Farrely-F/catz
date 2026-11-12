import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-2xl border-2 border-line bg-surface px-4 font-display text-xl font-extrabold transition-colors outline-none placeholder:text-ink-2/60 focus-visible:border-sky-dk focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-rose-dk",
        className
      )}
      {...props}
    />
  )
}

export { Input }
