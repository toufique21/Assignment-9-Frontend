import { adminDb, adminUnauthorized, requireAdmin, serializeMongo } from "@/lib/admin-api"

export async function GET() {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    const tuitions = await adminDb
        .collection("tuitions")
        .find()
        .sort({ createdAt: -1 })
        .toArray()

    return Response.json(tuitions.map(serializeMongo))
}
