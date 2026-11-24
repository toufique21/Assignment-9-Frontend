"use client"

import {
    BookOpen,
    CalendarDays,
    Mail,
    Search,
    Trash2,
    Wallet,
} from "lucide-react"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button, ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useStudentWorkspace } from "@/hooks/use-student-workspace"
import { getErrorMessage } from "@/lib/api-client"
import { formatDate, formatMonthlyFee } from "@/lib/format"
import { cancelApplication, reloadWorkspace } from "@/lib/student-data"

const filters = ["all", "pending", "accepted", "rejected"] as const

type Filter = (typeof filters)[number]

export default function MyApplicationsPage() {
    const { workspace, error, isPending, isReady } = useStudentWorkspace()
    const { notify } = useToast()
    const [filter, setFilter] = useState<Filter>("all")
    const [search, setSearch] = useState("")
    const [busyId, setBusyId] = useState<string | null>(null)

    if (isPending || !isReady) {
        return (
            <div className="grid gap-4 lg:grid-cols-2">
                {[0, 1].map((item) => (
                    <Skeleton key={item} className="h-72 rounded-3xl" />
                ))}
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={reloadWorkspace} />
    }

    const visibleApplications = workspace.applications.filter((application) => {
        const matchesFilter =
            filter === "all" || application.status === filter
        const query = search.trim().toLowerCase()
        const matchesSearch =
            !query ||
            application.tuitionTitle.toLowerCase().includes(query) ||
            application.subject.toLowerCase().includes(query) ||
            (application.tutorName ?? "").toLowerCase().includes(query) ||
            application.tutorEmail.toLowerCase().includes(query)

        return matchesFilter && matchesSearch
    })

    async function handleCancel(id: string, tuitionTitle: string) {
        const confirmed = window.confirm(
            `Cancel your application for "${tuitionTitle}"? This cannot be undone.`
        )

        if (!confirmed) return

        setBusyId(id)

        try {
            await cancelApplication(id)
            notify("Application cancelled.")
        } catch (cancelError) {
            notify(getErrorMessage(cancelError), "error")
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div className="space-y-5">
            <div className="glass-surface flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <p className="px-1 text-sm text-muted-foreground">
                        {workspace.applications.length} application
                        {workspace.applications.length === 1 ? "" : "s"} sent
                    </p>
                    <label className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search tuition or tutor"
                            className="h-9 w-full rounded-2xl border border-white/15 bg-white/60 pr-3 pl-9 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 sm:w-56 dark:bg-white/5"
                        />
                    </label>
                </div>
                <div className="flex flex-wrap gap-1">
                    {filters.map((option) => (
                        <Button
                            key={option}
                            type="button"
                            size="sm"
                            variant={filter === option ? "default" : "ghost"}
                            onClick={() => setFilter(option)}
                            className="capitalize"
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            </div>

            {visibleApplications.length === 0 ? (
                <div className="glass-surface rounded-3xl p-10 text-center">
                    <h2 className="font-heading text-lg font-semibold">
                        No applications here
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {workspace.applications.length === 0
                            ? "Find a tuition batch and send your first application."
                            : "No applications match your current filters."}
                    </p>
                    <ButtonLink href="/tuitions" size="sm" className="mt-5">
                        Find tuitions
                    </ButtonLink>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {visibleApplications.map((application) => (
                        <article
                            key={application.id}
                            className="glass-surface flex h-full flex-col gap-4 rounded-3xl p-5"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="font-heading truncate text-lg font-semibold">
                                        {application.tuitionTitle}
                                    </h2>
                                    <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground">
                                        <BookOpen className="size-4 shrink-0" />
                                        {application.subject}
                                    </p>
                                </div>
                                <StatusBadge status={application.status} />
                            </div>

                            <div className="grid gap-2 text-sm text-muted-foreground">
                                <p className="inline-flex items-center gap-2">
                                    <Mail className="size-4 shrink-0" />
                                    <span className="truncate">
                                        {application.tutorName ??
                                            "MentorLagbe Tutor"}{" "}
                                        · {application.tutorEmail}
                                    </span>
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <Wallet className="size-4 shrink-0" />
                                    {formatMonthlyFee(application.monthlyFee)}/month
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <CalendarDays className="size-4 shrink-0" />
                                    Applied {formatDate(application.appliedAt)}
                                </p>
                            </div>

                            {application.preferredSchedule ? (
                                <div className="rounded-2xl bg-[var(--glass-tint-soft)] p-3 text-sm">
                                    <p className="text-xs font-semibold text-muted-foreground">
                                        Preferred schedule
                                    </p>
                                    <p className="mt-1">
                                        {application.preferredSchedule}
                                    </p>
                                </div>
                            ) : null}

                            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                                <p className="text-xs text-muted-foreground">
                                    {application.status === "pending"
                                        ? "You can cancel while it is pending."
                                        : "Status is final for this application."}
                                </p>
                                {application.status === "pending" ? (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        disabled={busyId === application.id}
                                        onClick={() =>
                                            handleCancel(
                                                application.id,
                                                application.tuitionTitle
                                            )
                                        }
                                    >
                                        <Trash2 />
                                        Cancel application
                                    </Button>
                                ) : null}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
