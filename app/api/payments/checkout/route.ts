import { getErrorMessage } from "@/lib/api-client"
import {
    createCheckoutSession,
    getPaymentUser,
} from "@/lib/payment-api"
import { PaymentError } from "@/lib/payment-errors"

export async function POST(request: Request) {
    try {
        const user = await getPaymentUser()

        if (!user) {
            return Response.json(
                { message: "Sign in to purchase Premium." },
                { status: 401 }
            )
        }

        const body = (await request.json().catch(() => ({}))) as {
            audience?: string
        }

        if (body.audience && body.audience !== user.role) {
            return Response.json(
                { message: "Choose the plan that matches your account role." },
                { status: 403 }
            )
        }

        const result = await createCheckoutSession(user)

        return Response.json(result)
    } catch (error) {
        const status = error instanceof PaymentError ? error.status : 500

        return Response.json(
            { message: getErrorMessage(error) },
            { status }
        )
    }
}
