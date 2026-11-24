import type { PremiumAudience } from "@/lib/payment-config"

export async function startPremiumCheckout(audience: PremiumAudience) {
    const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience }),
        cache: "no-store",
    })
    const payload = (await response.json().catch(() => null)) as
        | { url?: string; message?: string }
        | null

    if (!response.ok || !payload?.url) {
        const error = new Error(
            payload?.message || "Could not open Stripe checkout."
        ) as Error & { status?: number }

        error.status = response.status
        throw error
    }

    return payload.url
}

export function getRequestStatus(error: unknown) {
    return (error as { status?: number } | null)?.status
}
