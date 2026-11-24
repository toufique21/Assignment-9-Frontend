import { apiFetch, getErrorMessage } from "@/lib/api-client"
import { toTuition, type Tuition } from "@/lib/tuitions"

export type PublicTuitionsWorkspace = {
    tuitions: Tuition[]
    loading: boolean
    loaded: boolean
    error: string | null
}

const serverWorkspace: PublicTuitionsWorkspace = {
    tuitions: [],
    loading: true,
    loaded: false,
    error: null,
}

let current: PublicTuitionsWorkspace = serverWorkspace
const listeners = new Set<() => void>()
let activeRequest = 0

function emit(next: PublicTuitionsWorkspace) {
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

/** Loads only tuitions approved by admin and still active from the tutor. */
export async function activatePublicTuitions(force = false) {
    if (!force && current.loaded) return

    const requestId = ++activeRequest

    emit({ ...current, loading: true, error: null })

    try {
        const payload = await apiFetch<unknown>(
            "/tuitions?approvalStatus=approved&isActive=true"
        )
        const list = Array.isArray(payload)
            ? payload
            : (payload as { data?: unknown } | null)?.data

        if (requestId !== activeRequest) return

        const tuitions = (Array.isArray(list) ? list : [])
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

        emit({ tuitions, loading: false, loaded: true, error: null })
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

export function reloadPublicTuitions() {
    void activatePublicTuitions(true)
}

export function findPublicTuition(id: string) {
    return current.tuitions.find((tuition) => tuition.id === id)
}
