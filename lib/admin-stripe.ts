import type Stripe from "stripe"

import { adminDb } from "@/lib/admin-api"
import type { AdminTransaction } from "@/lib/admin-data"
import { PaymentError } from "@/lib/payment-errors"
import type { UserRole } from "@/lib/roles"
import { getStripe } from "@/lib/stripe"

type Account = {
    email: string
    name?: string
    role?: string
}

export type StripeAdminData = {
    transactions: AdminTransaction[]
    totalRevenue: number
    transactionCount: number
    tutorRevenue: number
    studentRevenue: number
}

function paymentIntentId(session: Stripe.Checkout.Session) {
    const intent = session.payment_intent

    return typeof intent === "string" ? intent : intent?.id || session.id
}

function readRole(value: string | undefined, fallback?: string): UserRole {
    if (value === "student" || value === "tutor" || value === "admin") {
        return value
    }

    return fallback === "student" || fallback === "tutor" || fallback === "admin"
        ? fallback
        : "student"
}

function amountInDollars(session: Stripe.Checkout.Session) {
    return (session.amount_total ?? 0) / 100
}

async function listPaidSessions() {
    const stripe = getStripe()
    const sessions: Stripe.Checkout.Session[] = []
    let startingAfter: string | undefined

    while (true) {
        const page = await stripe.checkout.sessions.list({
            limit: 100,
            ...(startingAfter ? { starting_after: startingAfter } : {}),
        })

        sessions.push(
            ...page.data.filter((session) => session.payment_status === "paid")
        )

        if (!page.has_more || page.data.length === 0) break
        startingAfter = page.data[page.data.length - 1].id
    }

    return sessions
}

/** Loads paid Stripe Checkout Sessions for the admin dashboard. */
export async function getStripeAdminData(): Promise<StripeAdminData> {
    try {
        const sessions = await listPaidSessions()
        const emails = sessions
            .map((session) => session.customer_email)
            .filter((email): email is string => Boolean(email))
        const accounts = await adminDb
            .collection("user")
            .find(
                { email: { $in: emails } },
                { projection: { email: 1, name: 1, role: 1 } }
            )
            .toArray()
        const accountsByEmail = new Map(
            accounts.map((account) => [
                String(account.email),
                account as unknown as Account,
            ])
        )

        const transactions = sessions
            .map((session): AdminTransaction => {
                const email =
                    session.customer_email ||
                    session.customer_details?.email ||
                    ""
                const account = accountsByEmail.get(email)
                const role = readRole(
                    session.metadata?.userRole,
                    account?.role
                )

                return {
                    id: session.id,
                    userEmail: email,
                    userName:
                        session.customer_details?.name ||
                        account?.name ||
                        email.split("@")[0] ||
                        "Customer",
                    userRole: role,
                    planName:
                        session.metadata?.planName ||
                        (role === "tutor" ? "Pro Tutor" : "Pro Student"),
                    amount: amountInDollars(session),
                    currency: session.currency || "usd",
                    transactionId: paymentIntentId(session),
                    stripeSessionId: session.id,
                    paymentStatus: "paid",
                    paidAt: new Date(session.created * 1000).toISOString(),
                }
            })
            .sort(
                (a, b) => Date.parse(b.paidAt) - Date.parse(a.paidAt)
            )

        const sumForRole = (role: UserRole) =>
            transactions
                .filter((transaction) => transaction.userRole === role)
                .reduce((sum, transaction) => sum + transaction.amount, 0)

        return {
            transactions,
            totalRevenue: transactions.reduce(
                (sum, transaction) => sum + transaction.amount,
                0
            ),
            transactionCount: transactions.length,
            tutorRevenue: sumForRole("tutor"),
            studentRevenue: sumForRole("student"),
        }
    } catch (error) {
        if (error instanceof PaymentError) throw error

        throw new PaymentError("Could not load payments from Stripe.", 502)
    }
}
