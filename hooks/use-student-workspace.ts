"use client"

import { useEffect, useSyncExternalStore } from "react"

import { useSession } from "@/lib/auth-client"
import {
    activateWorkspace,
    getServerSnapshot,
    getSnapshot,
    subscribe,
} from "@/lib/student-data"

type SessionUser = {
    name?: string | null
    email?: string | null
    plan?: string | null
}

export function useStudentWorkspace() {
    const session = useSession()
    const user = session.data?.user as SessionUser | undefined
    const email = user?.email ?? ""
    const studentName = user?.name ?? "Student"
    const plan: "free" | "pro" = user?.plan === "pro" ? "pro" : "free"

    useEffect(() => {
        void activateWorkspace(email, studentName, plan)
    }, [email, studentName, plan])

    const workspace = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )

    return {
        workspace,
        error: workspace.error,
        isPending: session.isPending || workspace.loading,
        isReady: Boolean(email) && workspace.email === email && !workspace.loading,
    }
}
