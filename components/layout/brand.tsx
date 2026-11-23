import { GraduationCap } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

/** The single MentorLagbe wordmark shared by the navbar, footer and home page. */
export function Brand({ className }: { className?: string }) {
    return (
        <Link
            href="/"
            aria-label="MentorLagbe home"
            className={cn("inline-flex items-center gap-2.5", className)}
        >
            <span className="flex size-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#ff9500] to-[#5e5ce6] text-white shadow-[0_8px_20px_-8px_rgba(255,149,0,0.85)] ring-1 ring-white/30">
                <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-[1.0625rem] font-semibold tracking-tight text-foreground">
                Mentor<span className="text-primary">Lagbe</span>
            </span>
        </Link>
    )
}
