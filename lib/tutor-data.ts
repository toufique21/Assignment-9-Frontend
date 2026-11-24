import { apiFetch, getErrorMessage } from "@/lib/api-client"
import type { Tuition } from "@/lib/tuitions"

export type TuitionInput = Pick<
    Tuition,
    | "title"
    | "subject"
    | "classLevel"
    | "mode"
    | "location"
    | "monthlyFee"
    | "daysPerWeek"
    | "bannerImage"
    | "description"
>

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export type Application = {
    id: string
    tuitionId: string
    tuitionTitle: string
    subject: string
    monthlyFee: number
    tutorEmail: string
    tutorName?: string
    studentName: string
    studentEmail: string
    studentPhone: string
    preferredSchedule: string
    studentNote: string
    status: ApplicationStatus
    appliedAt: string
}

export type Workspace = {
    email: string
    tutorName: string
    plan: "free" | "pro"
    tuitions: Tuition[]
    applications: Application[]
    loading: boolean
    error: string | null
}

const serverWorkspace: Workspace = {
    email: "",
    tutorName: "",
    plan: "free",
    tuitions: [],
    applications: [],
    loading: true,
    error: null,
}

let current: Workspace = serverWorkspace
const listeners = new Set<() => void>()
let activeRequest = 0

function emit(next: Workspace) {
    current = next
    listeners.forEach((listener) => listener())
}

function requireEmail() {
    if (!current.email) {
        throw new Error("Tutor workspace is not ready yet.")
    }

    return current.email
}

export function subscribe(listener: () => void) {
    listeners.add(listener)

    return () => {
        listeners.delete(listener)
    }
}

export function getSnapshot() {
    return current
}

export function getServerSnapshot() {
    return serverWorkspace
}

/** Loads the signed-in tutor's tuitions and applications from the Express API. */
export async function activateWorkspace(
    email: string,
    tutorName: string,
    plan: "free" | "pro",
    force = false
) {
    if (!email) return

    if (
        !force &&
        current.email === email &&
        current.tutorName === tutorName &&
        current.plan === plan
    ) {
        return
    }

    const requestId = ++activeRequest
    const query = `?tutorEmail=${encodeURIComponent(email)}`

    emit({
        email,
        tutorName,
        plan,
        tuitions: [],
        applications: [],
        loading: true,
        error: null,
    })

    try {
        const [tuitions, applications] = await Promise.all([
            apiFetch<Tuition[]>(`/tuitions${query}`),
            apiFetch<Application[]>(`/applications${query}`),
        ])

        if (requestId !== activeRequest) return

        emit({
            email,
            tutorName,
            plan,
            tuitions,
            applications,
            loading: false,
            error: null,
        })
    } catch (error) {
        if (requestId !== activeRequest) return

        emit({
            email,
            tutorName,
            plan,
            tuitions: [],
            applications: [],
            loading: false,
            error: getErrorMessage(error),
        })
    }
}

export function reloadWorkspace() {
    const { email, tutorName, plan } = current

    if (email) {
        void activateWorkspace(email, tutorName, plan, true)
    }
}

export function canPostTuition(workspace: Workspace) {
    return workspace.plan === "pro" || workspace.tuitions.length < 2
}

export async function createTuition(input: TuitionInput) {
    const tutorEmail = requireEmail()

    const tuition = await apiFetch<Tuition>("/tuitions", {
        method: "POST",
        body: JSON.stringify({
            ...input,
            tutorEmail,
            tutorName: current.tutorName,
        }),
    })

    emit({ ...current, tuitions: [tuition, ...current.tuitions] })
}

export async function updateTuition(id: string, input: TuitionInput) {
    const tuition = await apiFetch<Tuition>(`/tuitions/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
    })

    emit({
        ...current,
        tuitions: current.tuitions.map((item) =>
            item.id === id ? tuition : item
        ),
    })
}

export async function deleteTuition(id: string) {
    await apiFetch<{ ok: boolean }>(`/tuitions/${id}`, { method: "DELETE" })

    emit({
        ...current,
        tuitions: current.tuitions.filter((tuition) => tuition.id !== id),
        applications: current.applications.filter(
            (application) => application.tuitionId !== id
        ),
    })
}

export async function toggleTuitionStatus(id: string) {
    const tuition = current.tuitions.find((item) => item.id === id)

    if (!tuition) {
        throw new Error("Tuition not found.")
    }

    const updated = await apiFetch<Tuition>(`/tuitions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !tuition.isActive }),
    })

    emit({
        ...current,
        tuitions: current.tuitions.map((item) =>
            item.id === id ? updated : item
        ),
    })
}

export async function updateApplicationStatus(
    id: string,
    status: ApplicationStatus
) {
    const application = await apiFetch<Application>(
        `/applications/${id}/status`,
        {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }
    )

    emit({
        ...current,
        applications: current.applications.map((item) =>
            item.id === id ? application : item
        ),
    })
}
