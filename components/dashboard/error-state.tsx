"use client"

import { AlertCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { reloadWorkspace } from "@/lib/tutor-data"

export function ErrorState({
    message,
    onRetry = reloadWorkspace,
}: {
    message: string
    onRetry?: () => void
}) {
    return (
        <div className="glass-surface rounded-3xl p-10 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                <AlertCircle className="size-5" />
            </span>
            <h2 className="font-heading mt-4 text-lg font-semibold">
                Could not load dashboard data
            </h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                {message}
            </p>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onRetry}
                className="mt-5"
            >
                <RefreshCw />
                Try again
            </Button>
        </div>
    )
}
