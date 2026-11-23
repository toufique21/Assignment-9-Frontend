import { ObjectId } from "mongodb"

import {
    adminDb,
    adminUnauthorized,
    requireAdmin,
    serializeMongo,
} from "@/lib/admin-api"

const roles = ["student", "tutor", "admin"]

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
    const admin = await requireAdmin()

    if (!admin) {
        return adminUnauthorized()
    }

    const { id } = await context.params
    const body: unknown = await request.json().catch(() => null)
    const role = (body as { role?: string } | null)?.role

    if (!role || !roles.includes(role)) {
        return Response.json({ message: "Invalid role." }, { status: 400 })
    }

    if (admin.id === id && role !== "admin") {
        return Response.json(
            { message: "You cannot change your own admin role." },
            { status: 400 }
        )
    }

    if (!ObjectId.isValid(id)) {
        return Response.json({ message: "Invalid user id." }, { status: 400 })
    }

    const user = await adminDb.collection("user").findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                role,
                updatedAt: new Date().toISOString(),
            },
        },
        { returnDocument: "after" }
    )

    if (!user) {
        return Response.json({ message: "User not found." }, { status: 404 })
    }

    return Response.json(serializeMongo(user))
}
