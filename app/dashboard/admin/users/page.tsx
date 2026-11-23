"use client"

import { Save, Search } from "lucide-react"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useAdminWorkspace } from "@/hooks/use-admin-workspace"
import { authClient } from "@/lib/auth-client"
import {
    reloadAdminWorkspace,
    updateUserRole,
    type AdminUser,
} from "@/lib/admin-data"
import { getErrorMessage } from "@/lib/api-client"
import { formatDate } from "@/lib/format"
import { roles, type UserRole } from "@/lib/roles"

const fieldClass =
    "h-10 rounded-2xl border border-white/15 bg-white/60 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 dark:bg-white/5"

export default function AdminUsersPage() {
    const { workspace, error, isPending, isReady } = useAdminWorkspace()
    const { notify } = useToast()
    const session = authClient.useSession()
    const currentEmail = session.data?.user?.email
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
    const [drafts, setDrafts] = useState<Record<string, UserRole>>({})
    const [savingId, setSavingId] = useState<string | null>(null)

    if (isPending || !isReady) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-14 rounded-2xl" />
                <Skeleton className="h-[28rem] rounded-3xl" />
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={reloadAdminWorkspace} />
    }

    const visibleUsers = workspace.users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        const matchesRole = roleFilter === "all" || user.role === roleFilter

        return matchesSearch && matchesRole
    })

    const changedCount = workspace.users.filter(
        (user) => drafts[user.id] && drafts[user.id] !== user.role
    ).length

    async function handleSave(user: AdminUser) {
        const role = drafts[user.id]

        if (!role || role === user.role) return

        setSavingId(user.id)

        try {
            await updateUserRole(user.id, role)
            setDrafts((current) => {
                const next = { ...current }
                delete next[user.id]
                return next
            })
            notify(`${user.name} is now a ${role}.`)
        } catch (saveError) {
            notify(getErrorMessage(saveError), "error")
        } finally {
            setSavingId(null)
        }
    }

    return (
        <div className="space-y-4">
            <section className="glass-surface rounded-3xl p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-heading text-base font-semibold">
                            Registered users
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {workspace.users.length} accounts · {changedCount} unsaved
                            role changes
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search name or email"
                                className={`${fieldClass} w-full pl-9 sm:w-64`}
                            />
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value as UserRole | "all")
                            }
                            className={fieldClass}
                        >
                            <option value="all">All roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="glass-surface overflow-hidden rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="border-b border-white/10 text-xs tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Current role</th>
                                <th className="px-5 py-3 font-medium">Plan</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3 font-medium">Change role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {visibleUsers.map((user) => {
                                const isSelf = user.email === currentEmail
                                const draftRole = drafts[user.id] ?? user.role
                                const isDirty = draftRole !== user.role

                                return (
                                    <tr key={user.id} className="hover:bg-white/5">
                                        <td className="px-5 py-4">
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={user.role} />
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusBadge status={user.plan} />
                                        </td>
                                        <td className="px-5 py-4 text-xs text-muted-foreground">
                                            {user.createdAt
                                                ? formatDate(user.createdAt)
                                                : "—"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={draftRole}
                                                    disabled={isSelf}
                                                    onChange={(event) =>
                                                        setDrafts((current) => ({
                                                            ...current,
                                                            [user.id]: event.target
                                                                .value as UserRole,
                                                        }))
                                                    }
                                                    className={`${fieldClass} h-9 px-2`}
                                                >
                                                    {roles.map((role) => (
                                                        <option key={role} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    size="icon-sm"
                                                    aria-label={`Save role for ${user.name}`}
                                                    disabled={
                                                        isSelf ||
                                                        !isDirty ||
                                                        savingId === user.id
                                                    }
                                                    onClick={() => handleSave(user)}
                                                >
                                                    <Save />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {!visibleUsers.length ? (
                    <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                        No users match your filters.
                    </p>
                ) : null}
            </section>
        </div>
    )
}
