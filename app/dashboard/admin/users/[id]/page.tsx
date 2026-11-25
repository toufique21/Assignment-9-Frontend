"use client"

import { ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

import { ErrorState } from "@/components/dashboard/error-state"
import {
    ProfilePanel,
    type ProfileUser,
} from "@/components/dashboard/profile-panel"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminWorkspace } from "@/hooks/use-admin-workspace"
import { reloadAdminWorkspace } from "@/lib/admin-data"

export default function AdminUserProfilePage() {
    const { id } = useParams<{ id: string }>()
    const { workspace, error, isPending, isReady } = useAdminWorkspace()

    if (isPending || !isReady) {
        return (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
                <Skeleton className="h-[30rem] rounded-3xl" />
                <Skeleton className="h-[30rem] rounded-3xl" />
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={reloadAdminWorkspace} />
    }

    const user = workspace.users.find((item) => item.id === id)

    if (!user) {
        return (
            <div className="glass-surface mx-auto max-w-md rounded-3xl p-8 text-center">
                <h1 className="font-heading text-xl font-semibold">
                    User not found
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    This account may have been removed or the link is invalid.
                </p>
                <ButtonLink
                    href="/dashboard/admin/users"
                    variant="secondary"
                    className="mt-6 w-full"
                >
                    <ArrowLeft />
                    Back to users
                </ButtonLink>
            </div>
        )
    }

    const profileUser: ProfileUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        plan: user.plan,
        phone: user.phone,
        bio: user.bio,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-heading text-xl font-semibold">
                        {user.name}&apos;s profile
                    </h1>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                        Read-only view. Role changes are managed from the users
                        list.
                    </p>
                </div>
                <ButtonLink
                    href="/dashboard/admin/users"
                    variant="secondary"
                    size="sm"
                >
                    <ArrowLeft />
                    Back to users
                </ButtonLink>
            </div>

            <ProfilePanel key={user.id} user={profileUser} readOnly />
        </div>
    )
}
