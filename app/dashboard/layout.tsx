"use client"

import { ShieldAlert } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"
import { getRole, type UserRole } from "@/lib/roles"

export default function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = authClient.useSession()
    const router = useRouter()
    const pathname = usePathname()
    const user = session.data?.user as { role?: string | null } | undefined
    const isSignedIn = Boolean(user)
    const role = getRole(user?.role)

    const section = pathname.split("/")[2]
    const requiredRole: UserRole | null =
        section === "admin" || section === "tutor" || section === "student"
            ? section
            : null
    const allowed = requiredRole === null || role === requiredRole

    useEffect(() => {
        if (!session.isPending && !isSignedIn) {
            router.replace("/sign-in")
        }
    }, [session.isPending, isSignedIn, router])

    if (session.isPending || !isSignedIn) {
        return (
            <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-8 sm:px-6 lg:px-8">
                <Skeleton className="h-16 rounded-2xl" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-32 rounded-3xl" />
                    ))}
                </div>
                <Skeleton className="h-72 rounded-3xl" />
            </div>
        )
    }

    if (!allowed) {
        const label = requiredRole
            ? requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)
            : "Authorized"

        return (
            <div className="mx-auto flex w-full max-w-md px-4 py-20">
                <div className="glass-surface w-full space-y-4 rounded-3xl p-8 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                        <ShieldAlert className="size-5" />
                    </span>
                    <h1 className="font-heading text-xl font-semibold">
                        {label}s only
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        This area is for {label.toLowerCase()} accounts. Switch
                        to the right account or return to the homepage.
                    </p>
                    <ButtonLink href="/" className="w-full">
                        Back to homepage
                    </ButtonLink>
                </div>
            </div>
        )
    }

    return <DashboardShell>{children}</DashboardShell>
}
