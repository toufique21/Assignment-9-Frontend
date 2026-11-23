"use client"

import { useEffect, useSyncExternalStore } from "react"

import {
    activateAdminWorkspace,
    getServerSnapshot,
    getSnapshot,
    subscribe,
} from "@/lib/admin-data"

export function useAdminWorkspace() {
    useEffect(() => {
        void activateAdminWorkspace()
    }, [])

    const workspace = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )

    return {
        workspace,
        error: workspace.error,
        isPending: workspace.loading,
        isReady: workspace.loaded,
    }
}
