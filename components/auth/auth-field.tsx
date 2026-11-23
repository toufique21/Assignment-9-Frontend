import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export function AuthField({
    label,
    id,
    className,
    ...props
}: { label: string; id: string } & ComponentProps<"input">) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                className={cn(
                    "glass-surface h-11 w-full rounded-2xl px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60",
                    className
                )}
                {...props}
            />
        </div>
    )
}
