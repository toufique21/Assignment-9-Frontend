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
    approvalStatus: "pending" | "approved" | "rejected"
    isActive: boolean
    createdAt: string
}

const sampleTuitions: Tuition[] = [
    {
        id: "sample-1",
        title: "HSC Mathematics Mastery Batch",
        subject: "Mathematics",
        classLevel: "Class 11–12",
        mode: "Online",
        location: "Dhaka",
        monthlyFee: 4500,
        daysPerWeek: 3,
        bannerImage:
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
        description: "Exam-focused problem solving with weekly mock tests.",
        tutorName: "Rahim Ahmed",
        tutorEmail: "rahim@example.com",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2026-11-18T09:00:00.000Z",
    },
    {
        id: "sample-2",
        title: "Physics for HSC & Engineering",
        subject: "Physics",
        classLevel: "Class 11–12",
        mode: "Offline",
        location: "Dhaka",
        monthlyFee: 6000,
        daysPerWeek: 4,
        bannerImage:
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
        description: "Concept building with lab-style practical sessions.",
        tutorName: "Sadia Karim",
        tutorEmail: "sadia@example.com",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2026-11-17T09:00:00.000Z",
    },
    {
        id: "sample-3",
        title: "Full-Stack Web Development",
        subject: "Programming",
        classLevel: "All Levels",
        mode: "Online",
        location: "Remote",
        monthlyFee: 8500,
        daysPerWeek: 2,
        bannerImage:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        description: "Build and deploy real projects with modern JavaScript.",
        tutorName: "Tanvir Rahman",
        tutorEmail: "tanvir@example.com",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2026-11-16T09:00:00.000Z",
    },
    {
        id: "sample-4",
        title: "IELTS Intensive: Target 7.0+",
        subject: "IELTS",
        classLevel: "All Levels",
        mode: "Online",
        location: "Remote",
        monthlyFee: 5000,
        daysPerWeek: 4,
        bannerImage:
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
        description: "Speaking, writing and mock exams with personal feedback.",
        tutorName: "Nadia Islam",
        tutorEmail: "nadia@example.com",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2026-11-15T09:00:00.000Z",
    },
    {
        id: "sample-5",
        title: "Chemistry for Class 9–10",
        subject: "Chemistry",
        classLevel: "Class 9–10",
        mode: "Offline",
        location: "Chattogram",
        monthlyFee: 3500,
        daysPerWeek: 2,
        bannerImage:
            "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
        description: "Board-aligned lessons with formula practice and quizzes.",
        tutorName: "Karim Sheikh",
        tutorEmail: "karim@example.com",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2026-11-14T09:00:00.000Z",
    },
    {
        id: "sample-6",
        title: "Spoken English Confidence Club",
        subject: "English",
        classLevel: "All Levels",
        mode: "Online",
        location: "Remote",
        monthlyFee: 3000,
        daysPerWeek: 3,
        bannerImage:
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
        description: "Small-group speaking practice with friendly corrections.",
        tutorName: "Jubair Hasan",
        tutorEmail: "jubair@example.com",
        approvalStatus: "approved",
        isActive: true,
        createdAt: "2026-11-13T09:00:00.000Z",
    },
]

function asString(value: unknown, fallback = "") {
    return typeof value === "string" || typeof value === "number"
        ? String(value)
        : fallback
}

function asNumber(value: unknown) {
    const number = Number(value)

    return Number.isFinite(number) ? number : 0
}

function toTuition(value: unknown, index: number): Tuition {
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
        approvalStatus:
            status === "pending" || status === "rejected" ? status : "approved",
        isActive: raw.isActive !== false,
        createdAt: asString(raw.createdAt),
    }
}

/**
 * Returns the six newest approved tuitions. Uses the Express API when
 * configured and falls back to sample data while the backend is being built.
 */
export async function getFeaturedTuitions(): Promise<Tuition[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) return sampleTuitions

    try {
        const endpoint = `${apiUrl.replace(/\/$/, "")}/tuitions?approvalStatus=approved&isActive=true&limit=6`
        const response = await fetch(endpoint)

        if (!response.ok) return sampleTuitions

        const payload: unknown = await response.json()
        const list = Array.isArray(payload)
            ? payload
            : (payload as { data?: unknown }).data

        if (!Array.isArray(list) || list.length === 0) return sampleTuitions

        return list
            .map(toTuition)
            .filter((tuition) => tuition.approvalStatus === "approved" && tuition.isActive)
            .sort(
                (a, b) =>
                    (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
            )
            .slice(0, 6)
    } catch {
        return sampleTuitions
    }
}
