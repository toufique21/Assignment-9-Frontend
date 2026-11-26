import { PremiumCrown } from "@/components/ui/premium-crown"
import { cn } from "@/lib/utils"

/** Purple "Pro" label with the crown near the right corner of the small "o". */
export function ProPlanLabel({
    className,
    crownClassName,
}: {
    className?: string
    crownClassName?: string
}) {
    return (
        <span
            className={cn(
                "inline-flex items-baseline text-[#7c3aed] dark:text-[#a78bfa]",
                className
            )}
        >
            <span>Pr</span>
            <span className="relative inline-block">
                o
                <PremiumCrown
                    className={cn(
                        "absolute top-[0.18em] -right-[0.3em] size-[0.5em]",
                        crownClassName
                    )}
                />
            </span>
        </span>
    )
}
