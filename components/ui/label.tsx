import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-xs font-bold leading-none text-muted-foreground uppercase tracking-widest select-none",
        className
      )}
      {...props}
    />
  )
}

export { Label }
