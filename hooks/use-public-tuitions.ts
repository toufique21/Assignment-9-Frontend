"use client"

import { useEffect, useSyncExternalStore } from "react"

import {
    activatePublicTuitions,
    getServerSnapshot,
    getSnapshot,
    subscribe,
} from "@/lib/browse-data"

export function usePublicTuitions() {
    useEffect(() => {
        void activatePublicTuitions()
    }, [])

    const workspace = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    )

    return {
        workspace,
        tuitions: workspace.tuitions,
        error: workspace.error,
        isPending: workspace.loading,
        isReady: workspace.loaded,
    }
}
