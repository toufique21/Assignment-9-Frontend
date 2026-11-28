import { Loader2 } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingState({ label = "Loading..." }: { label?: string }) {
    return (
        <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-3 py-20 text-center">
            <span className="glass-surface flex size-12 items-center justify-center rounded-2xl text-primary">
                <Loader2 className="size-5 animate-spin" />
            </span>
            <p className="text-sm font-medium">{label}</p>
        </Container>
    )
}

export function PageSkeleton() {
    return (
        <Container className="space-y-6 py-12">
            <div className="space-y-3">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-10 w-2/3 max-w-lg" />
                <Skeleton className="h-5 w-full max-w-xl" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <Skeleton key={item} className="h-40 rounded-3xl" />
                ))}
            </div>
        </Container>
    )
}

export function DashboardSkeleton() {
    return (
        <Container className="space-y-5 py-8">
            <Skeleton className="h-16 rounded-2xl" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((item) => (
                    <Skeleton key={item} className="h-32 rounded-3xl" />
                ))}
            </div>
            <Skeleton className="h-72 rounded-3xl" />
        </Container>
    )
}

export function TuitionGridSkeleton() {
    return (
        <Container className="space-y-6 py-12">
            <div className="space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-10 w-2/3 max-w-lg" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((item) => (
                    <Skeleton key={item} className="h-80 rounded-3xl" />
                ))}
            </div>
        </Container>
    )
}

export function TuitionDetailSkeleton() {
    return (
        <Container className="space-y-6 py-12">
            <Skeleton className="h-10 w-40" />
            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <Skeleton className="h-[34rem] rounded-3xl" />
                <Skeleton className="h-[34rem] rounded-3xl" />
            </div>
        </Container>
    )
}
