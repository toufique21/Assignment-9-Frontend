import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

import { DashboardRoleGuard } from "@/components/dashboard/dashboard-role-guard"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { auth } from "@/lib/auth"
import { getRole } from "@/lib/roles"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    const user = session?.user as { id?: string; role?: string | null } | undefined

    if (!user?.id) {
        redirect("/sign-in")
    }

    const role = getRole(user.role)

    return (
        <DashboardRoleGuard role={role}>
            <DashboardShell role={role}>{children}</DashboardShell>
        </DashboardRoleGuard>
    )
}
