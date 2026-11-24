import { apiFetch, getErrorMessage } from "@/lib/api-client"

export type ApplicationStatus = "pending" | "accepted" | "rejected"

export type StudentApplication = {
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
    studentName: string
    plan: "free" | "pro"
    applications: StudentApplication[]
    loading: boolean
    error: string | null
}

const serverWorkspace: Workspace = {
    email: "",
    studentName: "",
    plan: "free",
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

/** Loads the signed-in student's applications from the Express API. */
export async function activateWorkspace(
    email: string,
    studentName: string,
    plan: "free" | "pro",
    force = false
) {
    if (!email) return

    if (
        !force &&
        current.email === email &&
        current.studentName === studentName &&
        current.plan === plan
    ) {
        return
    }

    const requestId = ++activeRequest
    const query = `?studentEmail=${encodeURIComponent(email)}`

    emit({
        email,
        studentName,
        plan,
        applications: [],
        loading: true,
        error: null,
    })

    try {
        const applications =
            await apiFetch<StudentApplication[]>(`/applications${query}`)

        if (requestId !== activeRequest) return

        emit({
            email,
            studentName,
            plan,
            applications,
            loading: false,
            error: null,
        })
    } catch (error) {
        if (requestId !== activeRequest) return

        emit({
            email,
            studentName,
            plan,
            applications: [],
            loading: false,
            error: getErrorMessage(error),
        })
    }
}

export function reloadWorkspace() {
    const { email, studentName, plan } = current

    if (email) {
        void activateWorkspace(email, studentName, plan, true)
    }
}

export async function cancelApplication(id: string) {
    await apiFetch<{ ok: boolean }>(`/applications/${id}`, {
        method: "DELETE",
    })

    emit({
        ...current,
        applications: current.applications.filter(
            (application) => application.id !== id
        ),
    })
}
