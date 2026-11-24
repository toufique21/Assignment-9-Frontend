import Stripe from "stripe"

import { PaymentError } from "@/lib/payment-errors"

let stripeClient: Stripe | null = null

/** Lazily creates the server-only Stripe client so builds do not need a key. */
export function getStripe() {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
        throw new PaymentError("Stripe is not configured.", 500)
    }

    if (!stripeClient) {
        stripeClient = new Stripe(secretKey)
    }

    return stripeClient
}

export function getAppUrl() {
    const url =
        process.env.BETTER_AUTH_URL ||
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        "http://localhost:3000"

    return url.replace(/\/$/, "")
}
