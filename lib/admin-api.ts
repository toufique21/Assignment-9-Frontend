import { headers } from "next/headers"

import { auth, db } from "@/lib/auth"

export function adminUnauthorized() {
    return Response.json(
        { message: "You need admin access to view this data." },
        { status: 403 }
    )
}

export async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = session?.user as
        | { id?: string; role?: string | null }
        | undefined

    if (!session || !user?.id || user.role !== "admin") {
        return null
    }

    return user
}

export function serializeMongo<T extends { _id: unknown }>(document: T) {
    const { _id, ...rest } = document

    return { ...rest, id: String(_id) }
}

export const adminDb = db
