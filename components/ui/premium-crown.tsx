import { Crown } from "lucide-react"

import { cn } from "@/lib/utils"

/** Small purple crown shown on Premium avatars and labels. */
export function PremiumCrown({ className }: { className?: string }) {
    return (
        <Crown
            role="img"
            aria-label="Premium member"
            className={cn(
                "size-4 shrink-0 rotate-45 text-[#7c3aed] dark:text-[#a78bfa]",
                className
            )}
            strokeWidth={2.6}
        />
    )
}
