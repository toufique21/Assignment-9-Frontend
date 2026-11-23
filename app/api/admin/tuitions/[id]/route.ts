import { ObjectId } from "mongodb"

import {
    adminDb,
    adminUnauthorized,
    requireAdmin,
    serializeMongo,
} from "@/lib/admin-api"

const approvalStatuses = ["approved", "rejected"]

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
    if (!(await requireAdmin())) {
        return adminUnauthorized()
    }

    const { id } = await context.params
    const body: unknown = await request.json().catch(() => null)
    const approvalStatus = (body as { approvalStatus?: string } | null)
        ?.approvalStatus

    if (!approvalStatus || !approvalStatuses.includes(approvalStatus)) {
        return Response.json(
            { message: "Invalid approval status." },
            { status: 400 }
        )
    }

    if (!ObjectId.isValid(id)) {
        return Response.json({ message: "Invalid tuition id." }, { status: 400 })
    }

    const tuition = await adminDb.collection("tuitions").findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { approvalStatus } },
        { returnDocument: "after" }
    )

    if (!tuition) {
        return Response.json({ message: "Tuition not found." }, { status: 404 })
    }

    return Response.json(serializeMongo(tuition))
}
