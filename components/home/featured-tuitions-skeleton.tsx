import { Container } from "@/components/ui/container"
import { Skeleton } from "@/components/ui/skeleton"

export function FeaturedTuitionsSkeleton() {
    return (
        <section className="py-16 sm:py-20" aria-label="Loading featured tuitions">
            <Container>
                <Skeleton className="h-10 w-72" />
                <Skeleton className="mt-3 h-5 w-full max-w-md" />
                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="glass-surface rounded-3xl p-3">
                            <Skeleton className="aspect-video w-full rounded-2xl" />
                            <Skeleton className="mt-5 h-5 w-3/4" />
                            <Skeleton className="mt-3 h-4 w-1/2" />
                            <Skeleton className="mt-8 h-10 w-full" />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
