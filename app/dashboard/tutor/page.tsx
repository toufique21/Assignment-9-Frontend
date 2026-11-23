"use client"

import {
    CheckCircle2,
    ClipboardList,
    PlusCircle,
    Sparkles,
    Users,
} from "lucide-react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTutorWorkspace } from "@/hooks/use-tutor-workspace"
import { canPostTuition } from "@/lib/tutor-data"

export default function TutorOverviewPage() {
    const { workspace, error, isPending, isReady } = useTutorWorkspace()

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
        return <ErrorState message={error} />
    }

    const activeApproved = workspace.tuitions.filter(
        (tuition) => tuition.isActive && tuition.approvalStatus === "approved"
    ).length
    const pendingApplications = workspace.applications.filter(
        (application) => application.status === "pending"
    ).length
    const canPost = canPostTuition(workspace)

    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Tuitions Posted"
                    value={workspace.tuitions.length}
                    hint={canPost ? "You can post more" : "Free limit reached"}
                    icon={ClipboardList}
                />
                <StatCard
                    label="Active / Approved"
                    value={activeApproved}
                    hint="Visible to students"
                    icon={CheckCircle2}
                />
                <StatCard
                    label="Total Applicants Received"
                    value={workspace.applications.length}
                    hint={`${pendingApplications} waiting for review`}
                    icon={Users}
                />
                <StatCard
                    label="Current Plan"
                    value={workspace.plan === "pro" ? "Pro" : "Free"}
                    hint={
                        workspace.plan === "pro"
                            ? "Unlimited posts"
                            : "Up to 2 tuition posts"
                    }
                    icon={Sparkles}
                />
            </div>

            <section className="glass-surface rounded-3xl p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="font-heading text-lg font-semibold">
                            Quick actions
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Keep your batches and applicants up to date.
                        </p>
                    </div>
                    <ButtonLink href="/dashboard/tutor/post-tuition" size="sm">
                        <PlusCircle />
                        Post tuition
                    </ButtonLink>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <ButtonLink
                        href="/dashboard/tutor/my-tuitions"
                        variant="secondary"
                        className="h-auto min-h-24 flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left"
                    >
                        <ClipboardList className="size-5 text-primary" />
                        <span>Manage tuitions</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            Edit, close or delete batches
                        </span>
                    </ButtonLink>
                    <ButtonLink
                        href="/dashboard/tutor/applicants"
                        variant="secondary"
                        className="h-auto min-h-24 flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left"
                    >
                        <Users className="size-5 text-primary" />
                        <span>Review applicants</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {pendingApplications} pending decision
                        </span>
                    </ButtonLink>
                    <ButtonLink
                        href="/pricing"
                        variant="secondary"
                        className="h-auto min-h-24 flex-col items-start gap-1 rounded-2xl px-4 py-4 text-left"
                    >
                        <Sparkles className="size-5 text-primary" />
                        <span>{workspace.plan === "pro" ? "Pro active" : "Upgrade to Pro"}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {workspace.plan === "pro"
                                ? "Unlimited tuition posts"
                                : "Post without limits"}
                        </span>
                    </ButtonLink>
                </div>
            </section>

            <section className="glass-surface rounded-3xl p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="font-heading text-lg font-semibold">
                        Recent applicants
                    </h2>
                    <ButtonLink
                        href="/dashboard/tutor/applicants"
                        variant="link"
                        size="sm"
                    >
                        View all
                    </ButtonLink>
                </div>

                {workspace.applications.length === 0 ? (
                    <p className="mt-6 rounded-2xl bg-[var(--glass-tint-soft)] p-5 text-center text-sm text-muted-foreground">
                        No applications yet. New student applications will appear
                        here.
                    </p>
                ) : (
                    <ul className="mt-4 divide-y divide-border">
                        {workspace.applications.slice(0, 3).map((application) => (
                            <li
                                key={application.id}
                                className="flex flex-wrap items-center justify-between gap-3 py-3"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {application.studentName}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {application.tuitionTitle}
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
