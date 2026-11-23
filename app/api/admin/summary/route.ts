import { adminDb, adminUnauthorized, requireAdmin } from "@/lib/admin-api"

export async function GET() {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    const [totalUsers, totalTutors, pendingTuitions, approvedTuitions, payments] =
        await Promise.all([
            adminDb.collection("user").countDocuments(),
            adminDb.collection("user").countDocuments({ role: "tutor" }),
            adminDb
                .collection("tuitions")
                .countDocuments({ approvalStatus: "pending" }),
            adminDb
                .collection("tuitions")
                .countDocuments({ approvalStatus: "approved" }),
            adminDb
                .collection("payments")
                .find(
                    { paymentStatus: "paid" },
                    { projection: { amount: 1 } }
                )
                .toArray(),
        ])

    const totalRevenue = payments.reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
    )

    return Response.json({
        totalUsers,
        totalTutors,
        pendingTuitions,
        approvedTuitions,
        totalRevenue,
    })
}
