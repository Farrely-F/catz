import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Chunky "press" button: a solid darker ledge underneath that collapses on press.
 * `--btn-dk` is the ledge color, `--depth` its height.
 */
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border-0 font-display font-extrabold whitespace-nowrap uppercase tracking-wider outline-none select-none [--depth:5px] shadow-[0_var(--depth)_0_var(--btn-dk)] transition-[transform,box-shadow,filter,background-color] duration-100 hover:brightness-105 active:translate-y-(--depth) active:shadow-[0_0_0_var(--btn-dk)] focus-visible:ring-4 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:bg-surface-2 disabled:text-ink-2 disabled:[--btn-dk:var(--line)] disabled:brightness-100 data-disabled:pointer-events-none data-disabled:bg-surface-2 data-disabled:text-ink-2 data-disabled:[--btn-dk:var(--line)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-ginger text-ink [--btn-dk:var(--ginger-dk)]",
        mint: "bg-mint text-ink [--btn-dk:var(--mint-dk)]",
        sky: "bg-sky text-ink [--btn-dk:var(--sky-dk)]",
        rose: "bg-rose text-ink [--btn-dk:var(--rose-dk)]",
        outline:
          "border-2 border-line bg-background text-foreground [--depth:4px] [--btn-dk:var(--line)] hover:bg-surface hover:brightness-100",
        ghost:
          "bg-transparent text-foreground shadow-none [--btn-dk:transparent] hover:bg-surface active:translate-y-px",
        link: "bg-transparent normal-case tracking-normal text-sky-dk shadow-none underline-offset-4 hover:underline active:translate-y-0",
      },
      size: {
        default: "h-14 px-6 text-base",
        sm: "h-10 rounded-xl px-4 text-sm [--depth:4px]",
        lg: "h-16 px-8 text-lg",
        icon: "size-11 rounded-xl [--depth:4px]",
        "icon-sm": "size-9 rounded-xl [--depth:3px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
