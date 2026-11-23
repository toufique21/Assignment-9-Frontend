"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import type { ReactNode } from "react"

type Toast = {
    id: number
    message: string
    tone: "success" | "error"
}

type ToastContextValue = {
    notify: (message: string, tone?: Toast["tone"]) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/** Small, dependency-free toast host shared by the whole app. */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const nextId = useRef(0)
    const timers = useRef<number[]>([])

    useEffect(() => {
        const pending = timers.current

        return () => pending.forEach(window.clearTimeout)
    }, [])

    const dismiss = useCallback((id: number) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const notify = useCallback(
        (message: string, tone: Toast["tone"] = "success") => {
            const id = ++nextId.current
            setToasts((current) => [...current, { id, message, tone }])
            timers.current.push(window.setTimeout(() => dismiss(id), 3200))
        },
        [dismiss]
    )

    const value = useMemo(() => ({ notify }), [notify])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                aria-live="polite"
                role="status"
                className="pointer-events-none fixed right-5 bottom-5 z-[100] flex w-[min(22rem,calc(100vw-2.5rem))] flex-col gap-2"
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="glass-surface pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium"
                    >
                        {toast.tone === "success" ? (
                            <CheckCircle2 className="size-5 shrink-0 text-[#34c759]" />
                        ) : (
                            <XCircle className="size-5 shrink-0 text-destructive" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider")
    }

    return context
}
