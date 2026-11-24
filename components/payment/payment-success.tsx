"use client"

import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { use, useMemo } from "react"

import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { apiFetch, getErrorMessage } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"
import { getRole } from "@/lib/roles"

type ConfirmResult =
    | { ok: true; plan: string; activated: boolean; amount: number }
    | { ok: false; message: string }

async function confirmPayment(
    sessionId: string,
    router: ReturnType<typeof useRouter>
): Promise<ConfirmResult> {
    if (!sessionId) {
        return { ok: false, message: "Missing Stripe session id." }
    }

    try {
        const result = await apiFetch<{
            ok: boolean
            plan: string
            activated: boolean
            amount: number
        }>("/api/payments/confirm", {
            method: "POST",
            body: JSON.stringify({ sessionId }),
        })

        await authClient.getSession()
        router.refresh()

        return {
            ok: true,
            plan: result.plan,
            activated: result.activated,
            amount: result.amount,
        }
    } catch (error) {
        return { ok: false, message: getErrorMessage(error) }
    }
}

export function PaymentSuccess() {
    const router = useRouter()
    const params = useSearchParams()
    const session = authClient.useSession()
    const user = session.data?.user as { role?: string | null } | undefined
    const role = getRole(user?.role)
    const sessionId = params.get("session_id") ?? ""
    const result = use(
        useMemo(() => confirmPayment(sessionId, router), [sessionId, router])
    )

    if (!result.ok) {
        return (
            <Container className="py-16">
                <div className="glass-surface mx-auto max-w-lg rounded-3xl p-8 text-center">
                    <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/12 text-destructive">
                        <XCircle className="size-7" />
                    </span>
                    <h1 className="font-heading mt-5 text-2xl font-semibold">
                        Could not confirm payment
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {result.message}
                    </p>
                    <ButtonLink
                        href="/pricing"
                        variant="secondary"
                        className="mt-6 w-full"
                    >
                        Back to pricing
                    </ButtonLink>
                </div>
            </Container>
        )
    }

    return (
        <Container className="py-16">
            <div className="glass-surface mx-auto max-w-lg rounded-3xl p-8 text-center">
                <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <CheckCircle2 className="size-7" />
                </span>
                <h1 className="font-heading mt-5 text-2xl font-semibold">
                    Payment successful
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {result.activated
                        ? "Your account is now a Premium member. Unlimited access is active."
                        : "Your Premium membership is already active. Thanks for your support."}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                    Amount paid: ${result.amount.toFixed(2)} USD
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonLink href={`/dashboard/${role}`}>
                        Go to dashboard
                    </ButtonLink>
                    <ButtonLink href="/pricing" variant="secondary">
                        View pricing
                    </ButtonLink>
                </div>
            </div>
        </Container>
    )
}

export function PaymentSuccessFallback() {
    return (
        <Container className="py-16">
            <div className="glass-surface mx-auto flex max-w-lg flex-col items-center gap-4 rounded-3xl p-8 text-center">
                <Loader2 className="size-7 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                    Confirming your payment...
                </p>
            </div>
        </Container>
    )
}
