import { getErrorMessage } from "@/lib/api-client"
import {
    activatePremiumForSession,
    getPaymentUser,
} from "@/lib/payment-api"
import { PaymentError } from "@/lib/payment-errors"

export async function POST(request: Request) {
    try {
        const user = await getPaymentUser()

        if (!user) {
            return Response.json(
                { message: "Sign in to confirm your payment." },
                { status: 401 }
            )
        }

        const body = (await request.json().catch(() => ({}))) as {
            sessionId?: string
        }

        if (typeof body.sessionId !== "string" || !body.sessionId) {
            return Response.json(
                { message: "Missing Stripe session id." },
                { status: 400 }
            )
        }

        const result = await activatePremiumForSession(
            body.sessionId,
            user.id
        )

        return Response.json({ ok: true, ...result })
    } catch (error) {
        const status = error instanceof PaymentError ? error.status : 500

        return Response.json(
            { message: getErrorMessage(error) },
            { status }
        )
    }
}
