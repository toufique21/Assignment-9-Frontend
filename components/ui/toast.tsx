"use client"

import { useTheme } from "next-themes"
import type { ReactNode } from "react"
import { Toaster, toast } from "sonner"

type ToastTone = "success" | "error"

function notify(message: string, tone: ToastTone = "success") {
    if (tone === "error") {
        toast.error(message)
        return
    }

    toast.success(message)
}

/** Sonner host shared by the whole app; call sites keep using useToast(). */
export function ToastProvider({ children }: { children: ReactNode }) {
    const { resolvedTheme } = useTheme()

    return (
        <>
            {children}
            <Toaster
                position="bottom-right"
                theme={resolvedTheme === "dark" ? "dark" : "light"}
                richColors
                closeButton
                toastOptions={{ duration: 3200 }}
            />
        </>
    )
}

export function useToast() {
    return { notify }
}
