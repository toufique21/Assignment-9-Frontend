"use client"

import {
    CheckCircle2,
    ClipboardList,
    Clock3,
    Compass,
    Crown,
    Sparkles,
} from "lucide-react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ButtonLink } from "@/components/ui/button"
import { PremiumCrown } from "@/components/ui/premium-crown"
import { Skeleton } from "@/components/ui/skeleton"
import { useStudentWorkspace } from "@/hooks/use-student-workspace"
import { formatDate } from "@/lib/format"
import { reloadWorkspace } from "@/lib/student-data"

export default function StudentOverviewPage() {
    const { workspace, error, isPending, isReady } = useStudentWorkspace()

    if (isPending || !isReady) {
        return (
            <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-32 rounded-3xl" />
                    ))}
                </div>
                <Skeleton className="h-64 rounded-3xl" />
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={reloadWorkspace} />
    }

    const accepted = workspace.applications.filter(
        (application) => application.status === "accepted"
    ).length
    const pending = workspace.applications.filter(
        (application) => application.status === "pending"
    ).length

    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Applied Tuitions"
                    value={workspace.applications.length}
                    hint="All applications sent"
                    icon={ClipboardList}
                />
                <StatCard
                    label="Accepted Applications"
                    value={accepted}
                    hint="Confirmed by tutors"
                    icon={CheckCircle2}
                />
                <StatCard
                    label="Pending Applications"
                    value={pending}
                    hint="Waiting for a decision"
                    icon={Clock3}
                />
                <StatCard
                    label="Current Plan"
                    value={workspace.plan === "pro" ? "Pro" : "Free"}
                    hint={
                        workspace.plan === "pro"
                            ? "Unlimited applications"
                            : "Up to 5 applications"
                    }
                    icon={workspace.plan === "pro" ? Crown : Sparkles}
                    valueIcon={
                        workspace.plan === "pro" ? <PremiumCrown /> : undefined
                    }
                    valueClassName={
                        workspace.plan === "pro"
                            ? "text-[#7c3aed] dark:text-[#a78bfa]"
                            : undefined
                    }
                />
            </div>

            <section className="glass-surface rounded-3xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="font-heading text-lg font-semibold">
                            Quick actions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Track your applications and find your next batch.
                        </p>
                    </div>
                    <ButtonLink href="/tuitions" size="sm">
                        <Compass />
                        Find tuitions
                    </ButtonLink>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <ButtonLink
                        href="/dashboard/student/my-applications"
                        variant="secondary"
                        className="h-auto min-h-24 flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left"
                    >
                        <ClipboardList className="size-5 text-primary" />
                        <span>My applications</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {pending} pending decision{pending === 1 ? "" : "s"}
                        </span>
                    </ButtonLink>
                    <ButtonLink
                        href="/tuitions"
                        variant="secondary"
                        className="h-auto min-h-24 flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left"
                    >
                        <Compass className="size-5 text-primary" />
                        <span>Browse batches</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            Search by subject, level or mode
                        </span>
                    </ButtonLink>
                    <ButtonLink
                        href="/pricing"
                        variant="secondary"
                        className="h-auto min-h-24 flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left"
                    >
                        <Sparkles className="size-5 text-primary" />
                        <span
                            className={
                                workspace.plan === "pro"
                                    ? "flex items-center gap-1.5 text-[#7c3aed] dark:text-[#a78bfa]"
                                    : undefined
                            }
                        >
                            {workspace.plan === "pro" ? <PremiumCrown /> : null}
                            {workspace.plan === "pro" ? "Pro active" : "Upgrade to Pro"}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {workspace.plan === "pro"
                                ? "Unlimited applications"
                                : "Apply without limits"}
                        </span>
                    </ButtonLink>
                </div>
            </section>

            <section className="glass-surface rounded-3xl p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-lg font-semibold">
                        Recent applications
                    </h2>
                    <ButtonLink
                        href="/dashboard/student/my-applications"
                        variant="link"
                        size="sm"
                    >
                        View all
                    </ButtonLink>
                </div>

                {workspace.applications.length === 0 ? (
                    <p className="mt-6 rounded-2xl bg-[var(--glass-tint-soft)] p-5 text-center text-sm text-muted-foreground">
                        No applications yet. Apply to a tuition batch to see it
                        here.
                    </p>
                ) : (
                    <ul className="mt-4 divide-y divide-border">
                        {workspace.applications.slice(0, 4).map((application) => (
                            <li
                                key={application.id}
                                className="flex flex-wrap items-center justify-between gap-3 py-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {application.tuitionTitle}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {application.tutorName ?? application.tutorEmail} ·{" "}
                                        {formatDate(application.appliedAt)}
                                    </p>
                                </div>
                                <StatusBadge status={application.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}
