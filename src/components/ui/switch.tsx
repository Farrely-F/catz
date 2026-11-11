"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer relative inline-flex h-8 w-[54px] shrink-0 items-center rounded-full border-0 shadow-[inset_0_-3px_0_rgb(0_0_0/0.08)] transition-colors duration-200 outline-none after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:ring-4 focus-visible:ring-ring/40 data-checked:bg-mint data-unchecked:bg-surface-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-[26px] translate-x-[3px] rounded-full bg-white shadow-[0_2px_0_rgb(0_0_0/0.18)] transition-transform duration-300 ease-spring data-checked:translate-x-[25px]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
