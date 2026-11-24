export type TutorProfile = {
    id: string
    name: string
    email: string
    image?: string
    role?: string
    bio?: string
    phone?: string
    createdAt?: string
}

export type Tuition = {
    id: string
    title: string
    subject: string
    classLevel: string
    mode: "Online" | "Offline"
    location: string
    monthlyFee: number
    daysPerWeek: number
    bannerImage: string
    description: string
    tutorName: string
    tutorEmail: string
    tutorProfile?: TutorProfile | null
    approvalStatus: "pending" | "approved" | "rejected"
    isActive: boolean
    createdAt: string
}

function asString(value: unknown, fallback = "") {
    return typeof value === "string" || typeof value === "number"
        ? String(value)
        : fallback
}

function asNumber(value: unknown) {
    const number = Number(value)

    return Number.isFinite(number) ? number : 0
}

function toTutorProfile(value: unknown): TutorProfile | null {
    if (!value || typeof value !== "object") return null

    const raw = value as Record<string, unknown>
    const id = asString(raw._id ?? raw.id)
    const name = asString(raw.name)
    const email = asString(raw.email)

    if (!id && !name && !email) return null

    return {
        id,
        name: name || email || "MentorLagbe Tutor",
        email,
        image: asString(raw.image) || undefined,
        role: asString(raw.role) || undefined,
        bio: asString(raw.bio) || undefined,
        phone: asString(raw.phone) || undefined,
        createdAt: asString(raw.createdAt) || undefined,
    }
}

export function toTuition(value: unknown, index: number): Tuition {
    const raw = (value ?? {}) as Record<string, unknown>
    const status = asString(raw.approvalStatus)

    return {
        id: asString(raw._id ?? raw.id, `tuition-${index}`),
        title: asString(raw.title, "Untitled tuition"),
        subject: asString(raw.subject, "General"),
        classLevel: asString(raw.classLevel, "All Levels"),
        mode: raw.mode === "Offline" ? "Offline" : "Online",
        location: asString(raw.location, "Remote"),
        monthlyFee: asNumber(raw.monthlyFee),
        daysPerWeek: asNumber(raw.daysPerWeek),
        bannerImage: asString(raw.bannerImage),
        description: asString(raw.description),
        tutorName: asString(raw.tutorName, "MentorLagbe Tutor"),
        tutorEmail: asString(raw.tutorEmail),
        tutorProfile: toTutorProfile(raw.tutorProfile),
        approvalStatus:
            status === "pending" || status === "rejected" ? status : "approved",
        isActive: raw.isActive !== false,
        createdAt: asString(raw.createdAt),
    }
}

/** Returns the six newest approved and active tuitions from the live API. */
export async function getFeaturedTuitions(): Promise<Tuition[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) return []

    try {
        const endpoint = `${apiUrl.replace(/\/$/, "")}/tuitions?approvalStatus=approved&isActive=true&limit=6`
        const response = await fetch(endpoint)

        if (!response.ok) return []

        const payload: unknown = await response.json()
        const list = Array.isArray(payload)
            ? payload
            : (payload as { data?: unknown }).data

        if (!Array.isArray(list)) return []

        return list
            .map(toTuition)
            .filter(
                (tuition) =>
                    tuition.approvalStatus === "approved" && tuition.isActive
            )
            .sort(
                (a, b) =>
                    (Date.parse(b.createdAt) || 0) -
                    (Date.parse(a.createdAt) || 0)
            )
            .slice(0, 6)
    } catch {
        return []
    }
}
