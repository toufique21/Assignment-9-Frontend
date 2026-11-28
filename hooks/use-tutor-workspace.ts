"use client"

import { useEffect, useSyncExternalStore } from "react"

import { useSession } from "@/lib/auth-client"
import {
    activateWorkspace,
    getServerSnapshot,
    getSnapshot,
    subscribe,
} from "@/lib/tutor-data"

type SessionUser = {
    name?: string | null
    email?: string | null
    plan?: string | null
}

export function useTutorWorkspace() {
    const session = useSession()
    const user = session.data?.user as SessionUser | undefined
    const email = user?.email ?? ""
    const tutorName = user?.name ?? "Tutor"
    const plan: "free" | "pro" = user?.plan === "pro" ? "pro" : "free"

    useEffect(() => {
        void activateWorkspace(email, tutorName, plan)
    }, [email, tutorName, plan])

    const workspace = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )

    return {
        workspace,
        error: workspace.error,
        isPending: session.isPending || workspace.loading,
        isReady:
            Boolean(email) &&
            workspace.email === email &&
            !workspace.loading,
    }
}
