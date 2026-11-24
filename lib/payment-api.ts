import { headers } from "next/headers"
import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import { getPremiumPrice, type PremiumAudience } from "@/lib/payment-config"
import { PaymentError } from "@/lib/payment-errors"
import { getAppUrl, getStripe } from "@/lib/stripe"

export type PaymentUser = {
    id: string
    name: string
    email: string
    role: PremiumAudience
    plan: string
}

export type PremiumActivation = {
    activated: boolean
    plan: "pro"
    amount: number
    currency: string
    planName: string
}

/** Reads the current BetterAuth session for payment routes. */
export async function getPaymentUser(): Promise<PaymentUser | null> {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = session?.user as
        | {
              id?: string
              name?: string | null
              email?: string | null
              role?: string | null
              plan?: string | null
          }
        | undefined

    if (
        !session ||
        !user?.id ||
        !user.email ||
        (user.role !== "student" && user.role !== "tutor")
    ) {
        return null
    }

    return {
        id: user.id,
        name: user.name || "Member",
        email: user.email,
        role: user.role,
        plan: user.plan || "free",
    }
}

/** Creates a one-time Stripe Checkout Session for the signed-in user. */
export async function createCheckoutSession(user: PaymentUser) {
    if (user.plan === "pro") {
        throw new PaymentError("You are already a Premium member.", 409)
    }

    const price = getPremiumPrice(user.role)

    if (!price) {
        throw new PaymentError("Your account cannot purchase this plan.", 403)
    }

    const stripe = getStripe()
    const metadata = {
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        planName: price.planName,
    }

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        client_reference_id: user.id,
        customer_email: user.email,
        metadata,
        payment_intent_data: {
            metadata: {
                userId: user.id,
                planName: price.planName,
            },
        },
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: price.currency,
                    unit_amount: price.amountCents,
                    product_data: {
                        name: price.productName,
                        description: "Lifetime Premium membership",
                    },
                },
            },
        ],
        success_url: `${getAppUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${getAppUrl()}/payment/failed`,
    })

    if (!session.url) {
        throw new PaymentError("Stripe did not return a checkout URL.", 500)
    }

    return { url: session.url }
}

/**
 * Verifies a paid Checkout Session and upgrades the user exactly once.
 * Called from the success page, so the session id must come from Stripe.
 */
export async function activatePremiumForSession(
    sessionId: string,
    expectedUserId?: string
): Promise<PremiumActivation> {
    if (!sessionId) {
        throw new PaymentError("Missing Stripe session id.")
    }

    const stripe = getStripe()
    let session

    try {
        session = await stripe.checkout.sessions.retrieve(sessionId)
    } catch {
        throw new PaymentError("Stripe session not found or invalid.")
    }

    if (session.mode !== "payment") {
        throw new PaymentError("This is not a one-time payment session.")
    }

    if (session.payment_status !== "paid") {
        throw new PaymentError("Payment has not been completed.", 402)
    }

    const userId = session.client_reference_id || session.metadata?.userId

    if (!userId) {
        throw new PaymentError("This session is missing account information.")
    }

    if (expectedUserId && userId !== expectedUserId) {
        throw new PaymentError("This payment belongs to another account.", 403)
    }

    if (!ObjectId.isValid(userId)) {
        throw new PaymentError("Invalid account id in this payment session.")
    }

    const objectId = new ObjectId(userId)
    const user = await db.collection("user").findOne(
        { _id: objectId },
        {
            projection: {
                name: 1,
                email: 1,
                role: 1,
                plan: 1,
                premiumActivatedAt: 1,
            },
        }
    )

    if (!user) {
        throw new PaymentError("Account for this payment was not found.", 404)
    }

    const price = getPremiumPrice(user.role as string | null)

    if (!price) {
        throw new PaymentError("Your account cannot purchase this plan.", 403)
    }

    if (
        session.amount_total !== price.amountCents ||
        session.currency !== price.currency
    ) {
        throw new PaymentError("Payment amount does not match your plan.")
    }

    const paymentIntent = session.payment_intent
    const transactionId =
        typeof paymentIntent === "string"
            ? paymentIntent
            : paymentIntent?.id || session.id
    const amount = (session.amount_total ?? 0) / 100
    const paidAt = new Date().toISOString()

    await db.collection("payments").updateOne(
        { stripeSessionId: session.id },
        {
            $set: {
                userEmail: user.email || "",
                userName: user.name || "Member",
                userRole: user.role,
                planName: price.planName,
                amount,
                currency: session.currency || price.currency,
                transactionId,
                stripeSessionId: session.id,
                paymentStatus: "paid",
                paidAt,
            },
            $setOnInsert: { createdAt: paidAt },
        },
        { upsert: true }
    )

    const activated = user.plan !== "pro"

    await db.collection("user").updateOne(
        { _id: objectId },
        {
            $set: {
                plan: "pro",
                premiumActivatedAt: user.premiumActivatedAt || paidAt,
            },
        }
    )

    return {
        activated,
        plan: "pro",
        amount,
        currency: session.currency || price.currency,
        planName: price.planName,
    }
}
