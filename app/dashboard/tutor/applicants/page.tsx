"use client"

import { CalendarDays, Mail, Phone, UserRound } from "lucide-react"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useTutorWorkspace } from "@/hooks/use-tutor-workspace"
import { getErrorMessage } from "@/lib/api-client"
import { formatMonthlyFee } from "@/lib/format"
import {
    updateApplicationStatus,
    type ApplicationStatus,
} from "@/lib/tutor-data"

const filters: ("all" | ApplicationStatus)[] = [
    "all",
    "pending",
    "accepted",
    "rejected",
]

export default function ApplicantsPage() {
    const { workspace, error, isPending, isReady } = useTutorWorkspace()
    const { notify } = useToast()
    const [filter, setFilter] = useState<(typeof filters)[number]>("all")

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
        return <ErrorState message={error} />
    }

    const visibleApplications =
        filter === "all"
            ? workspace.applications
            : workspace.applications.filter(
                  (application) => application.status === filter
              )

    async function changeStatus(id: string, status: ApplicationStatus) {
        try {
            await updateApplicationStatus(id, status)
            notify(
                status === "accepted"
                    ? "Application accepted."
                    : status === "rejected"
                      ? "Application rejected."
                      : "Application reset to pending."
            )
        } catch (error) {
            notify(getErrorMessage(error), "error")
        }
    }

    return (
        <div className="space-y-5">
            <div className="glass-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3">
                <p className="px-1 text-sm text-muted-foreground">
                    {workspace.applications.length} application
                    {workspace.applications.length === 1 ? "" : "s"} received
                </p>
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
                        Student applications for your tuitions will appear here.
                    </p>
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
                                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                        {application.tuitionTitle}
                                    </p>
                                    <h2 className="font-heading mt-1 text-lg font-semibold">
                                        {application.studentName}
                                    </h2>
                                </div>
                                <StatusBadge status={application.status} />
                            </div>

                            <div className="grid gap-2 text-sm text-muted-foreground">
                                <p className="inline-flex items-center gap-2">
                                    <Mail className="size-4 shrink-0" />
                                    <span className="truncate">
                                        {application.studentEmail}
                                    </span>
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <Phone className="size-4 shrink-0" />
                                    {application.studentPhone}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <CalendarDays className="size-4 shrink-0" />
                                    {application.preferredSchedule}
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <UserRound className="size-4 shrink-0" />
                                    {application.subject} ·{" "}
                                    {formatMonthlyFee(application.monthlyFee)}/month
                                </p>
                            </div>

                            <div className="rounded-2xl bg-[var(--glass-tint-soft)] p-3 text-sm">
                                <p className="text-xs font-semibold text-muted-foreground">
                                    Student note
                                </p>
                                <p className="mt-1">
                                    {application.studentNote || "—"}
                                </p>
                            </div>

                            {filter === "all" ? null : (
                                <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                                    {filter === "pending" ? (
                                        <>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() =>
                                                    changeStatus(
                                                        application.id,
                                                        "accepted"
                                                    )
                                                }
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    changeStatus(
                                                        application.id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                                filter === "accepted"
                                                    ? "default"
                                                    : "destructive"
                                            }
                                            disabled
                                        >
                                            {filter === "accepted"
                                                ? "Approved"
                                                : "Rejected"}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
