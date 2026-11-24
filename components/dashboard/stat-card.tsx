import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function StatCard({
    label,
    value,
    hint,
    icon: Icon,
    valueIcon,
    valueClassName,
    className,
}: {
    label: string
    value: string | number
    hint?: string
    icon: LucideIcon
    valueIcon?: ReactNode
    valueClassName?: string
    className?: string
}) {
    return (
        <article className={cn("glass-surface rounded-3xl p-5", className)}>
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{label}</p>
                <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Icon className="size-4" />
                </span>
            </div>
            <p
                className={cn(
                    "font-heading mt-4 flex items-center gap-2 text-3xl font-semibold tabular-nums",
                    valueClassName
                )}
            >
                {valueIcon}
                <span>{value}</span>
            </p>
            {hint ? (
                <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
            ) : null}
        </article>
    )
}
