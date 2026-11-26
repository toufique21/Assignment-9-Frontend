"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"

/** Sun means light theme, moon means dark theme. Click to switch. */
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme()

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle light and dark theme"
            className={cn(
                "flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[var(--glass-tint-soft)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                className
            )}
        >
            <Sun className="size-[18px] dark:hidden" />
            <Moon className="hidden size-[18px] dark:block" />
        </button>
    )
}
