"use client"

import { Check, Search, X } from "lucide-react"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useAdminWorkspace } from "@/hooks/use-admin-workspace"
import { reloadAdminWorkspace, updateTuitionApproval } from "@/lib/admin-data"
import { getErrorMessage } from "@/lib/api-client"
import { formatDate, formatMonthlyFee } from "@/lib/format"

type Filter = "all" | "pending" | "approved" | "rejected"

const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
]

const fieldClass =
    "h-10 rounded-2xl border border-white/15 bg-white/60 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 dark:bg-white/5"

export default function AdminTuitionsPage() {
    const { workspace, error, isPending, isReady } = useAdminWorkspace()
    const { notify } = useToast()
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<Filter>("pending")
    const [busyId, setBusyId] = useState<string | null>(null)

    if (isPending || !isReady) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-14 rounded-2xl" />
                <div className="grid gap-4 lg:grid-cols-2">
                    {[0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-44 rounded-3xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={reloadAdminWorkspace} />
    }

    const visibleTuitions = workspace.tuitions.filter((tuition) => {
        const matchesFilter =
            filter === "all" || tuition.approvalStatus === filter
        const matchesSearch =
            tuition.title.toLowerCase().includes(search.toLowerCase()) ||
            tuition.tutorName.toLowerCase().includes(search.toLowerCase()) ||
            tuition.subject.toLowerCase().includes(search.toLowerCase())

        return matchesFilter && matchesSearch
    })

    async function handleApproval(id: string, approvalStatus: "approved" | "rejected") {
        setBusyId(id)

        try {
            await updateTuitionApproval(id, approvalStatus)
            notify(
                approvalStatus === "approved"
                    ? "Tuition approved and published."
                    : "Tuition rejected."
            )
        } catch (actionError) {
            notify(getErrorMessage(actionError), "error")
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div className="space-y-4">
            <section className="glass-surface rounded-3xl p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-heading text-base font-semibold">
                            Tuition moderation
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            {workspace.tuitions.length} total submissions
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row lg:items-center">
                        <label className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search title, tutor or subject"
                                className={`${fieldClass} w-full pl-9 sm:w-64`}
                            />
                        </label>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {filters.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setFilter(item.value)}
                                    className={`h-10 shrink-0 rounded-2xl px-4 text-sm font-medium transition ${
                                        filter === item.value
                                            ? "glass-primary"
                                            : "glass-secondary"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {visibleTuitions.length ? (
                <div className="grid gap-4 lg:grid-cols-2">
                    {visibleTuitions.map((tuition) => {
                        const isBusy = busyId === tuition.id
                        const isApproved = tuition.approvalStatus === "approved"
                        const isRejected = tuition.approvalStatus === "rejected"

                        return (
                            <article
                                key={tuition.id}
                                className="glass-surface rounded-3xl p-5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="font-heading truncate text-base font-semibold">
                                            {tuition.title}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {tuition.subject} · {tuition.classLevel} ·{" "}
                                            {tuition.mode}
                                        </p>
                                    </div>
                                    <StatusBadge status={tuition.approvalStatus} />
                                </div>

                                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                                    {tuition.description || "No description provided."}
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Tutor
                                        </p>
                                        <p className="truncate font-medium">
                                            {tuition.tutorName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Monthly fee
                                        </p>
                                        <p className="font-medium">
                                            {formatMonthlyFee(tuition.monthlyFee)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Submitted
                                        </p>
                                        <p className="font-medium">
                                            {tuition.createdAt
                                                ? formatDate(tuition.createdAt)
                                                : "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="font-medium">
                                            {tuition.isActive ? "Active" : "Closed"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        disabled={isBusy || isApproved}
                                        onClick={() => handleApproval(tuition.id, "approved")}
                                    >
                                        <Check />
                                        {isApproved ? "Approved" : "Approve"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        disabled={isBusy || isRejected}
                                        onClick={() => handleApproval(tuition.id, "rejected")}
                                    >
                                        <X />
                                        {isRejected ? "Rejected" : "Reject"}
                                    </Button>
                                </div>
                            </article>
                        )
                    })}
                </div>
            ) : (
                <section className="glass-surface rounded-3xl p-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        No tuitions match this filter.
                    </p>
                </section>
            )}
        </div>
    )
}
