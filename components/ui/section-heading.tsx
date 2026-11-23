import { cn } from "@/lib/utils"

export function SectionHeading({
    eyebrow,
    title,
    description,
    centered = false,
    className,
}: {
    eyebrow?: string
    title: string
    description?: string
    centered?: boolean
    className?: string
}) {
    return (
        <div
            className={cn(
                "space-y-3",
                centered && "mx-auto max-w-2xl text-center",
                className
            )}
        >
            {eyebrow && (
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
                    {eyebrow}
                </span>
            )}
            <h2 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
            </h2>
            {description && (
                <p className="text-base leading-relaxed text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    )
}
