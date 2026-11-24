"use client"

import { XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export const PAYMENT_FAILED_REDIRECT_SECONDS = 5

export function PaymentFailed() {
    const router = useRouter()

    useEffect(() => {
        const timer = window.setTimeout(
            () => router.replace("/pricing"),
            PAYMENT_FAILED_REDIRECT_SECONDS * 1000
        )

        return () => window.clearTimeout(timer)
    }, [router])

    return (
        <Container className="py-16">
            <div className="glass-surface mx-auto max-w-lg rounded-3xl p-8 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
                    <XCircle className="size-7" />
                </span>
                <h1 className="font-heading mt-5 text-2xl font-semibold">
                    Payment failed
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your payment was not completed, so your account was not
                    upgraded. You can return to pricing and try again.
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                    Redirecting in {PAYMENT_FAILED_REDIRECT_SECONDS} seconds...
                </p>
                <ButtonLink href="/pricing" className="mt-6 w-full">
                    Back to pricing
                </ButtonLink>
            </div>
        </Container>
    )
}
