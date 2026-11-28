"use client"

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import type { ReactNode } from "react"

export type SessionUser = {
    id?: string
    name?: string | null
    email?: string | null
    role?: string | null
    plan?: string | null
    image?: string | null
    phone?: string | null
    bio?: string | null
}

export type SessionPayload = {
    session: Record<string, unknown> | null
    user: SessionUser
}

export type SessionState = {
    data: SessionPayload | null
    error: unknown
    isPending: boolean
    isRefetching: boolean
    refetch: () => Promise<void>
}

const SessionContext = createContext<SessionState | null>(null)

export function SessionProvider({
    initialData,
    children,
}: {
    initialData: SessionPayload | null
    children: ReactNode
}) {
    const [state, setState] = useState<SessionState>({
        data: initialData,
        error: null,
        isPending: !initialData,
        isRefetching: false,
        refetch: async () => {},
    })

    const refetch = useCallback(async () => {
        setState((current) => ({
            ...current,
            isPending: current.data === null,
            isRefetching: true,
            error: null,
        }))

        try {
            const response = await fetch("/api/auth/get-session", {
                credentials: "include",
                cache: "no-store",
            })
            const payload: unknown = await response.json()

            setState((current) => ({
                ...current,
                data:
                    payload && typeof payload === "object" && "user" in payload
                        ? (payload as SessionPayload)
                        : null,
                error: null,
                isPending: false,
                isRefetching: false,
            }))
        } catch (error) {
            setState((current) => ({
                ...current,
                error,
                isPending: false,
                isRefetching: false,
            }))
        }
    }, [])

    useEffect(() => {
        setState((current) => ({
            ...current,
            data: initialData,
            error: null,
            isPending: !initialData,
            isRefetching: false,
        }))

        if (!initialData) {
            void refetch()
        }
    }, [initialData, refetch])

    const value = useMemo<SessionState>(
        () => ({ ...state, refetch }),
        [state, refetch]
    )

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}

export function useSession() {
    const session = useContext(SessionContext)

    if (!session) {
        throw new Error("useSession must be used inside SessionProvider")
    }

    return session
}
