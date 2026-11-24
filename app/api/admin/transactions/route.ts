import { adminUnauthorized, requireAdmin } from "@/lib/admin-api"
import { getStripeAdminData } from "@/lib/admin-stripe"
import { getErrorMessage } from "@/lib/api-client"
import { PaymentError } from "@/lib/payment-errors"

export async function GET() {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    try {
        const { transactions } = await getStripeAdminData()

        return Response.json(transactions)
    } catch (error) {
        const status = error instanceof PaymentError ? error.status : 500

        return Response.json(
            { message: getErrorMessage(error) },
            { status }
        )
    }
}
