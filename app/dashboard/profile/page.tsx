"use client"

import { ProfilePanel, type ProfileUser } from "@/components/dashboard/profile-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient } from "@/lib/auth-client"

export default function ProfilePage() {
    const session = authClient.useSession()
    const user = session.data?.user as ProfileUser | undefined

    if (session.isPending || !user) {
        return (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
                <Skeleton className="h-[30rem] rounded-3xl" />
                <Skeleton className="h-[30rem] rounded-3xl" />
            </div>
        )
    }

    return <ProfilePanel key={user.id} user={user} />
}
