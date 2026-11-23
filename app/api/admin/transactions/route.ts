import { adminDb, adminUnauthorized, requireAdmin, serializeMongo } from "@/lib/admin-api"

export async function GET() {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    const transactions = await adminDb
        .collection("payments")
        .find()
        .sort({ paidAt: -1 })
        .toArray()

    return Response.json(transactions.map(serializeMongo))
}
