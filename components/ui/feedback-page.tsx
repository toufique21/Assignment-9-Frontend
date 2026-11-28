import type { ReactNode } from "react"

import { Container } from "@/components/ui/container"

export function FeedbackPage({
    icon,
    title,
    description,
    children,
}: {
    icon: ReactNode
    title: string
    description: string
    children?: ReactNode
}) {
    return (
        <Container className="flex min-h-[70vh] items-center justify-center py-16">
            <div className="glass-surface w-full max-w-md space-y-5 rounded-3xl p-8 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    {icon}
                </span>
                <div className="space-y-2">
                    <h1 className="font-heading text-2xl font-semibold">{title}</h1>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {children ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                        {children}
                    </div>
                ) : null}
            </div>
        </Container>
    )
}
