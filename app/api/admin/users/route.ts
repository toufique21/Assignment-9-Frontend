import { adminDb, adminUnauthorized, requireAdmin, serializeMongo } from "@/lib/admin-api"

export async function GET() {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    const users = await adminDb
        .collection("user")
        .find(
            {},
            {
                projection: {
                    name: 1,
                    email: 1,
                    role: 1,
                    plan: 1,
                    phone: 1,
                    bio: 1,
                    createdAt: 1,
                },
            }
        )
        .sort({ createdAt: -1 })
        .toArray()

    return Response.json(users.map(serializeMongo))
}
