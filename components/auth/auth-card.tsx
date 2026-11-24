import type { ReactNode } from "react"

import { Brand } from "@/components/layout/brand"

export function AuthCard({
    title,
    subtitle,
    children,
    footer,
}: {
    title: string
    subtitle: string
    children: ReactNode
    footer?: ReactNode
}) {
    return (
        <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
            <div
                aria-hidden="true"
                className="absolute -top-32 -left-32 size-96 rounded-full bg-[#b86500]/15 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -right-32 bottom-0 size-96 rounded-full bg-[#5e5ce6]/15 blur-3xl"
            />

            <div className="glass-surface relative w-full max-w-md rounded-[2rem] p-8">
                <div className="flex justify-center">
                    <Brand />
                </div>

                <div className="mt-8 space-y-2 text-center">
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>

                <div className="mt-8">{children}</div>

                {footer && (
                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {footer}
                    </div>
                )}
            </div>
        </section>
    )
}
