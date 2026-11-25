import { createHmac } from "node:crypto"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

export const runtime = "nodejs"

type SessionUser = {
    id?: string
    name?: string | null
    email?: string | null
    role?: string | null
    plan?: string | null
}

function encode(value: object) {
    return Buffer.from(JSON.stringify(value)).toString("base64url")
}

export async function GET() {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = session?.user as SessionUser | undefined

    if (!user?.id || !user.email) {
        return Response.json(
            { message: "Unauthorized." },
            { status: 401, headers: { "Cache-Control": "no-store" } }
        )
    }

    const secret = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET

    if (!secret) {
        return Response.json(
            { message: "JWT secret is not configured." },
            { status: 500, headers: { "Cache-Control": "no-store" } }
        )
    }

    const now = Math.floor(Date.now() / 1000)
    const encodedHeader = encode({ alg: "HS256", typ: "JWT" })
    const encodedPayload = encode({
        id: user.id,
        name: user.name ?? "",
        email: user.email,
        role: user.role ?? "student",
        plan: user.plan ?? "free",
        iat: now,
        exp: now + 60 * 60,
    })
    const signature = createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url")

    return Response.json(
        { token: `${encodedHeader}.${encodedPayload}.${signature}` },
        { headers: { "Cache-Control": "no-store" } }
    )
}
