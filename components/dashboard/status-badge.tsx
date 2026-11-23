import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
    pending: "bg-[#ff9500]/15 text-[#a25d00] dark:text-[#ffb340]",
    approved: "bg-[#34c759]/15 text-[#248a3d] dark:text-[#75e28b]",
    accepted: "bg-[#34c759]/15 text-[#248a3d] dark:text-[#75e28b]",
    active: "bg-[#34c759]/15 text-[#248a3d] dark:text-[#75e28b]",
    rejected: "bg-[#ff3b30]/15 text-[#c92a22] dark:text-[#ff8b84]",
    closed: "bg-muted text-muted-foreground",
    free: "bg-muted text-muted-foreground",
    pro: "bg-primary/15 text-primary",
}

function formatStatus(status: string) {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

export function StatusBadge({
    status,
    children,
}: {
    status: string
    children?: ReactNode
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                statusStyles[status] ?? "bg-muted text-muted-foreground"
            )}
        >
            {children ?? formatStatus(status)}
        </span>
    )
}
