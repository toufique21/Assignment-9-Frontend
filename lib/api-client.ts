const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

async function getBackendToken() {
    if (typeof window === "undefined") return ""

    try {
        const response = await fetch("/api/auth/token", { cache: "no-store" })

        if (!response.ok) return ""

        const payload: unknown = await response.json()

        return (payload as { token?: string })?.token ?? ""
    } catch {
        return ""
    }
}

export async function apiFetch<T>(
    path: string,
    init?: RequestInit
): Promise<T> {
    const isLocalRoute = path.startsWith("/api/")

    if (!isLocalRoute && !baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.")
    }

    const url = isLocalRoute ? path : `${baseUrl}${path}`
    const token = isLocalRoute ? "" : await getBackendToken()

    const response = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...init?.headers,
        },
        cache: "no-store",
    })

    if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null)
        const message = (payload as { message?: string })?.message

        throw new Error(message || `Request failed (${response.status})`)
    }

    return response.json() as Promise<T>
}

export function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Something went wrong."
}
