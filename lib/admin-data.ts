import { apiFetch, getErrorMessage } from "@/lib/api-client"
import type { UserRole } from "@/lib/roles"
import type { Tuition } from "@/lib/tuitions"

export type AdminSummary = {
    totalUsers: number
    totalTutors: number
    pendingTuitions: number
    approvedTuitions: number
    totalRevenue: number
}

export type AdminUser = {
    id: string
    name: string
    email: string
    image?: string | null
    role: UserRole
    plan: "free" | "pro"
    phone?: string
    bio?: string
    createdAt?: string
    emailVerified?: boolean | null
}

export type AdminTransaction = {
    id: string
    userEmail: string
    userName: string
    userRole: UserRole
    planName: string
    amount: number
    currency: string
    transactionId: string
    stripeSessionId?: string
    paymentStatus: string
    paidAt: string
}

export type AdminWorkspace = {
    summary: AdminSummary
    users: AdminUser[]
    tuitions: Tuition[]
    transactions: AdminTransaction[]
    loading: boolean
    loaded: boolean
    error: string | null
}

const emptySummary: AdminSummary = {
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalRevenue: 0,
}

const serverWorkspace: AdminWorkspace = {
    summary: emptySummary,
    users: [],
    tuitions: [],
    transactions: [],
    loading: true,
    loaded: false,
    error: null,
}

let current: AdminWorkspace = serverWorkspace
const listeners = new Set<() => void>()
let activeRequest = 0

function emit(next: AdminWorkspace) {
    current = next
    listeners.forEach((listener) => listener())
}

function withCounts(
    workspace: AdminWorkspace,
    users: AdminUser[],
    tuitions: Tuition[]
): AdminSummary {
    return {
        ...workspace.summary,
        totalUsers: users.length,
        totalTutors: users.filter((user) => user.role === "tutor").length,
        pendingTuitions: tuitions.filter(
            (tuition) => tuition.approvalStatus === "pending"
        ).length,
        approvedTuitions: tuitions.filter(
            (tuition) => tuition.approvalStatus === "approved"
        ).length,
    }
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

/** Loads all admin dashboard data through the protected Next.js admin routes. */
export async function activateAdminWorkspace(force = false) {
    if (!force && current.loaded) return

    const requestId = ++activeRequest

    emit({
        ...current,
        loading: true,
        error: null,
    })

    try {
        const [summary, users, tuitions, transactions] = await Promise.all([
            apiFetch<AdminSummary>("/api/admin/summary"),
            apiFetch<AdminUser[]>("/api/admin/users"),
            apiFetch<Tuition[]>("/api/admin/tuitions"),
            apiFetch<AdminTransaction[]>("/api/admin/transactions"),
        ])

        if (requestId !== activeRequest) return

        emit({
            summary,
            users,
            tuitions,
            transactions,
            loading: false,
            loaded: true,
            error: null,
        })
    } catch (error) {
        if (requestId !== activeRequest) return

        emit({
            ...current,
            loading: false,
            loaded: false,
            error: getErrorMessage(error),
        })
    }
}

export function reloadAdminWorkspace() {
    void activateAdminWorkspace(true)
}

export async function updateUserRole(id: string, role: UserRole) {
    const updated = await apiFetch<AdminUser>(`/api/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    })

    const users = current.users.map((user) => (user.id === id ? updated : user))

    emit({
        ...current,
        users,
        summary: withCounts(current, users, current.tuitions),
    })
}

export async function updateTuitionApproval(
    id: string,
    approvalStatus: "approved" | "rejected"
) {
    const updated = await apiFetch<Tuition>(`/api/admin/tuitions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
    })

    const tuitions = current.tuitions.map((tuition) =>
        tuition.id === id ? updated : tuition
    )

    emit({
        ...current,
        tuitions,
        summary: withCounts(current, current.users, tuitions),
    })
}
