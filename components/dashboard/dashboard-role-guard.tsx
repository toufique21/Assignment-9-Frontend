"use client"

import { ShieldAlert } from "lucide-react"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { ButtonLink } from "@/components/ui/button"
import type { UserRole } from "@/lib/roles"

export function DashboardRoleGuard({
    role,
    children,
}: {
    role: UserRole
    children: ReactNode
}) {
    const pathname = usePathname()
    const section = pathname.split("/")[2]
    const requiredRole: UserRole | null =
        section === "admin" || section === "tutor" || section === "student"
            ? section
            : null
    const allowed = requiredRole === null || role === requiredRole

    if (allowed) return children

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
                    This area is for {label.toLowerCase()} accounts. Switch to
                    the right account or return to the homepage.
                </p>
                <ButtonLink href="/" className="w-full">
                    Back to homepage
                </ButtonLink>
            </div>
        </div>
    )
}
