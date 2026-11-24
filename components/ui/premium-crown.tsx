import { Crown } from "lucide-react"

import { cn } from "@/lib/utils"

/** Small rotated crown badge shown on Premium avatars. */
export function PremiumCrown({ className }: { className?: string }) {
    return (
        <span
            role="img"
            aria-label="Premium member"
            className={cn(
                "flex size-5 items-center justify-center rounded-full bg-[#ff2d78]/15 text-[#ff2d78] shadow-md ring-2 ring-white/70 dark:bg-[#ff2d78]/25 dark:text-[#ff85b3] dark:ring-[var(--nav-bg)]",
                className
            )}
        >
            <Crown
                className="size-3.5 rotate-45 text-[#ff2d78] dark:text-[#ff85b3]"
                strokeWidth={2.6}
            />
        </span>
    )
}
