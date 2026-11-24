import { adminDb, adminUnauthorized, requireAdmin } from "@/lib/admin-api"
import { getStripeAdminData } from "@/lib/admin-stripe"
import { getErrorMessage } from "@/lib/api-client"
import { PaymentError } from "@/lib/payment-errors"

export async function GET() {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    try {
        const [
            totalUsers,
            totalTutors,
            pendingTuitions,
            approvedTuitions,
            stripe,
        ] = await Promise.all([
            adminDb.collection("user").countDocuments(),
            adminDb.collection("user").countDocuments({ role: "tutor" }),
            adminDb
                .collection("tuitions")
                .countDocuments({ approvalStatus: "pending" }),
            adminDb
                .collection("tuitions")
                .countDocuments({ approvalStatus: "approved" }),
            getStripeAdminData(),
        ])

        return Response.json({
            totalUsers,
            totalTutors,
            pendingTuitions,
            approvedTuitions,
            totalRevenue: stripe.totalRevenue,
        })
    } catch (error) {
        const status = error instanceof PaymentError ? error.status : 500

        return Response.json(
            { message: getErrorMessage(error) },
            { status }
        )
    }
}
